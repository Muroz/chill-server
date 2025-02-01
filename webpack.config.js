const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production', // Use "development" for dev builds
  target: 'node', // Optimize for Node.js
  entry: './src/index.ts', // Entry point for your server
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve TypeScript and JavaScript files
    alias: {
      // Ensure only one version of modules is loaded
      '@pothos/core': path.resolve('./node_modules/@pothos/core'),
      '@pothos/plugin-prisma': path.resolve(
        './node_modules/@pothos/plugin-prisma'
      ),
      graphql: path.resolve('./node_modules/graphql'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/, // Exclude dependencies
      },
    ],
  },
  externals: [
    nodeExternals({
      allowlist: [/^@pothos\/core/, /^@pothos\/plugin-prisma/], // Include Pothos and GraphQL modules
    }), // Exclude node_modules from the bundle
    {
      '@prisma/client': 'commonjs @prisma/client', // Exclude Prisma Client
    },
  ],
  devtool: 'source-map', // Enable source maps for debugging
};
