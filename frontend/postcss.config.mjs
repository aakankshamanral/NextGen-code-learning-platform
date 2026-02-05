/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // Updated from 'tailwindcss'
    autoprefixer: {},
  },
};

export default config;