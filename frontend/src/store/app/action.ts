import { createAction } from "@reduxjs/toolkit"

export const onScreen = createAction<{ event: MediaQueryListEvent; screen: "2xl" | "xl" | "lg" | "md" | "sm" | "xs" }>(
	"on_screen",
)
export const onScreenUpdated = createAction<"2xl" | "xl" | "lg" | "md" | "sm" | "xs">("on_screen_updated")

export const quit = createAction("quit")
export const minimiseWindow = createAction("minimiseWindow")
export const toggleMaximizeWindow = createAction("toggleMaximizeWindow")
export const isMaximizedWindow = createAction<boolean>("isMaximizedWindow")
export const images = createAction<string | string[]>("images")

export const userDataPath = createAction<string>("userDataPath")

export const data = createAction<string>("data")

export const openFile = createAction("openFile")
export const openDirectory = createAction("openDirectory")

export default {
	quit,
	minimiseWindow,
	toggleMaximizeWindow,
	openFile,
	openDirectory,
}
