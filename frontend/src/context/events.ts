import { EventsEmit, EventsOff, EventsOn } from "@wails/runtime"
import { eventChannel, type EventChannel } from "redux-saga"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wailsEvents<T extends {} = any>(name: string) {
	return eventChannel<T>(emit => {
		function handler(data: T) {
			emit(data)
		}
		EventsOn(name, handler)
		return () => {
			EventsOff(name)
		}
	})
}

export function* emitWails(eventName: string, ...data: unknown[]) {
	yield EventsEmit(eventName, ...data)
}

export function windowEvents(type: keyof WindowEventMap): EventChannel<Event>
export function windowEvents(type: string): EventChannel<Event>
export function windowEvents(type: string | keyof WindowEventMap): EventChannel<Event> {
	return eventChannel<Event>(emit => {
		function listener(e: Event) {
			e.preventDefault = () => void 0
			emit(e)
		}
		window.addEventListener(type, listener, { passive: true })
		return () => {
			window.removeEventListener(type, listener)
		}
	})
}

export const mediaQueryEvents = (query: string) =>
	eventChannel<MediaQueryListEvent>(emit => {
		const mql = window.matchMedia(query)
		function onchange(e: MediaQueryListEvent) {
			e.preventDefault = () => void 0
			emit(e)
		}
		mql.addEventListener("change", onchange, { passive: true })
		return () => {
			mql.removeEventListener("change", onchange)
		}
	})

export const sseEvents = (source: EventSource, event: string) =>
	eventChannel<MessageEvent>(emit => {
		function cb(e: MessageEvent) {
			emit(e)
		}
		source.addEventListener(event, cb, { passive: true })
		return () => {
			source.removeEventListener(event, cb)
		}
	})
