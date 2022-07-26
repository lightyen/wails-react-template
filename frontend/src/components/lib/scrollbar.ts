import { isFirefox, isMobile } from "."

export function getViewportElement() {
	return document.getElementById("app-view")!
}

function scrollable(target: Element): boolean {
	if (target === document.body) {
		target = document.documentElement
	}
	if (target.scrollTop > 0) {
		return true
	}
	target.scrollTop = 5
	const b = !!target.scrollTop
	target.scrollTop = 0
	return b
}

function getScrollbarWidth(target: HTMLElement) {
	// Creating invisible container
	const outer = document.createElement("div")
	outer.style.visibility = "hidden"
	outer.style.overflow = "scroll" // forcing scrollbar to appear
	outer.style["msOverflowStyle"] = "scrollbar" // needed for WinJS apps
	target.appendChild(outer)

	// Creating inner element and placing it in the container
	const inner = document.createElement("div")
	outer.appendChild(inner)

	// Calculating difference between container's full width and the child width
	const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

	// Removing temporary elements from the DOM
	target.removeChild(outer)

	return scrollbarWidth
}

let dialogCount = 0

export function addDialogCount() {
	dialogCount += 1
}

export function subtractDialogCount() {
	dialogCount -= 1
}

export function getDialogCount(): number {
	return dialogCount
}

export function setScroll(hide: boolean, needFix: boolean = !isMobile() && !isFirefox()) {
	const target = getViewportElement()

	const sw = getScrollbarWidth(target)
	const canScroll = scrollable(target)

	if (needFix) {
		if (hide) {
			if (canScroll) {
				target.style.marginRight = `${sw}px`
			}
		} else {
			target.style.marginRight = ""
		}
	}

	if (hide) {
		if (target.style.overflow === "hidden") {
			return
		}
		target.style.overflow = "hidden"
		target.style.pointerEvents = "none"
	} else {
		if (!target.style.overflow) {
			return
		}
		target.style.overflow = ""
		target.style.pointerEvents = ""
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce(cb: (...args: any) => any) {
	let timer: number
	return function (event: unknown) {
		if (timer) window.clearTimeout(timer)
		timer = window.setTimeout(cb, 100, event)
	}
}

window.addEventListener(
	"resize",
	debounce(() => {
		if (getDialogCount() > 0) {
			setScroll(true)
		}
	}),
)
