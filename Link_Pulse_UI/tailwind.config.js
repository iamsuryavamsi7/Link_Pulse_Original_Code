/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				customBlueAccenture: '#0c82f8'
			}
		},
	},
	plugins: [],
}