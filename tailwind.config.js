// tailwind.config.js
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // quan trọng!
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5',
                'primary-dull': '#4338CA'
            },
        },
    },
    plugins: [],
}
