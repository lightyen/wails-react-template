import dayjs from "dayjs"
import "dayjs/locale/en"
import "dayjs/locale/ja"
import localeZhTW from "dayjs/locale/zh-tw"
import localizedFormat from "dayjs/plugin/localizedFormat"

import $enUS from "./locales/en-US.yml"
import $jaJP from "./locales/ja-JP.yml"
import $zhTW from "./locales/zh-TW.yml"

export const supports = {
	"en-US": "EN",
	"ja-JP": "日本語",
	"zh-TW": "繁中",
}

export type LocaleType = keyof typeof supports

export const defaultLocale: string = window.navigator.language || "en-US"

function setDayjs(locale: string) {
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "zh":
			dayjs.locale("zh-tw")
			return
		case "ja":
			dayjs.locale("ja")
			return
		default:
			dayjs.locale("en")
			return
	}
}

localeZhTW.formats["LLLL"] = "YYYY年M月D日 dddd HH:mm"
localeZhTW.formats["llll"] = "YYYY年M月D日 dddd HH:mm"
dayjs.locale(localeZhTW, undefined, true)
dayjs.extend(localizedFormat)
setDayjs(getLocale()[0])

export function getLocale(): [LocaleType, Record<string, string>] {
	const locale = localStorage.getItem("locale") || defaultLocale
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "zh":
			document.documentElement.lang = "zh"
			return ["zh-TW", $zhTW]
		case "ja":
			document.documentElement.lang = "ja"
			return ["ja-JP", $jaJP]
		default:
			document.documentElement.lang = "en"
			return ["en-US", $enUS]
	}
}

export function storeLocale(locale: string) {
	if (Object.keys(supports).some(loc => loc === locale)) {
		localStorage.setItem("locale", locale)
		setDayjs(locale)
		const [primary] = locale.toLocaleLowerCase().split(/-/)
		switch (primary) {
			case "zh":
				document.documentElement.lang = "zh"
				break
			case "ja":
				document.documentElement.lang = "ja"
				break
			default:
				document.documentElement.lang = "en"
				break
		}
	} else {
		throw new Error(`resource "${locale}" is not found.`)
	}
}
