module.exports = {
  port: 3000,
  name: 'tms-portal-back',
  router: {
    auth: {
      prefix: '' // 接口调用url的前缀
    },
    controllers: {
      prefix: 'api' // 接口调用url的前缀，例如：/api
    }
  },
  auth: {
    disabled: true,
    captcha: { code: 'a1z9' },
    client: { accounts: [{ id: 1, username: 'user1', password: '123456' }] },
    jwt: {
      privateKey: 'tms-back-secret',
      expiresIn: 7200
    }
  },
  tmsTransaction: false
}
