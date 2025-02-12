/** @type {import('tailwindcss').Config} */
export const content = [
    "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
    extend: {
        colors: {
            primary: '#4A90E2',
            secondary: '#D0021B',
            accent: '#F5A623',
        },
        fontFamily: {
            sans: ['Roboto', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
        },
        spacing: {
            '128': '32rem',
            '144': '36rem',
        },
    },
};
export const plugins = [];
