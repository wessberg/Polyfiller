(async () => {
	const {NodeSSH} = require("node-ssh");
	const {sync: rimraf} = require("rimraf");
	const {execSync} = require("child_process");
	const pkg = require("./package.json");
	const {join, dirname} = require("path");
	const {writeFileSync, readFileSync, existsSync, mkdirSync, copyFileSync, chmodSync, readdirSync} = require("fs");

	const {DEPLOY_HOST, DEPLOY_USER_NAME, DEPLOY_KEY, DEPLOY_KEY_LOCATION, DEPLOY_DOMAIN_NAMES, HOST, PORT, RUNNER_TEMP} = process.env;

	const generatePackageJson = () =>
		JSON.stringify(
			{
				...pkg,
				devDependencies: {},
				scripts: {
					start: "node dist/index.js"
				},
				dependencies: {
					...pkg.dependencies,
					pm2: "latest"
				}
			},
			null,
			"  "
		);

	const generateNginxConfig = () => `\
${DEPLOY_DOMAIN_NAMES.split(/\s/)
	.map(
		domainName => `\
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    ssl_certificate /etc/letsencrypt/live/${domainName}/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/${domainName}/privkey.pem; # managed by Certbot

    server_name ${domainName} www.${domainName};

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
    location / {
    		proxy_pass http://localhost:${PORT};
				proxy_http_version 1.1;
				proxy_set_header Upgrade $http_upgrade;
				proxy_set_header Connection 'upgrade';
				proxy_set_header Host $host;
				proxy_cache_bypass $http_upgrade;
    }

}
`
	)
	.join("\n")}

server {
		${DEPLOY_DOMAIN_NAMES.split(/\s/)
			.map(
				domainName => `\
		if ($host = www.${domainName}) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    
    if ($host = ${domainName}) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
		`
			)
			.join("\n")}
}
`;

	const PREFERRED_NODE_VERSION = "14.x";
	const APP_NAME = "polyfiller";
	const LOCAL_WRITE_ROOT = RUNNER_TEMP ?? "temp";
	const REMOTE_ROOT = "/var/www/polyfiller";
	const DIST_LOCAL_FOLDER = "dist";
	const DIST_REMOTE_FOLDER = join(REMOTE_ROOT, DIST_LOCAL_FOLDER);
	const POLYFILL_LIB_LOCAL_FOLDER = "polyfill-lib";
	const POLYFILL_LIB_REMOTE_FOLDER = join(REMOTE_ROOT, POLYFILL_LIB_LOCAL_FOLDER);
	const PACKAGE_LOCK_LOCAL_FILE_NAME = join(LOCAL_WRITE_ROOT, `package-lock.json`);
	const PACKAGE_LOCK_REMOTE_FILE_NAME = join(REMOTE_ROOT, `package-lock.json`);
	const PACKAGE_JSON_LOCAL_FILE_NAME = join(LOCAL_WRITE_ROOT, `package.json`);
	const PACKAGE_JSON_REMOTE_FILE_NAME = join(REMOTE_ROOT, `package.json`);

	const SSH_KEY_LOCAL_FILE_NAME = join(LOCAL_WRITE_ROOT, `ssh-key`);
	const NGINX_CONFIG_LOCAL_FILE_NAME = join(LOCAL_WRITE_ROOT, `nginx-config`);
	const NGINX_CONFIG_REMOTE_FILE_NAME = `/etc/nginx/sites-available/default`;
	const LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME = join(LOCAL_WRITE_ROOT, `last-deployment-data.json`);
	const LAST_DEPLOYMENT_DATA_REMOTE_FILE_NAME = `/var/www/last-deployment-data.json`;

	console.log("Using temporary directory:", LOCAL_WRITE_ROOT);

	// Write the key to desk temporarily
	mkdirSync(dirname(SSH_KEY_LOCAL_FILE_NAME), {recursive: true});
	writeFileSync(SSH_KEY_LOCAL_FILE_NAME, DEPLOY_KEY ?? readFileSync(DEPLOY_KEY_LOCATION, "utf8"));
	chmodSync(SSH_KEY_LOCAL_FILE_NAME, "400");

	// Write the package.json file to desk temporarily
	mkdirSync(dirname(PACKAGE_JSON_LOCAL_FILE_NAME), {recursive: true});
	writeFileSync(PACKAGE_JSON_LOCAL_FILE_NAME, generatePackageJson());

	// Copy the package-lock into the temp folder
	copyFileSync("package-lock.json", PACKAGE_LOCK_LOCAL_FILE_NAME);

	console.log("Temporary directory contents:", readdirSync(LOCAL_WRITE_ROOT));

	// Connect to the host machine via SSH
	console.log(`Connecting to host machine via SSH`);
	const ssh = await new NodeSSH().connect({
		host: DEPLOY_HOST,
		username: DEPLOY_USER_NAME,
		privateKey: SSH_KEY_LOCAL_FILE_NAME
	});
	console.log(`Successfully connected to host machine`);

	console.log("Checking for make support");
	const needsMake = (await ssh.execCommand("which make")).stdout === "";
	const needsGPlusPlus = (await ssh.execCommand("which g++")).stdout === "";
	if (needsMake || needsGPlusPlus) {
		console.log("make is missing on the host machine. Installing");
		await ssh.execCommand(`sudo apt-get install build-essential -y`);
		console.log("Make successfully installed!");
	} else {
		console.log("Make is already supported");
	}

	console.log("Checking for Node.js support");
	const needsNode = (await ssh.execCommand("which node")).stdout === "";
	if (needsNode) {
		console.log("Node.js is missing on the host machine. Installing");
		await ssh.execCommand(`cd ~`);
		await ssh.execCommand(`curl -sL https://deb.nodesource.com/setup_${PREFERRED_NODE_VERSION} -o nodesource_setup.sh`);
		await ssh.execCommand(`sudo bash nodesource_setup.sh`);
		await ssh.execCommand(`sudo apt install nodejs -y`);
		await ssh.execCommand(`rm nodesource_setup.sh`);
		console.log("Node.js successfully installed!");
	} else {
		console.log("Node.js is already supported");
	}

	console.log("Checking for Nginx support");
	const needsNginx = (await ssh.execCommand("which nginx")).stdout === "";
	if (needsNginx) {
		console.log("Nginx is missing on the host machine. Installing");
		await ssh.execCommand(`sudo apt-get update && sudo apt-get install nginx -y`);
		await ssh.execCommand(`sudo ufw allow 'Nginx Full'`);
		console.log("Nginx successfully installed!");
	} else {
		console.log("Nginx is already supported");
	}

	console.log("Checking for Certbot support");
	const needsCertbot = (await ssh.execCommand("which certbot")).stdout === "";
	if (needsCertbot) {
		console.log("Certbot is missing on the host machine. Installing");
		await ssh.execCommand(`sudo add-apt-repository ppa:certbot/certbot`);
		await ssh.execCommand(`sudo apt-get update`);
		await ssh.execCommand(`sudo apt install python-certbot-nginx -y`);
		console.log("Certbot successfully installed!");
	} else {
		console.log("Certbot is already supported");
	}

	// Get the last deployment data (if any such data exists)
	console.log(`Check if nginx config needs to be updated`);
	try {
		await ssh.getFile(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME, LAST_DEPLOYMENT_DATA_REMOTE_FILE_NAME, undefined);
	} catch {
		// The file doesn't exist
	}
	const lastDeploymentData = existsSync(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME) ? JSON.parse(readFileSync(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME)) : undefined;

	// If we have deployed in the past, check if the nginx config needs to be updated (for example if the ports or domain names changed)
	const needsNginxUpdate = lastDeploymentData == null || lastDeploymentData.PORT !== PORT || lastDeploymentData.DEPLOY_DOMAIN_NAMES !== DEPLOY_DOMAIN_NAMES;

	if (needsNginxUpdate) {
		console.log(`Nginx config needs update`);
		// Write the nginx config to desk temporarily
		writeFileSync(NGINX_CONFIG_LOCAL_FILE_NAME, generateNginxConfig());

		// Update nginx config
		console.log(`Updating Nginx config`);
		await ssh.putFile(NGINX_CONFIG_LOCAL_FILE_NAME, NGINX_CONFIG_REMOTE_FILE_NAME);
		console.log(`Nginx config successfully updated`);

		// Reload nginx
		console.log(`Reloading nginx`);
		await ssh.execCommand(`sudo systemctl reload nginx`);
		console.log(`Nginx successfully reloaded`);

		const newDeploymentData = {
			PORT,
			DEPLOY_DOMAIN_NAMES
		};

		// Now, update the deployment data
		writeFileSync(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME, JSON.stringify(newDeploymentData, null, "  "));
		console.log(`Updating cached deployment stats`);
		await ssh.putFile(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME, LAST_DEPLOYMENT_DATA_REMOTE_FILE_NAME);
		console.log(`Successfully updated cached deployment stats`);
	} else {
		console.log(`Nginx config is up to date`);
	}

	// Clean up the remote root
	console.log("Cleaning up remote root");
	await ssh.execCommand(`sudo rm -rf ${DIST_REMOTE_FOLDER}`);
	await ssh.execCommand(`mkdir -rf ${REMOTE_ROOT}`);

	// Copy over the package.json and package-lock.json files
	console.log(`Creating ${PACKAGE_JSON_REMOTE_FILE_NAME} and ${PACKAGE_LOCK_REMOTE_FILE_NAME}`);

	await ssh.putFile(PACKAGE_JSON_LOCAL_FILE_NAME, PACKAGE_JSON_REMOTE_FILE_NAME, undefined, {
		step: (total_transferred, chunk, total) =>
			console.log({
				PACKAGE_JSON_REMOTE_FILE_NAME,
				total_transferred,
				chunk,
				total
			})
	});
	await ssh.putFile(PACKAGE_LOCK_LOCAL_FILE_NAME, PACKAGE_LOCK_REMOTE_FILE_NAME, {
		step: (total_transferred, chunk, total) =>
			console.log({
				PACKAGE_LOCK_REMOTE_FILE_NAME,
				total_transferred,
				chunk,
				total
			})
	});

	// Copy over the built dist folder
	console.log(`Creating ${DIST_REMOTE_FOLDER}`);
	await execSync(`scp -r -i ${SSH_KEY_LOCAL_FILE_NAME} ${DIST_LOCAL_FOLDER} ${DEPLOY_USER_NAME}@${DEPLOY_HOST}:${DIST_REMOTE_FOLDER}`);

	// Copy over the built polyfill-lib folder
	console.log(`Creating ${POLYFILL_LIB_REMOTE_FOLDER}`);
	await execSync(`scp -r -i ${SSH_KEY_LOCAL_FILE_NAME} ${POLYFILL_LIB_LOCAL_FOLDER} ${DEPLOY_USER_NAME}@${DEPLOY_HOST}:${POLYFILL_LIB_REMOTE_FOLDER}`);

	// Install
	console.log(`Installing`);
	await ssh.execCommand(`npm ci`, {cwd: REMOTE_ROOT});

	// Run
	console.log(`Running`);
	const pm2NeverRan = (await ssh.execCommand(`npx pm2 show ${APP_NAME}`, {cwd: REMOTE_ROOT})).stdout === "";
	if (pm2NeverRan) {
		await ssh.execCommand(`HOST=${HOST} PORT=${PORT} npx pm2 start npm --name "${APP_NAME}" -- start`, {cwd: REMOTE_ROOT});
	} else {
		await ssh.execCommand(`HOST=${HOST} PORT=${PORT} npx pm2 reload ${APP_NAME}`, {cwd: REMOTE_ROOT});
	}
	console.log("`Done!");
})()
	.catch(ex => {
		console.error(ex);
		process.exit(1);
	})
	.then(() => process.exit(0));
