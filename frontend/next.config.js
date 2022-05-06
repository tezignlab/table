const { i18n } = require('./next-i18next.config')

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ]
  },
}

module.exports = {
  ...nextConfig,
  i18n,
}
