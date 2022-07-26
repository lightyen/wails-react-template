import { createReducer } from "@reduxjs/toolkit"
import { QueryClient } from "@tanstack/react-query"
import * as ac from "./action"
import { getScreen, ScreenType } from "./screen"

const screen = getScreen()

function getMode(screen: ScreenType) {
	if (screen === "xs" || screen === "sm") return "mobile"
	if (screen === "md") return "tablet"
	return "desktop"
}

export interface AppStore {
	queryClient: QueryClient
	screen: ScreenType
	mode: "mobile" | "tablet" | "desktop"
	userDataPath: string
	isMaximized: boolean
	images?: string | string[]
}

const init: AppStore = {
	queryClient: new QueryClient(),
	screen,
	mode: getMode(screen),
	userDataPath: "",
	isMaximized: false,
}

export const app = createReducer(init, builder =>
	builder
		.addCase(ac.onScreenUpdated, (state, { payload: screen }) => {
			state.screen = screen
			state.mode = getMode(screen)
		})
		.addCase(ac.isMaximizedWindow, (state, { payload }) => {
			state.isMaximized = payload
		})
		.addCase(ac.images, (state, { payload }) => {
			state.images = payload
		})
		.addCase(ac.userDataPath, (state, { payload }) => {
			state.userDataPath = payload
		}),
)
