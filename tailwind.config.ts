import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans SC'", "'Inter'", "system-ui", "sans-serif"],
        inter: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#165DFF",
          hover: "#1254E6",
          light: "#E8F0FF",
        },
        text: {
          main: "#111111",
          secondary: "#333333",
          light: "#666666",
        },
        bg: {
          white: "#FFFFFF",
          gray: "#F7F7F7",
        },
        border: {
          DEFAULT: "#E5E5E5",
        },
      },
      borderRadius: {
        btn: "12px",
        card: "16px",
        input: "12px",
        img: "12px",
        modal: "16px",
      },
      spacing: {
        "mobile-p": "20px",
        "pc-p": "40px",
        "pc-p-lg": "80px",
        "module-sm": "32px",
        "module-lg": "48px",
      },
      height: {
        "btn-h": "44px",
      },
      fontSize: {
        h1: ["32px", { lineHeight: "1.4", fontWeight: "700" }],
        "h1-mobile": ["28px", { lineHeight: "1.4", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "1.4", fontWeight: "600" }],
        h3: ["20px", { lineHeight: "1.5", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6" }],
        caption: ["14px", { lineHeight: "1.5" }],
        "caption-sm": ["12px", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [],
};
export default config;
