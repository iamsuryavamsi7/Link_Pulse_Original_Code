/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				customBlueLeftNavBar: '#0c82f8',
				customBlueLinkPulseBase: `#66B2FF`
			}
		},
	},
	plugins: [],
}