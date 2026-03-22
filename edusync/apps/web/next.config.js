/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@edusync/shared", "@edusync/db"],
  turbopack: {
    root: "../../",
  },
};

module.exports = nextConfig;
