import { fork } from "redux-saga/effects"
import { appWindow } from "./appWindow"
import { toast } from "./toast"

export default function* saga() {
	yield fork(toast)
	yield fork(appWindow)
}
