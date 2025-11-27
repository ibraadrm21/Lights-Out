/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                carbon: "#15151E",
                warmRed: "#FF1E00",
            },
        },
    },
    plugins: [],
}
