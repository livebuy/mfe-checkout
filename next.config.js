// @ts-check

const nextBuildId = require("next-build-id")

const shouldAnalyzeBundles = process.env.ANALYZE === "true"

/** @type { import('next').NextConfig } */
let nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  eslint: {},
  poweredByHeader: false,
  swcMinify: false,
  webpack: (config) => {
    return config
  },
  // When when app is exported as SPA and served in a sub-folder
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH
    ? `${process.env.NEXT_PUBLIC_BASE_PATH}/`
    : undefined,
  // https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions#including-non-page-files-in-the-pages-directory
  pageExtensions: ["page.tsx"],
  // rewrite rules affect only development mode, since Next router will return 404 for paths that only exist in react-router
  async rewrites() {
    return [
      {
        source: "/:any*",
        destination: "/",
      },
    ]
  },
  generateBuildId: () => nextBuildId({ dir: __dirname }),
}

if (shouldAnalyzeBundles) {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  })
  nextConfig = withBundleAnalyzer(nextConfig)
}

module.exports = nextConfig
