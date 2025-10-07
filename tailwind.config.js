/**
 * @file tailwind.config.ts
 * @description Configuración de Tailwind CSS v4 para MiauBloom
 * @author Kevin Mariano
 * @version 2.0.0
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F2C2C1',
          dark: '#E5A5A3',
          light: '#FFE5E4',
        },
        dark: '#070806',
        light: '#B6BABE',
        text: {
          dark: '#070806',
          light: '#B6BABE',
        },
        background: {
          light: '#FAFAFA',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading-1': ['1.25rem', { lineHeight: '1.4', fontWeight: '700' }],
        'heading-2': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-1': ['1rem', { lineHeight: '1.6', fontWeight: '500' }],
        'body-2': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
      },
      spacing: {
        '4.5': '1.125rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'primary': '0 8px 24px rgba(242, 194, 193, 0.4)',
        'soft': '0 4px 16px rgba(7, 8, 6, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;