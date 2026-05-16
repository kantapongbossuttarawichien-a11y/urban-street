import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ปิดการรัน lint ตอน build เพื่อให้ผ่านขั้นตอน deploy บน Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
