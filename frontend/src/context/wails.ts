import * as runtime from "@wails/runtime"
import { eventChannel } from "redux-saga"

export function listen<TData extends {} | null>(eventName: string) {
	return eventChannel<TData>(emit => {
		function handler(data: TData) {
			emit(data)
		}
		runtime.EventsOn(eventName, handler)
		return () => {
			runtime.EventsOff(eventName)
		}
	})
}

export function emit(eventName: string, ...data: unknown[]) {
	runtime.EventsEmit(eventName, ...data)
}
