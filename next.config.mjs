/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Three Fiber needs this to work inside Next.js
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;
