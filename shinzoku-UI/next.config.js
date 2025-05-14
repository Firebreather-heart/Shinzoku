/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['res.cloudinary.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/df8qelq0r/**',
            },
        ],
    },
    typescript: {
        // Disable type checking in Next.js (run manually with `tsc --noEmit`)
        ignoreBuildErrors: false
    },
    eslint: {
        // Disable ESLint during dev builds to reduce RAM
        ignoreDuringBuilds: true
    }
}

module.exports = nextConfig
