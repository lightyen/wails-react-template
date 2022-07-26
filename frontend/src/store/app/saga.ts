import * as base from "wails/features/Base"
import * as app from "wails/main/App"
import * as runtime from "wails/runtime"

import { eventChannel } from "redux-saga"
import { fork, put, take, takeEvery } from "redux-saga/effects"
import * as ac from "./action"
import { ScreenType } from "./screen"

const mediaQuery = (query: string) =>
	eventChannel<MediaQueryListEvent>(emit => {
		const mql = window.matchMedia(query)
		function onchange(e: MediaQueryListEvent) {
			emit(e)
		}
		mql.addEventListener("change", onchange, { passive: true })
		return () => {
			mql.removeEventListener("change", onchange)
		}
	})

function screen(query: string, screen: ScreenType) {
	return fork(function* () {
		const ch = mediaQuery(query)
		while (true) {
			const event: MediaQueryListEvent = yield take(ch)
			if (event.matches) yield put(ac.onScreen({ event, screen }))
		}
	})
}

function onScreenUpdated() {
	return fork(function* () {
		while (true) {
			const e: ReturnType<typeof ac.onScreen> = yield take(ac.onScreen)
			yield put(ac.onScreenUpdated(e.payload.screen))
		}
	})
}

export default function* saga() {
	yield screen(`screen and (max-width: 639px)`, "xs")
	yield screen(`screen and (min-width: 640px) and (max-width: 767px)`, "sm")
	yield screen(`screen and (min-width: 768px) and (max-width: 1024px)`, "md")
	yield screen(`screen and (min-width: 1025px) and (max-width: 1279px)`, "lg")
	yield screen(`screen and (min-width: 1280px) and (max-width: 1535px)`, "xl")
	yield screen(`screen and (min-width: 1536px)`, "2xl")
	yield onScreenUpdated()

	// control panel
	yield takeEvery(ac.toggleMaximizeWindow, function* () {
		runtime.WindowToggleMaximise()
		yield
	})
	yield takeEvery(ac.minimiseWindow, function* () {
		runtime.WindowMinimise()
		yield
	})
	yield takeEvery(ac.quit, function* () {
		runtime.Quit()
		yield
	})

	yield fork(function* () {
		const path = yield app.UserDataPath()
		yield put(ac.userDataPath(path))
	})
	yield takeEvery(ac.openFile, function* () {
		yield base.OpenFile()
	})
	yield takeEvery(ac.openDirectory, function* () {
		yield base.OpenDirectory()
	})

	yield fork(function* () {
		const ch = eventChannel<boolean>(emit => {
			function handler(data: boolean) {
				emit(data)
			}
			runtime.EventsOn("isMaximized", handler)
			return () => {
				runtime.EventsOff("isMaximized")
			}
		})
		yield takeEvery(ch, function* (data) {
			yield put(ac.isMaximizedWindow(data))
		})
	})
	yield fork(function* () {
		const ch = eventChannel<string | string[]>(emit => {
			function handler(data: string | string[]) {
				emit(data)
			}
			runtime.EventsOn("images", handler)
			return () => {
				runtime.EventsOff("images")
			}
		})
		yield takeEvery(ch, function* (data) {
			yield put(ac.images(data))
		})
	})
	yield fork(function* () {
		let timeout: number
		const ch = eventChannel<boolean>(emit => {
			function getDimensions() {
				emit(window.screen.availWidth === window.outerWidth && window.screen.availHeight === window.outerHeight)
			}
			function handler() {
				window.clearTimeout(timeout)
				timeout = window.setTimeout(getDimensions, 50)
			}
			window.addEventListener("resize", handler)
			return () => {
				window.removeEventListener("resize", handler)
			}
		})
		yield takeEvery(ch, function* (data) {
			yield put(ac.isMaximizedWindow(data))
		})
	})
	yield runtime.EventsEmit("ready")
}
