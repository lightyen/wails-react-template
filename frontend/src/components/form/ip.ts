import { Address4 } from "ip-address"

export function isNormalIPv4(value: string, strict = false) {
	try {
		const v = new Address4(value)
		return strict ? v.parsedSubnet === "" : true
	} catch {
		return false
	}
}
