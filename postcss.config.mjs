// Arquivo: postcss.config.mjs
// Localização: /postcss.config.mjs
// Descrição: Configuração do PostCSS para processar Tailwind CSS

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;