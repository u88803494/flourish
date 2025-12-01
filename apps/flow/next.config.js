/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude test files from TypeScript compilation
  typescript: {
    // This doesn't exclude files, but the tsconfig.json exclude does
    tsconfigPath: './tsconfig.json',
  },
};

export default nextConfig;
