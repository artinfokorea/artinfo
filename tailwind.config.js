/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT")
module.exports = withMT({
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        // 폰트패밀리
        roboto: ["var(--roboto)"], // 다음과 같이 배열 안에 string으로 작성합니다.
      },
      colors: {
        kakao: "#FEE500",
        google: "#f44336",
        blue1: "#5baff6",
        grey: "#CBCBCB",
        lightgrey: "#eeebeb",
        whitesmoke: "#f5f5f5",
        badge: "#f2f4f7",
        silver: "#b5b6b9",
        royalblue: "#3366ff",
        darkgray: "#a4a5a7",
        dimgray: "#656667",
        primary: "#34363D",
        darkgrey: "#3c3a3a",
        aliceblue: "#f1f4ff",
        green: "#449F3C",
        cornflowerblue: "#7493ff",
        error: "#EA2A2A",
        salomon: "#ff6c6a",
        seashell: "#fff2ee",
        limegreen: "#11b143",
        mediumpurple: "#7c6ecd",
        lavender: "#cad4ff",
      },
      padding: {
        // 'safe-bottom' 클래스를 정의하고 safe-area-inset-bottom 값을 사용합니다.
      },
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
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
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms", "tailwind-safe-area", "tailwindcss-animate"),
  ],
})
