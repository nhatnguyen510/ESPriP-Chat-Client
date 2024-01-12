/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "i.pravatar.cc", "res.cloudinary.com"],
  },
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
    },
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:slug*",
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/:slug*`,
      },
    ];
  },
};

module.exports = nextConfig;
