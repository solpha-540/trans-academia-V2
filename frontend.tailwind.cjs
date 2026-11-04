const loadConfig = require('tailwindcss/loadConfig');
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const template = loadConfig(require('path').join(__dirname, 'tailwind.config.js'));
module.exports = {
  content: ['./index.html', './src/frontend/**/*.{ts,tsx}', './src/@spk/**/*.{ts,tsx}', './src/components/common/page-header/pageheader.tsx'],
  darkMode: 'class',
  theme: {
    ...template.theme,
    borderRadius: { ...defaultTheme.borderRadius, ...template.theme.borderRadius },
    extend: { ...template.theme.extend, fontFamily: { ...template.theme.fontFamily, sans: ['Inter', 'Segoe UI', 'sans-serif'] } },
  },
  safelist: ['bg-primary/10','bg-secondary/10','bg-info/10','bg-success/10','bg-danger/10','bg-warning/10','text-primary','text-secondary','text-success','text-warning','text-danger'],
  plugins: [require('@tailwindcss/forms')({strategy:'class'}), plugin(({addUtilities}) => addUtilities({'.dir-rtl':{direction:'rtl'},'.dir-ltr':{direction:'ltr'},'.dirrtl':{direction:'ltr'}}))],
};
