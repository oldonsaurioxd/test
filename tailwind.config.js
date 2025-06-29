module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'], // Adjust if you have JS files in other locations
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'brand-background': '#1a1a2e', // Dark charcoal/near black
        'brand-background-alt': '#2c2c3e', // Slightly lighter than background for section differentiation
        'brand-accent': '#00f7ff',    // Electric blue/teal
        'brand-text-primary': '#e0e0e0', // Soft white
        'brand-text-secondary': '#a0a0a0', // Light gray
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Modern sans-serif font
      },
      borderRadius: {
        'xl': '1rem', // Example for larger rounded corners, adjust as needed
        '2xl': '1.5rem',
      },
      minHeight: {
        'screen': '100vh',
      }
    },
  },
  variants: {
    extend: {
      ringColor: ['focus-visible'],
      ringWidth: ['focus-visible'],
      borderColor: ['focus-visible'],
    },
  },
  plugins: [],
}
