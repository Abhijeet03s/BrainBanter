/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins-Regular', 'Poppins-Medium', 'Poppins-SemiBold', 'Poppins-Bold'],
        lora: ['Lora-Regular', 'Lora-Medium', 'Lora-SemiBold', 'Lora-Bold'],
        firaCode: ['FiraCode-Regular', 'FiraCode-Medium', 'FiraCode-SemiBold'],
      },
    },
  },
  plugins: [],
}