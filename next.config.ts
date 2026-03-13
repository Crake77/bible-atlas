import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Three Fiber needs this to work inside Next.js
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;
