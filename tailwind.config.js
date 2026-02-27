/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4F46E5',
                    dark: '#4338CA',
                },
                secondary: '#10B981',
                danger: '#EF4444',
                'bg-main': '#F9FAFB',
                'bg-card': '#FFFFFF',
                'text-main': '#111827',
                'text-muted': '#6B7280',
                border: '#E5E7EB',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            width: {
                sidebar: '260px',
            }
        },
    },
    plugins: [],
}
