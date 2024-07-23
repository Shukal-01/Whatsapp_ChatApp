/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID:1683479883,
    NEXT_PUBLIC_ZEGO_SERVER_ID:"88c7e1df1324128d4dd7e328ecb2d07e"
  },
  images: {
    domains: ["localhost"]
  }
};

export default nextConfig;
