/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    MEDIA_URL: process.env.MEDIA_URL,
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
  }
}

module.exports = nextConfig
