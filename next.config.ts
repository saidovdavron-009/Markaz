import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Mana shu qatorni qo'shing
  images: {
    unoptimized: true, // Statik sayt uchun bu ham kerak bo'ladi
  },
};

export default nextConfig;
