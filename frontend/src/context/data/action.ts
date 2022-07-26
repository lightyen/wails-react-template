import { Action, createAction } from "@reduxjs/toolkit"
import { AxiosError } from "axios"

export interface MountDataAction {
	type: `mountData#${string}`
	toString(): `mountData#${string}`
	payload: {
		key: string
		url: string
	}
}

export function mountData(key: string, url: string): MountDataAction {
	return {
		type: `mountData#${key}`,
		toString() {
			return this.type
		},
		payload: { key, url },
	}
}

export function isMountAction(action: Action): action is MountDataAction {
	return String(action.type).startsWith("mountData#")
}

export interface UnmountDataAction {
	type: `unmountData#${string}`
	toString(): `unmountData#${string}`
	payload: {
		key: string
	}
}

export function unmountData(key: string): UnmountDataAction {
	return {
		type: `unmountData#${key}`,
		toString() {
			return this.type
		},
		payload: { key },
	}
}

export function isUnmountAction(action: Action): action is UnmountDataAction {
	return String(action.type).startsWith("unmountData#")
}

export interface InvalidateDataAction {
	type: `invalidateData#${string}`
	toString(): `invalidateData#${string}`
	payload: {
		key: string
	}
}

export function invalidateData(key: string): InvalidateDataAction {
	return {
		type: `invalidateData#${key}`,
		toString() {
			return this.type
		},
		payload: { key },
	}
}

export function isInvalidateAction(action: Action): action is InvalidateDataAction {
	return String(action.type).startsWith("invalidateData#")
}

export const dataSuccess = createAction("data_success", (key: string, data: unknown) => ({ payload: { key, data } }))
export const dataError = createAction("data_error", (key: string, error: AxiosError) => ({ payload: { key, error } }))
export const dataLoading = createAction("data_loading", (key: string) => ({ payload: { key } }))

export default {
	invalidateData,
	mountData,
	unmountData,
}
