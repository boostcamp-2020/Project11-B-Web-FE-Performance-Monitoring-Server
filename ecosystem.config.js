require('dotenv').config();

const isProduction = process.env.SERVER === 'production';
const name = isProduction ? `pan-opt` : `pan-opt-dev`;
const script = isProduction ? 'npm run start' : 'npm run dev';
const NODE_ENV = isProduction ? 'production' : 'development';

module.exports = {
  apps: [
    {
      name,
      script,
      env: {
        NODE_ENV,
        PORT: 3000,
      },
    },
  ],
};
