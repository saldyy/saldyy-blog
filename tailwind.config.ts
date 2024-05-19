import type { Config } from "tailwindcss"

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    colors: {
      "blue": "#1fb6ff",
      "purple": "#7e5bef",
      "pink": "#ff49db",
      "orange": "#ff7849",
      "green": "#13ce66",
      "yellow": "#ffc82c",
      "gray-dark": "#273444",
      "gray": "#8492a6",
      "gray-light": "#d3dce6",

    },
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      spacing: {
        "8xl": "96rem",
        "9xl": "128rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      colors: {
        "background": "#222831",
        "text-color": "#EEEEEE",
        "primary": "#76ABAE",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#EEEEEE",
            "h1,h2,h3,h4,h5,h6,strong,i,a": {
              color: "#EEEEEE",
            },
          },
        },
      },
    }
  },
} satisfies Config
