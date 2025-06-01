const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false
      };
    }
    return config;
  },
  experimental: {
    forceSwcTransforms: true,
    esmExternals: 'loose',
    outputFileTracing: false, // ⛔ disable tracing
  }
};

module.exports = nextConfig;
