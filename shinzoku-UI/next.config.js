module.exports = {
    typescript: {
        // Disable type checking in Next.js (run manually with `tsc --noEmit`)
        ignoreBuildErrors: false
    },
    eslint: {
        // Disable ESLint during dev builds to reduce RAM
        ignoreDuringBuilds: true
    }
};
