/**
 * @file postcss.config.js
 * @description Configuración de PostCSS con el plugin explícito para Tailwind CSS.
 * @author Kevin Mariano
 * @version 2.0.4 (Corregido: Referencia explícita a @tailwindcss/postcss para compatibilidad con Turbopack)
 */

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, 
    'autoprefixer': {},
  },
};
