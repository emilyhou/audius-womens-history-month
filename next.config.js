/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Audius CDN patterns
      {
        protocol: 'https',
        hostname: 'audius-*.staked.cloud',
      },
      {
        protocol: 'https',
        hostname: 'creatornode*.audius.co',
      },
      {
        protocol: 'https',
        hostname: 'audius-creator-*.theblueprint.xyz',
      },
      {
        protocol: 'https',
        hostname: 'audius-content-*.figment.io',
      },
      {
        protocol: 'https',
        hostname: 'audius-figment-*.figment.io',
      },
      {
        protocol: 'https',
        hostname: '*.figment.io',
      },
      {
        protocol: 'https',
        hostname: '*.mainnet.audiusindex.org',
      },
      {
        protocol: 'https',
        hostname: '*.audiusindex.org',
      },
      {
        protocol: 'https',
        hostname: '*.shakespearetech.com',
      },
    ],
  },
}

module.exports = nextConfig
