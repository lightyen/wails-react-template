import { createReducer } from "@reduxjs/toolkit"
import * as ac from "./action"

export interface AppStore {
	toasts: Record<string, ac.InnerToasterToast>
	userDataPath: string
	isMaximized: boolean
	images?: string | string[]
}

const init: AppStore = {
	toasts: {},
	userDataPath: "",
	isMaximized: false,
}

export const app = createReducer(init, builder =>
	builder
		.addCase(ac.isMaximizedWindow, (state, { payload }) => {
			state.isMaximized = payload
		})
		.addCase(ac.images, (state, { payload }) => {
			state.images = payload
		})
		.addCase(ac.userDataPath, (state, { payload }) => {
			state.userDataPath = payload
		})
		.addCase(ac.removeAllToast, state => {
			state.toasts = {}
		})
		.addCase(ac.dismissToast, (state, { payload: id }) => {
			delete state.toasts[id]
		})
		.addMatcher(ac.isAddToastAction, (state, { payload: toast }) => {
			const t = state.toasts[toast.id]
			if (!t) {
				state.toasts[toast.id] = { ...toast, visible: true }
			}
		}),
)
