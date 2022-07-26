import { emitWails, wailsEvents } from "@context/events"
import * as base from "@wails/features/Base"
import * as app from "@wails/main/App"
import * as runtime from "@wails/runtime"
import { eventChannel } from "redux-saga"
import { call, fork, put, takeEvery } from "redux-saga/effects"
import * as ac from "./action"

export function* appWindow() {
	yield takeEvery(ac.toggleMaximizeWindow, function* () {
		yield call(runtime.WindowToggleMaximise)
	})
	yield takeEvery(ac.minimiseWindow, function* () {
		yield call(runtime.WindowMinimise)
	})
	yield takeEvery(ac.quit, function* () {
		yield call(runtime.Quit)
	})
	yield fork(function* () {
		yield put(ac.userDataPath(yield call(app.UserDataPath)))
	})
	yield takeEvery(ac.openFile, function* () {
		yield call(base.OpenFile)
	})
	yield takeEvery(ac.openDirectory, function* () {
		yield call(base.OpenDirectory)
	})
	yield takeEvery(ac.openExplorer, function* ({ payload }) {
		yield call(emitWails, "openExplorer", payload)
	})
	yield takeEvery(wailsEvents<boolean>("isMaximized"), function* (data) {
		yield put(ac.isMaximizedWindow(data))
	})
	yield takeEvery(wailsEvents<string | string[]>("images"), function* (data) {
		yield put(ac.images(data))
	})
	yield fork(function* () {
		let timer: number
		const ch = eventChannel<boolean>(emit => {
			function getDimensions() {
				emit(window.screen.availWidth === window.outerWidth && window.screen.availHeight === window.outerHeight)
			}
			function handler() {
				window.clearTimeout(timer)
				timer = window.setTimeout(getDimensions, 100)
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
	yield fork(emitWails, "webReady")
}
