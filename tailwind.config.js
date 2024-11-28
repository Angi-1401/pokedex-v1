/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./build/**/*.{html,js}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
