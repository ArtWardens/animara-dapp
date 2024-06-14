/** @type {import('tailwindcss').Config} */

import tailwindAnimate from "tailwindcss-animate";

export default {
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
        "clicker-game": "url('./src/assets/images/ClickerGameBg.png')",
        "gradient": "linear-gradient(90deg, #BD7AFF 80%, #7010F1 80%, #6F3DFF 80%, #BEE8FF 100%, #BEE8FF 100%, #630086 100%)",
        "quest-card": "url('./src/assets/images/cardBg2.png')",
        "count1": "url('./src/assets/images/count1.png')",
        "count2": "url('./src/assets/images/count2.png')",
        "username": "url('./src/assets/images/username.png')",
        "activeDog": "url('./src/assets/images/activeDog.png')",
        "activeDogBg": "url('./src/assets/images/activeDogBg.png')",
        "initialDogBg": "url('./src/assets/images/initialDogBg.png')",
        "leaderboard": "url('./src/assets/images/leaderboard.png')",
        "light": "url('./src/assets/images/Light.png')",
        "leaderboardBg": "url('./src/assets/images/leaderboardBg.png')",
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
      },
      fontFamily: {
        "LuckiestGuy": ['var(--LuckiestGuy)'],
        "inter": ['var(--inter)']
      },
      cursor: {
        "360deg": "url('./public/assets/icons/360deg.svg'), pointer",
      },
      boxShadow: {
        inplace_fuschia_500: "0 0px 10px 5px rgba(217, 70,239, 0.5)",
      },
    },
  },
  plugins: [tailwindAnimate],
};
