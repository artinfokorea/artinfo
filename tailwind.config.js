/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT")
module.exports = withMT({
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
        whitesmoke: "#f8f8f8",
        primary: "#34363D",
        darkgrey: "#3c3a3a",
        aliceblue: "#f1f4ff",
        green: "#449F3C",
        cornflowerblue: "#7493ff",
        error: "#EA2A2A",
        salomon: "#ff6c6a",
        seashell: "#fff2ee",
      },
      padding: {
        // 'safe-bottom' 클래스를 정의하고 safe-area-inset-bottom 값을 사용합니다.
      },
    },
  },
  plugins: [require("@tailwindcss/forms", "tailwind-safe-area")],
})
