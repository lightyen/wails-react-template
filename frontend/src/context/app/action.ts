import { isMobile } from "@components/lib"
import { Action, createAction } from "@reduxjs/toolkit"
import { type ReactElement } from "react"
import { genToastId } from "./toast"

export type ToastVariant = "destructive" | "primary"

export interface ToasterToast {
	/** delay in milliseconds @default 5000 */
	delay?: number

	variant?: ToastVariant
	title?: ReactElement | string
	description?: ReactElement | string
	action?: ReactElement | string
}

export interface InnerToasterToast extends ToasterToast {
	id: string
	delay: number
	visible: boolean
}

export interface AddToastAction {
	type: "add_toast"
	payload: InnerToasterToast
}

export function toast(toast: ToasterToast, id?: string): AddToastAction {
	if (id == undefined) {
		id = genToastId()
	}
	const { delay = isMobile() ? 0 : 5000, ...rest } = toast
	return {
		type: "add_toast",
		payload: { id, visible: true, delay, ...rest },
	}
}

export function isAddToastAction(action: Action): action is AddToastAction {
	return action.type === "add_toast"
}

export const updateToast = createAction<ToasterToast>("update_toast")
export const dismissToast = createAction("dismiss_toast", (id: string) => ({ payload: id }))
export const restartDismissToast = createAction("run_dismiss_toast", (id: string) => ({ payload: id }))
export const cancelDismissToast = createAction("cancel_dismiss_toast", (id: string) => ({ payload: id }))
export const removeAllToast = createAction("remove_all_toast")

export const quit = createAction("quit")
export const minimiseWindow = createAction("minimiseWindow")
export const toggleMaximizeWindow = createAction("toggleMaximizeWindow")
export const isMaximizedWindow = createAction<boolean>("isMaximizedWindow")
export const images = createAction<string | string[]>("images")

export const userDataPath = createAction<string>("userDataPath")

export const data = createAction<string>("data")

export const openFile = createAction("openFile")
export const openDirectory = createAction("openDirectory")
export const openExplorer = createAction("openExplorer", (payload: string) => ({ payload }))

export default {
	toast,
	updateToast,
	dismissToast,
	restartDismissToast,
	cancelDismissToast,
	removeAllToast,
	quit,
	minimiseWindow,
	toggleMaximizeWindow,
	openFile,
	openDirectory,
	openExplorer,
}
