import type { NextConfig } from 'next';
import path from 'node:path';
const config: NextConfig = {
  turbopack: { root: path.resolve(process.cwd(), '..') },
  output: 'export',
  trailingSlash: true,
  basePath: process.env.SITE_BASE_PATH ?? '',
  images: { unoptimized: true },
  poweredByHeader: false,
};
export default config;
