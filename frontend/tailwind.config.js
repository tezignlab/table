module.exports = {
  // mode: 'jit',
  // jit document: https://tailwindcss.com/docs/just-in-time-mode
  purge: ['./src/**/*.html', './src/**/*.tsx', './src/**/*.ts'],
  darkMode: false, // or 'media' or 'class'
  theme: {},
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animatecss')({
      classes: [
        'animate__animated',
        'animate__fadeInDown',
        'animate__fadeOutUp',
        'animate__backInUp',
        'animate__bounceIn',
      ],
      settings: {
        animatedSpeed: 200,
        animationDelaySpeed: 200,
      },
      variants: ['responsive', 'hover', 'reduced-motion'],
    }),
    require('@tailwindcss/typography'),
  ],
}
