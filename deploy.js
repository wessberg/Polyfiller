const {NodeSSH} = require("node-ssh");
const pkg = require("./package.json");
const {join} = require("path");
const {writeFileSync, readFileSync, existsSync} = require("fs");

const generatePackageJson = () =>
	JSON.stringify({
		...pkg,
		devDependencies: {},
		scripts: {
			start: "pm2 start dist/index.js"
		},
		dependencies: {
			...pkg.dependencies,
			pm2: "latest"
		}
	});

const generateNginxConfig = () => `\
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;
        
        server_name ${DEPLOY_DOMAIN_NAMES};

        location / {
                proxy_pass http://localhost:${DEPLOY_PORT};
								proxy_http_version 1.1;
								proxy_set_header Upgrade $http_upgrade;
								proxy_set_header Connection 'upgrade';
								proxy_set_header Host $host;
								proxy_cache_bypass $http_upgrade;
        }
}
`;

(async () => {
	const {DEPLOY_HOST, DEPLOY_USER_NAME, DEPLOY_KEY, DEPLOY_DOMAIN_NAMES, DEPLOY_PORT} = process.env;

	const REMOTE_ROOT = "/var/www/polyfiller";
	const DIST_LOCAL_FOLDER = "dist";
	const DIST_REMOTE_FOLDER = join(REMOTE_ROOT, "dist");
	const PACKAGE_JSON_LOCAL_FILE_NAME = `_package.json`;
	const PACKAGE_JSON_REMOTE_FILE_NAME = join(REMOTE_ROOT, `package.json`);

	const SSH_KEY_LOCAL_FILE_NAME = `ssh-key`;
	const NGINX_CONFIG_LOCAL_FILE_NAME = `nginx-config`;
	const NGINX_CONFIG_REMOTE_FILE_NAME = `/etc/nginx/sites-available/default`;
	const LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME = `last-deployment-data.json`;
	const LAST_DEPLOYMENT_DATA_REMOTE_FILE_NAME = `/var/www/last-deployment-data.json`;

	// Write the key to desk temporarily
	writeFileSync(SSH_KEY_LOCAL_FILE_NAME, DEPLOY_KEY);

	// Write the package.json file to desk temporarily
	writeFileSync(PACKAGE_JSON_LOCAL_FILE_NAME, generatePackageJson());

	// Connect to the hots machine via SSH
	const ssh = await new NodeSSH().connect({
		host: DEPLOY_HOST,
		username: DEPLOY_USER_NAME,
		privateKey: SSH_KEY_LOCAL_FILE_NAME
	});

	// Get the last deployment data (if any such data exists)
	await ssh.getFile(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME, LAST_DEPLOYMENT_DATA_REMOTE_FILE_NAME);
	const lastDeploymentData = existsSync(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME) ? JSON.parse(readFileSync(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME)) : undefined;

	// If we have deployed in the past, check if the nginx config needs to be updated (for example if the ports or domain names changed)
	if (lastDeploymentData != null) {
		const needsNginxUpdate = lastDeploymentData.DEPLOY_PORT !== DEPLOY_PORT || lastDeploymentData.DEPLOY_DOMAIN_NAMES !== DEPLOY_DOMAIN_NAMES;

		if (needsNginxUpdate) {
			// Write the nginx config to desk temporarily
			writeFileSync(NGINX_CONFIG_LOCAL_FILE_NAME, generateNginxConfig());

			// Update nginx config
			await ssh.putFile(NGINX_CONFIG_LOCAL_FILE_NAME, NGINX_CONFIG_REMOTE_FILE_NAME);

			// Reload nginx
			await ssh.execCommand(`sudo systemctl reload nginx`);
		}
	}

	// Now, update the deployment data
	writeFileSync(
		LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME,
		JSON.stringify(
			{
				DEPLOY_PORT,
				DEPLOY_DOMAIN_NAMES
			},
			null,
			"  "
		)
	);
	await ssh.putFile(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME, LAST_DEPLOYMENT_DATA_REMOTE_FILE_NAME);

	// Clean up the remote root
	await ssh.execCommand(`sudo rm -rf ${REMOTE_ROOT}`);
	await ssh.execCommand(`sudo mkdir ${REMOTE_ROOT}`);

	// Copy over the package.json file
	await ssh.putFile(PACKAGE_JSON_LOCAL_FILE_NAME, PACKAGE_JSON_REMOTE_FILE_NAME);

	// Copy over the built dist folder
	await ssh.putFile(DIST_LOCAL_FOLDER, DIST_REMOTE_FOLDER);

	// Install
	await ssh.execCommand(`npm ci`);

	const envVariables = Object.entries(process.env)
		.map(([key, value]) => `${key}=${value}`)
		.join(" ");

	// Run
	await ssh.execCommand(`${envVariables} pm2 reload all`);
})()
	.catch(() => process.exit(1))
	.then(() => process.exit(0));
