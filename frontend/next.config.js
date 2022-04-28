const { i18n } = require('./next-i18next.config')

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8080/api/v1/:path*',
      },
    ]
  },
}

module.exports = {
  ...nextConfig,
  i18n,
}
