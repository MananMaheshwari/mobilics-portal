/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: { appDir: true, serverComponentsExternalPackages: ["mongoose"] },
    webpack(config) {
        config.experiments = { ...config.experiments, topLevelAwait: true };
        return config;
    }
    // experimental: {
    //     serverComponentsExternalPackages: ['@acme/ui'],
    // },
}

module.exports = nextConfig
