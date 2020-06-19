module.exports = {
	apps: [
		{
			name: 'tms-portal-back',
			script: 'node server',

			instances: 1,
			autorestart: true,
			watch: true,
			ignore_watch: ['node_modules', 'tests', 'files'],
			max_memory_restart: '1G',
			env: {
				NODE_ENV: 'development',
				TMS_PORTAL_MONGODB_HOST: 'localhost',
				TMS_PORTAL_MONGODB_PORT: 27017
			},
			env_tenant: {
				NODE_ENV: 'tenant',
				TMW_REQUIRE_BUCKET: 'yes',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		}
	]
}
