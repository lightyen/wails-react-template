interface ThemeOptions {
	style?: string | null
	color?: string | null
}

function isMediaDark() {
	return window.matchMedia(`(prefers-color-scheme: dark)`).matches
}

function initTheme() {
	const style = localStorage.getItem("theme.style")
	const color = localStorage.getItem("theme.color")
	const classList: string[] = []
	if (style) {
		classList.push(style)
	} else if (isMediaDark()) {
		classList.push("dark")
	}
	if (color) {
		classList.push(color)
	}
	document.documentElement.className = classList.join(" ")
}

initTheme()

export function setTheme({ style, color }: ThemeOptions = {}) {
	const classList: string[] = []
	const [d, c] = document.documentElement.className.split(" ")
	switch (style) {
		case "light":
			classList.push(style)
			break
		case "dark":
			classList.push(style)
			break
		case "system":
			if (isMediaDark()) {
				classList.push("dark")
			}
			break
		default:
			if (d) {
				classList.push(d)
			}
			break
	}
	if (color) {
		classList.push(color)
	} else {
		if (c) {
			classList.push(c)
		}
	}
	document.documentElement.className = classList.join(" ")
}
