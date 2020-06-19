module.exports = {
	port: process.env.TMS_APP_PORT || 3000,
	name: process.env.TMS_APP_NAME || 'tms-portal-back',
	router: {
		auth: {
			prefix: 'auth', // 接口调用url的前缀
		},
		controllers: {
			prefix: 'api', // 接口调用url的前缀，例如：/api
		},
	},
	auth: {
		disabled: true,
		captcha: { code: 'a1z9' },
		client: { accounts: [{ id: 1, username: 'user1', password: '123456' }] },
		jwt: {
			privateKey: 'tms-back-secret',
			expiresIn: 7200,
		},
	},
	tmsTransaction: false,
}
