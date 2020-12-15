module.exports = {
  apps: [
    {
      name: 'pan-dev-server',
      script: 'npm run dev',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
