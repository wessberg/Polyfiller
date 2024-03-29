import {NodeSSH} from "node-ssh";
import {satisfies} from "semver";
import pkg from "./package.json" assert {type: "json"};
import {join, dirname, basename} from "path";
import {writeFileSync, readFileSync, existsSync, mkdirSync, copyFileSync, chmodSync, readdirSync} from "fs";

let {
	RUNNER_TEMP,
	DEPLOY_HOST,
	DEPLOY_USER_NAME,
	DEPLOY_KEY,
	DEPLOY_KEY_LOCATION,
	PRODUCTION,
	VOLUMES,
	INTERNAL_HOST_DEVELOPMENT,
	INTERNAL_HOST_PRODUCTION,
	INTERNAL_PORT_DEVELOPMENT,
	INTERNAL_PORT_PRODUCTION,
	DOMAIN_NAMES_DEVELOPMENT,
	DOMAIN_NAMES_PRODUCTION,
	SENTRY_DSN_DEVELOPMENT,
	SENTRY_DSN_PRODUCTION
} = process.env;

for (const envVar of ["DOMAIN_NAMES_DEVELOPMENT", "DOMAIN_NAMES_PRODUCTION"]) {
	if (process.env[envVar] == null || process.env[envVar].length < 1) {
		throw new ReferenceError(`Expected ${envVar} environment variable to be set`);
	}
}

// Coerce to boolean
PRODUCTION = PRODUCTION === true || PRODUCTION === "true" || PRODUCTION === "1" || PRODUCTION === "y";

DOMAIN_NAMES_PRODUCTION = DOMAIN_NAMES_PRODUCTION.split(/\s/)
	.map(domainName => [domainName, `www.${domainName}`])
	.flat();
DOMAIN_NAMES_DEVELOPMENT = DOMAIN_NAMES_DEVELOPMENT.split(/\s/);

const DOMAIN_CONFIGURATIONS = [
	...DOMAIN_NAMES_PRODUCTION.map(domainName => ({domainName, host: INTERNAL_HOST_PRODUCTION, port: INTERNAL_PORT_PRODUCTION})),
	...DOMAIN_NAMES_DEVELOPMENT.map(domainName => ({domainName, host: INTERNAL_HOST_DEVELOPMENT, port: INTERNAL_PORT_DEVELOPMENT}))
];

console.log("is production:", PRODUCTION);

const generatePackageJson = () =>
	JSON.stringify(
		{
			...pkg,
			devDependencies: {},
			scripts: {
				start: "node dist/esm/index.js"
			},
			dependencies: {
				...pkg.dependencies
			}
		},
		null,
		"  "
	);

const generateNginxConfig = () => `\
${DOMAIN_CONFIGURATIONS.map(
	({domainName, port}) => `\
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    ssl_certificate /etc/letsencrypt/live/${domainName}/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/${domainName}/privkey.pem; # managed by Certbot

    server_name ${domainName};

    location / {
    		proxy_pass http://localhost:${port};
				proxy_http_version 1.1;
				proxy_set_header Upgrade $http_upgrade;
				proxy_set_header Connection 'upgrade';
				proxy_set_header Host $host;
				proxy_cache_bypass $http_upgrade;
    }

}
`
).join("\n")}

server {
		${DOMAIN_CONFIGURATIONS.map(
			({domainName}) => `\
    if ($host = ${domainName}) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
		`
		).join("\n")}
}
`;

const PREFERRED_NODE_VERSION = "19.x";
const APP_NAME = PRODUCTION ? "polyfiller" : "polyfiller-development";
const LOCAL_WRITE_ROOT = RUNNER_TEMP ?? "temp";
const REMOTE_ROOT = `/var/www/${APP_NAME}`;
const DIST_LOCAL_FOLDER = "dist";
const DIST_REMOTE_FOLDER = join(REMOTE_ROOT, DIST_LOCAL_FOLDER);
const POLYFILL_LIB_LOCAL_FOLDER = "polyfill-lib";
const POLYFILL_LIB_REMOTE_FOLDER = join(REMOTE_ROOT, POLYFILL_LIB_LOCAL_FOLDER);
const FILE_CONTENT_INJECTOR_LOCAL_FILE_NAME = join(LOCAL_WRITE_ROOT, `file-content-injector.js`);
const FILE_CONTENT_INJECTOR_REMOTE_FILE_NAME = join(REMOTE_ROOT, `file-content-injector.js`);
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
if (!existsSync(SSH_KEY_LOCAL_FILE_NAME)) {
	writeFileSync(SSH_KEY_LOCAL_FILE_NAME, DEPLOY_KEY ?? readFileSync(DEPLOY_KEY_LOCATION, "utf8"));
	chmodSync(SSH_KEY_LOCAL_FILE_NAME, "400");
}

// Write the package.json file to desk temporarily
mkdirSync(dirname(PACKAGE_JSON_LOCAL_FILE_NAME), {recursive: true});
writeFileSync(PACKAGE_JSON_LOCAL_FILE_NAME, generatePackageJson());

// Copy the package-lock into the temp folder
copyFileSync("package-lock.json", PACKAGE_LOCK_LOCAL_FILE_NAME);

// Copy the file-content-injector into the temp folder
copyFileSync("file-content-injector.js", FILE_CONTENT_INJECTOR_LOCAL_FILE_NAME);

console.log("Temporary directory contents:", readdirSync(LOCAL_WRITE_ROOT));

// Connect to the host machine via SSH
console.log(`Connecting to host machine via SSH`);
const ssh = await new NodeSSH().connect({
	host: DEPLOY_HOST,
	username: DEPLOY_USER_NAME,
	privateKey: SSH_KEY_LOCAL_FILE_NAME
});

const sftp = await ssh.requestSFTP();

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
const nodeVersion = needsNode ? undefined : (await ssh.execCommand("node -v")).stdout.slice(1);
const hasAcceptableNodeVersion = nodeVersion != null && satisfies(nodeVersion, PREFERRED_NODE_VERSION);
if (needsNode || !hasAcceptableNodeVersion) {
	console.log(
		!needsNode
			? `v${nodeVersion} of Node.js is installed on the host machine, which is lower than the requested v${PREFERRED_NODE_VERSION}. Node.js will need to be updated.`
			: "Node.js is missing on the host machine. Installing"
	);

	await ssh.execCommand(`cd ~`);
	await ssh.execCommand(`curl -sL https://deb.nodesource.com/setup_${PREFERRED_NODE_VERSION} -o nodesource_setup.sh`);
	await ssh.execCommand(`sudo bash nodesource_setup.sh`);
	await ssh.execCommand(`sudo apt --fix-broken install -y`);
	await ssh.execCommand(`sudo apt install nodejs -y`);
	await ssh.execCommand(`rm nodesource_setup.sh`);

	// Re-check the installed Node version and ensure that it is in fact the intended one
	const nodeVersionNow = (await ssh.execCommand("node -v")).stdout.slice(1);
	if (!satisfies(nodeVersionNow, PREFERRED_NODE_VERSION)) {
		throw new ReferenceError(`Node v${PREFERRED_NODE_VERSION} could not be installed.`);
	} else {
		console.log("Node.js successfully installed!");
	}


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
	await ssh.getFile(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME, LAST_DEPLOYMENT_DATA_REMOTE_FILE_NAME, sftp);
} catch {
	// The file doesn't exist
}
const lastDeploymentData = existsSync(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME) ? JSON.parse(readFileSync(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME, "utf8")) : undefined;

const lastDeploymentDataVolumes =
	lastDeploymentData == null || lastDeploymentData.VOLUMES == null
		? []
		: lastDeploymentData.VOLUMES.split(" ")
				.map(p => p.trim())
				.filter(p => p.length > 0);
const newDeploymentDataVolumes = (VOLUMES || "")
	.split(" ")
	.map(p => p.trim())
	.filter(p => p.length > 0);

// It may need to update the logic for automatically mounting disks on boot
const needsMountingUpdate =
	lastDeploymentDataVolumes.length !== newDeploymentDataVolumes.length || newDeploymentDataVolumes.some((volume, i) => lastDeploymentDataVolumes[i] !== volume);

// If we have deployed in the past, check if the nginx config needs to be updated (for example if the ports or domain names changed)
const needsNginxUpdate =
	lastDeploymentData == null ||
	lastDeploymentData.INTERNAL_HOST_DEVELOPMENT !== INTERNAL_HOST_DEVELOPMENT ||
	lastDeploymentData.INTERNAL_HOST_PRODUCTION !== INTERNAL_HOST_PRODUCTION ||
	String(lastDeploymentData.INTERNAL_PORT_DEVELOPMENT) !== String(INTERNAL_PORT_DEVELOPMENT) ||
	String(lastDeploymentData.INTERNAL_PORT_PRODUCTION) !== String(INTERNAL_PORT_PRODUCTION) ||
	JSON.stringify(lastDeploymentData.DOMAIN_NAMES_DEVELOPMENT) !== JSON.stringify(DOMAIN_NAMES_DEVELOPMENT) ||
	JSON.stringify(lastDeploymentData.DOMAIN_NAMES_PRODUCTION) !== JSON.stringify(DOMAIN_NAMES_PRODUCTION);

if (needsNginxUpdate) {
	console.log(`Nginx config needs update`);
	// Write the nginx config to desk temporarily
	writeFileSync(NGINX_CONFIG_LOCAL_FILE_NAME, generateNginxConfig());

	// Update nginx config
	console.log(`Updating Nginx config`);
	await ssh.putFile(NGINX_CONFIG_LOCAL_FILE_NAME, NGINX_CONFIG_REMOTE_FILE_NAME, sftp);
	console.log(`Nginx config successfully updated`);

	// Reload nginx
	console.log(`Reloading nginx`);
	await ssh.execCommand(`sudo systemctl reload nginx`);
	console.log(`Nginx successfully reloaded`);

	const newDeploymentData = {
		INTERNAL_HOST_DEVELOPMENT,
		INTERNAL_HOST_PRODUCTION,
		INTERNAL_PORT_DEVELOPMENT,
		INTERNAL_PORT_PRODUCTION,
		DOMAIN_NAMES_DEVELOPMENT,
		DOMAIN_NAMES_PRODUCTION,
		VOLUMES
	};

	// Now, update the deployment data
	writeFileSync(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME, JSON.stringify(newDeploymentData, null, "  "));
	console.log(`Updating cached deployment stats`);
	await ssh.putFile(LAST_DEPLOYMENT_DATA_LOCAL_FILE_NAME, LAST_DEPLOYMENT_DATA_REMOTE_FILE_NAME, sftp);
	console.log(`Successfully updated cached deployment stats`);
} else {
	console.log(`Nginx config is up to date`);
}

if (needsMountingUpdate) {
	console.log(`Mounted volumes has changed`);

	// First remove previously mounted volumes if they exist
	for (const volume of lastDeploymentDataVolumes) {
		try {
			// Unmount
			await ssh.execCommand(`umount ${volume}`);

			// Remove mounted folder
			await ssh.execCommand(`rm -rf ${volume}`);

			// Remove from fstab
			await ssh.execCommand(`grep -vwE "${volume}" /etc/fstab > /etc/fstab`);
		} catch {
			// This is fine
		}
	}

	// Now, mount the new ones
	for (const volume of newDeploymentDataVolumes) {
		// # Create a mount point for the volume if it doesn't already exist:
		await ssh.execCommand(`mkdir -p ${volume}`);

		// Mount the volume at the newly-created mount point:
		await ssh.execCommand(`mount -o discard,defaults,noatime /dev/disk/by-id/scsi-0DO_Volume_${basename(volume).replace(/_/g, "-")} ${volume}`);

		// Change fstab so the volume will be mounted after a reboot
		await ssh.execCommand(`echo '/dev/disk/by-id/scsi-0DO_Volume_${basename(volume).replace(/_/g, "-")} ${volume} ext4 defaults,nofail,discard 0 0' | sudo tee -a /etc/fstab`);
	}
} else {
	console.log(`Correct volumes are already mounted`);
}

// Clean up the remote root
console.log("Cleaning up remote root");
await ssh.execCommand(`sudo rm -rf ${DIST_REMOTE_FOLDER}`);
await ssh.execCommand(`mkdir -rf ${REMOTE_ROOT}`);

// Copy over the package.json file
console.log(`Creating ${PACKAGE_JSON_REMOTE_FILE_NAME}`);

await ssh.putFile(PACKAGE_JSON_LOCAL_FILE_NAME, PACKAGE_JSON_REMOTE_FILE_NAME, sftp);

// Copy over the package-lock.json file
console.log(`Creating ${PACKAGE_LOCK_REMOTE_FILE_NAME}`);
await ssh.putFile(PACKAGE_LOCK_LOCAL_FILE_NAME, PACKAGE_LOCK_REMOTE_FILE_NAME, sftp, {
	concurrency: 1
});

// Copy over the file-content-injector.js file
console.log(`Creating ${FILE_CONTENT_INJECTOR_REMOTE_FILE_NAME}`);
await ssh.putFile(FILE_CONTENT_INJECTOR_LOCAL_FILE_NAME, FILE_CONTENT_INJECTOR_REMOTE_FILE_NAME, sftp, {
	concurrency: 1
});

// Copy over the built dist folder
console.log(`Creating ${DIST_REMOTE_FOLDER}`);
await ssh.putDirectory(DIST_LOCAL_FOLDER, DIST_REMOTE_FOLDER, {concurrency: 1, sftp, transferOptions: {concurrency: 1}});

// Copy over the built polyfill-lib folder
console.log(`Creating ${POLYFILL_LIB_REMOTE_FOLDER}`);
await ssh.putDirectory(POLYFILL_LIB_LOCAL_FOLDER, POLYFILL_LIB_REMOTE_FOLDER, {concurrency: 1, sftp, transferOptions: {concurrency: 1}});

// Install
console.log(`Installing in ${REMOTE_ROOT}`);
await ssh.execCommand(`npm ci`, {cwd: REMOTE_ROOT});

// Inject
console.log(`Injecting file content replacements in ${REMOTE_ROOT}`);
await ssh.execCommand(`node file-content-injector.js`, {cwd: REMOTE_ROOT});

// Run
console.log(`Running`);
const pm2NeverRan = (await ssh.execCommand(`npx pm2 show ${APP_NAME}`, {cwd: REMOTE_ROOT})).stdout === "";

const envVariables = Object.entries({
	PRODUCTION: String(PRODUCTION),
	NODE_ENV: PRODUCTION ? "production" : "development",
	HOST: PRODUCTION ? INTERNAL_HOST_PRODUCTION : INTERNAL_HOST_DEVELOPMENT,
	PORT: PRODUCTION ? INTERNAL_PORT_PRODUCTION : INTERNAL_PORT_DEVELOPMENT,
	SENTRY_DSN: PRODUCTION ? SENTRY_DSN_PRODUCTION : SENTRY_DSN_DEVELOPMENT
})
	.map(([key, value]) => `${key}=${value}`)
	.join(" ");

if (pm2NeverRan) {
	await ssh.execCommand(`${envVariables} npx pm2 start npm --name "${APP_NAME}" -- start`, {cwd: REMOTE_ROOT});
} else {
	await ssh.execCommand(`${envVariables} npx pm2 reload ${APP_NAME} --update-env`, {cwd: REMOTE_ROOT});
}
console.log("Done!");

process.exit(0);