/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
    path: "https://avatars.githubusercontent.com/*",
  },
  env: {
    SERVER_ADRES: "http://127.0.0.1:5000",
  },
};

module.exports = nextConfig;
