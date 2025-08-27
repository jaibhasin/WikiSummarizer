/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				blackish: '#1A1A1A',
				offwhite: '#F5F5F5',
				orange: '#FF6200',
			},
			backdropBlur: {
				'glass': '12px',
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
			},
		},
	},
	plugins: [],
}


