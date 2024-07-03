import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        nwhite: '#F4FAFF',
        nblack: '#001011',
        zlgreen: '#E0FBC0',
        zdgreen: '#6DF700',
        zdark: '#182525',
        zlgray: '#5E6767',
        zwteen: '#303B3B',
        zdgray: '#787878',
        npink: '#CB03FC',
        plum: '#9B287B',
        night: '#0A0F0D',
        babypowder: '#FAFFFD',
        light_purple: '#8E19FE',
        dark_purple: '#5D05C5',
        light_green: '#4AF588',
        dark_green: '#038F7B',
      }
    },
  },
  plugins: [],
};
export default config;