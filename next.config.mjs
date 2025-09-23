/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Redirect main domain /blog to blog subdomain
      {
        source: '/blog',
        has: [
          {
            type: 'host',
            value: 'esubalew.et',
          },
        ],
        destination: 'https://blog.esubalew.et/blog',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        has: [
          {
            type: 'host',
            value: 'esubalew.et',
          },
        ],
        destination: 'https://blog.esubalew.et/blog/:path*',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      // Handle blog subdomain rewrites
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'blog.esubalew.et',
          },
        ],
        destination: '/blog',
      },
      {
        source: '/:path((?!blog/).*)',
        has: [
          {
            type: 'host',
            value: 'blog.esubalew.et',
          },
        ],
        destination: '/blog/:path',
      },
    ]
  },
}

export default nextConfig
