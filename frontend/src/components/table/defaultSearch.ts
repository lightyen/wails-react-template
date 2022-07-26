const regexpSafety = (text: string): RegExp => {
	try {
		if (text.startsWith("/")) {
			if (text.length > 2) {
				if (text[text.length - 1] === "/") {
					return new RegExp(`${text.substring(1, text.length - 1)}`)
				}
				if (text[text.length - 2] === "/") {
					return new RegExp(`${text.substring(1, text.length - 2)}`, text.substring(text.length - 1))
				}
			}
		}
	} catch {}
	return new RegExp(`${text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}`, "i")
}

export function defaultSearchFunction(value: string): (record: string) => boolean {
	const keys = value.split(" ")
	const vs = keys.map<(record: string) => boolean>(key => {
		if (key.length > 1 && key.startsWith("!")) {
			return record => !regexpSafety(key.substring(1)).test(record)
		}
		return record => regexpSafety(key).test(record)
	})
	return record => vs.every(v => v(record))
}
