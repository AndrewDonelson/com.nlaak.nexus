import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    
    // Optionally, add more specific aliases if needed
    config.resolve.alias['@components'] = path.resolve(__dirname, 'components');
    config.resolve.alias['@convex'] = path.resolve(__dirname, 'convex');
    
    return config;
  },
};

export default nextConfig;