/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { webpack }) {
    // Tell CesiumJS where its static assets are served from (public/cesium/)
    config.plugins.push(
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("/cesium"),
      })
    );
    return config;
  },
};

export default nextConfig;
