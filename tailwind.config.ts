import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
				"3xl": "2048px",
				"4xl": "3840px",
				"5xl": "7680px",
			},
		},
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				blob: {
					"0%": {
						transform: "translate(0px, 0px) scale(1)",
					},
					"33%": {
						transform: "translate(30px, -50px) scale(1.1)",
					},
					"66%": {
						transform: "translate(-20px, 20px) scale(0.9)",
					},
					"100%": {
						transform: "tranlate(0px, 0px) scale(1)",
					},
				},
				marquee: {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(-100%)" }
				},

				// Slide Animations
				"slide-in-right": {
					"0%": { transform: "translateX(100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				"slide-in-left": {
					"0%": { transform: "translateX(-100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				"slide-in-top": {
					"0%": { transform: "translateY(-100%)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				"slide-in-bottom": {
					"0%": { transform: "translateY(100%)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				"slide-out-right": {
					"0%": { transform: "translateX(0)", opacity: "1" },
					"100%": { transform: "translateX(100%)", opacity: "0" },
				},
				"slide-out-left": {
					"0%": { transform: "translateX(0)", opacity: "1" },
					"100%": { transform: "translateX(-100%)", opacity: "0" },
				},
				"slide-out-top": {
					"0%": { transform: "translateY(0)", opacity: "1" },
					"100%": { transform: "translateY(-100%)", opacity: "0" },
				},
				"slide-out-bottom": {
					"0%": { transform: "translateY(0)", opacity: "1" },
					"100%": { transform: "translateY(100%)", opacity: "0" },
				},

				// Fade Animations
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"fade-out": {
					"0%": { opacity: "1" },
					"100%": { opacity: "0" },
				},
				"fade-in-up": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-in-down": {
					"0%": { opacity: "0", transform: "translateY(-10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-in-left": {
					"0%": { opacity: "0", transform: "translateX(-10px)" },
					"100%": { opacity: "1", transform: "translateX(0)" },
				},
				"fade-in-right": {
					"0%": { opacity: "0", transform: "translateX(10px)" },
					"100%": { opacity: "1", transform: "translateX(0)" },
				},

				// Scale Animations
				"scale-in": {
					"0%": { transform: "scale(0.5)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
				"scale-out": {
					"0%": { transform: "scale(1)", opacity: "1" },
					"100%": { transform: "scale(0.5)", opacity: "0" },
				},

				// Rotate Animations
				"rotate-in": {
					"0%": { transform: "rotate(-180deg)", opacity: "0" },
					"100%": { transform: "rotate(0)", opacity: "1" },
				},
				"rotate-out": {
					"0%": { transform: "rotate(0)", opacity: "1" },
					"100%": { transform: "rotate(180deg)", opacity: "0" },
				},

				// Bounce Animations
				bounce: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-5px)" },
				},
				"bounce-left": {
					"0%, 100%": { transform: "translateX(0)" },
					"50%": { transform: "translateX(-5px)" },
				},
				"bounce-right": {
					"0%, 100%": { transform: "translateX(0)" },
					"50%": { transform: "translateX(5px)" },
				},
				"bounce-up": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-5px)" },
				},
				"bounce-down": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(5px)" },
				},

				// Pulse and Wiggle
				pulse: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.5" },
				},
				wiggle: {
					"0%, 100%": { transform: "rotate(-3deg)" },
					"50%": { transform: "rotate(3deg)" },
				},

				// Accordion Animations
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"accordion-left": {
					from: { width: "0" },
					to: { width: "var(--radix-accordion-content-width)" },
				},
				"accordion-right": {
					from: { width: "var(--radix-accordion-content-width)" },
					to: { width: "0" },
				},

				// New Animations
				"ping": {
					"75%, 100%": { transform: "scale(2)", opacity: "0" },
				},
				"spin": {
					"to": { transform: "rotate(360deg)" },
				},
				"shake": {
					"10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
					"20%, 80%": { transform: "translate3d(2px, 0, 0)" },
					"30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
					"40%, 60%": { transform: "translate3d(4px, 0, 0)" },
				},
				"float": {
					"0%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-5px)" },
					"100%": { transform: "translateY(0px)" },
				},
				"jello": {
					"0%, 11.1%, 100%": { transform: "none" },
					"22.2%": { transform: "skewX(-12.5deg) skewY(-12.5deg)" },
					"33.3%": { transform: "skewX(6.25deg) skewY(6.25deg)" },
					"44.4%": { transform: "skewX(-3.125deg) skewY(-3.125deg)" },
					"55.5%": { transform: "skewX(1.5625deg) skewY(1.5625deg)" },
					"66.6%": { transform: "skewX(-0.78125deg) skewY(-0.78125deg)" },
					"77.7%": { transform: "skewX(0.390625deg) skewY(0.390625deg)" },
					"88.8%": { transform: "skewX(-0.1953125deg) skewY(-0.1953125deg)" },
				},
				"flip": {
					"0%": { transform: "perspective(400px) rotateY(0)" },
					"100%": { transform: "perspective(400px) rotateY(360deg)" },
				},
			},
			animation: {
				blob: "blob 7s infinite",
				// Slide Animations
				"slide-in-right": "slide-in-right 0.5s ease-out",
				"slide-in-left": "slide-in-left 0.5s ease-out",
				"slide-in-top": "slide-in-top 0.5s ease-out",
				"slide-in-bottom": "slide-in-bottom 0.5s ease-out",
				"slide-out-right": "slide-out-right 0.5s ease-out",
				"slide-out-left": "slide-out-left 0.5s ease-out",
				"slide-out-top": "slide-out-top 0.5s ease-out",
				"slide-out-bottom": "slide-out-bottom 0.5s ease-out",

				// Fade Animations
				"fade-in": "fade-in 0.5s ease-out",
				"fade-out": "fade-out 0.5s ease-out",
				"fade-in-up": "fade-in-up 0.5s ease-out",
				"fade-in-down": "fade-in-down 0.5s ease-out",
				"fade-in-left": "fade-in-left 0.5s ease-out",
				"fade-in-right": "fade-in-right 0.5s ease-out",

				// Scale Animations
				"scale-in": "scale-in 0.5s ease-out",
				"scale-out": "scale-out 0.5s ease-out",

				// Rotate Animations
				"rotate-in": "rotate-in 0.5s ease-out",
				"rotate-out": "rotate-out 0.5s ease-out",

				// Bounce Animations
				"bounce": "bounce 1s infinite",
				"bounce-left": "bounce-left 1s infinite",
				"bounce-right": "bounce-right 1s infinite",
				"bounce-up": "bounce-up 1s infinite",
				"bounce-down": "bounce-down 1s infinite",

				// Pulse and Wiggle
				"pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"wiggle": "wiggle 1s ease-in-out infinite",

				// Accordion Animations
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"accordion-left": "accordion-left 0.2s ease-out",
				"accordion-right": "accordion-right 0.2s ease-out",

				// Marquee Animation
				marquee: "marquee 20s linear infinite",

				// New Animations
				"ping": "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
				"spin": "spin 1s linear infinite",
				"spin-slow": "spin 3s linear infinite",
				"shake": "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
				"float": "float 3s ease-in-out infinite",
				"jello": "jello 0.9s both",
				"flip": "flip 1s ease-in-out infinite",
			},
			screens: {
				"3xl": "2048px",
				"4xl": "3840px",
				"5xl": "7680px",
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
