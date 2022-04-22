module.exports = {
  // mode: 'jit',
  // jit document: https://tailwindcss.com/docs/just-in-time-mode
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
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
