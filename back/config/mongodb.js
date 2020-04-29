module.exports = {
  master: {
    host: process.env.TMS_PORTAL_MONGODB_HOST || '127.0.0.1',
    port: parseInt(process.env.TMS_PORTAL_MONGODB_PORT) || 27017
  }
}
