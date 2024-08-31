/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        dirs: ['app', 'components', 'hooks', 'lib', 'prisma'],
    }
};

export default nextConfig;
