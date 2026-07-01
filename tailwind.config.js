module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0B1228',
        sidebar: '#081120',
        page: '#050B1A',
        border: 'rgba(255,255,255,0.08)',
        textSecondary: '#A0A9C0'
      },
      boxShadow: {
        soft: '0 20px 50px rgba(11, 18, 40, 0.2)',
        glow: '0 0 30px rgba(59,91,255,0.18)'
      },
      backgroundImage: {
        'dashboard-gradient': 'radial-gradient(circle at top left, rgba(59,91,255,0.18,0.35), transparent 40%), radial-gradient(circle at bottom right, rgba(94,75,255,0.18,0.4), transparent 30%)'
      }
    }
  },
  plugins: []
};
