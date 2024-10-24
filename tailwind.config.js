/** @type {import('tailwindcss').Config} */

const tailwinConfig = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "clicker-game": "url('./src/assets/images/ClickerGameBg.webp')",
        "gradient": "linear-gradient(90deg, #BD7AFF 80%, #7010F1 80%, #6F3DFF 80%, #BEE8FF 100%, #BEE8FF 100%, #630086 100%)",
        "quest-card": "url('./src/assets/images/cardBg2.webp')",
        "count1": "url('./src/assets/images/count1.webp')",
        "count2": "url('./src/assets/images/count2.webp')",
        "username": "url('./src/assets/images/username.webp')",
        "activeDog": "url('./src/assets/images/activeDog.webp')",
        "activeDogBg": "url('./src/assets/images/activeDogBg.webp')",
        "initialDogBg": "url('./src/assets/images/initialDogBg.webp')",
        "leaderboard": "url('./src/assets/images/leaderboard.webp')",
        "light": "url('./src/assets/images/Light.webp')",
        "leaderboardBg": "url('./src/assets/images/LeaderboardBg.webp')",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        yellow: {
          primary: "#e29227",
          number: "#ffeea3"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        modalOpen: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        modalClose: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.95)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        fadeInOut: {
          '0%': { opacity: 0 },
          '25%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideOutToBottom: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(100%)', opacity: 0 },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '20%': { transform: 'translateY(-100%)', opacity: 0 }, // Keep hidden for the first 20%
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideOutToTop: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '80%': { transform: 'translateY(0)', opacity: 0 }, // Start hiding at 80%
          '100%': { transform: 'translateY(-100%)', opacity: 0 },
        },
        treasureBoxTwerk: {
          '0%': { transform: 'rotate(0deg)'},
          '33%': { transform: 'rotate(-1.5deg)'},
          '66%': { transform: 'rotate(1.5deg)'},
          '100%': { transform: 'rotate(0deg)'},
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        modalOpen: 'modalOpen 0.3s ease-out',
        modalClose: 'modalClose 0.3s ease-in',
        fadeIn: 'fadeIn 0.3s ease-out',
        fadeOut: 'fadeOut 0.3s ease-in',
        fadeInOut: 'fadeInOut 0.5s ease-out',
        slideInFromBottom: 'slideInFromBottom 0.3s ease-out',
        slideOutToBottom: 'slideOutToBottom 0.3s ease-in',
        slideInFromTop: 'slideInFromTop 0.3s ease-out',
        slideOutToTop: 'slideOutToTop 0.3s ease-in',
        treasureBoxTwerk: 'treasureBoxTwerk 0.1s ease-in infinite',
      },
      fontFamily: {
        "LuckiestGuy": ['var(--LuckiestGuy)'],
        "inter": ['var(--inter)'],
        outfit: ['Outfit', 'sans-serif'],
        LuckiestGuy: ['LuckiestGuy'], 
        bignoodle: ['BigNoodleTitling', 'sans-serif'],
      },
      boxShadow: {
        inplace_fuschia_500: "0 0px 10px 5px rgba(217, 70,239, 0.5)",
      },
    },
    screens: {
      'xs': { 'raw': '(min-width: 400px) and (orientation: portrait)' },
      'sm': { 'raw': '(min-width: 640px) and (orientation: portrait)' },
      'md': { 'raw': '(min-width: 768px) and (orientation: portrait)' },
      'lg': { 'raw': '(min-width: 1024px) and (orientation: landscape)' },
      'xl': { 'raw': '(min-width: 1280px) and (orientation: landscape)' },
      '2xl': { 'raw': '(min-width: 1536px) and (orientation: landscape)' },
    },
  },
  plugins: [
    require("tailgrids/plugin"),
    // require("tw-elements/plugin")
  ],
};

export default tailwinConfig