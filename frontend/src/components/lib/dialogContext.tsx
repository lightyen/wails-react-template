import { createContext } from "react"

export interface DialogState {
	visible: boolean
}

export interface DialogContext extends DialogState {
	setVisible(v: boolean | ((prev: boolean) => boolean)): void
}

export const dialogContext = createContext<DialogContext>(null as unknown as DialogContext)
