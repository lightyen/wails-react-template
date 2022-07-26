import { createAction } from "@reduxjs/toolkit"

export const setLocale = createAction<string>("set_locale")

export default {
	setLocale,
}
