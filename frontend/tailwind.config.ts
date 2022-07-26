export default {
	darkMode: "class",
	theme: {
		fontFamily: {
			sans: [
				"Inter V",
				"Inter",
				"Source Han Sans VF",
				"Source Han Sans TC VF",
				"Source Han Sans CN VF",
				"Source Han Sans",
				"Noto Sans",
				"ui-sans-serif",
				"-apple-system",
				"BlinkMacSystemFont",
				"Segoe UI",
				"sans-serif",
				"system-ui",
				"Apple Color Emoji",
				"Segoe UI Emoji",
				"Segoe UI Symbol",
				"Noto Color Emoji",
			],
			mono: [
				"ui-monospace",
				"SFMono-Regular",
				"Menlo",
				"Monaco",
				"Consolas",
				"Liberation Mono",
				"Courier New",
				"monospace",
			],
		},
		extend: {
			screens: {
				lg: "1025px",
			},
			container: {
				center: true,
				padding: "2rem",
				screens: {
					"2xl": "1400px",
				},
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderColor: {
				DEFAULT: "hsl(var(--border))",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				enter: {
					from: { opacity: "0" },
					to: { opacity: "var(--enter-opacity, 1)" },
				},
			},
			animation: {
				enter: "enter 200ms ease",
			},
		},
	},
	plugins: [
		({ addVariant }) => {
			addVariant("mobile", "@media (pointer: coarse)")
			addVariant("not-mobile", "@media not (pointer: coarse)")
		},
	],
} satisfies import("twobj").ConfigJS
