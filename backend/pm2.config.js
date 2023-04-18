/* eslint-disable @typescript-eslint/no-var-requires */
const { name, main } = require('./package.json');

module.exports = {
  apps: [
    {
      name,
      script: main,
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
