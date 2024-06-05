const colon = 0x3a,
	hyphen = 0x2d,
	dot = 0x2e,
	_0 = 0x30,
	_9 = 0x39,
	_A = 0x41,
	_F = 0x46,
	_a = 0x61,
	_f = 0x66

// Hexadecimal to integer.
// Returns number, characters consumed.
function xtoi(s: string): [number, number] | null {
	let n = 0
	let i = 0
	for (i = 0; i < s.length; i++) {
		const si = s.charCodeAt(i)
		if (_0 <= si && si <= _9) {
			n <<= 4
			n += si - _0
		} else if (_a <= si && si <= _f) {
			n <<= 4
			n += si - _a + 10
		} else if (_A <= si && si <= _F) {
			n <<= 4
			n += si - _A + 10
		} else {
			break
		}
		if (n >= 0xffffff) {
			return null
		}
	}
	if (i == 0) {
		return null
	}
	return [n, i]
}

function xtoi2(s: string, e: number): number | null {
	const s2 = s.charCodeAt(2)
	if (s.length > 2 && s2 != e) {
		return null
	}
	const ans = xtoi(s.slice(0, 2))
	if (ans == null) {
		return null
	}
	const [n, ei] = ans
	if (ei !== 2) {
		return null
	}
	return n
}

export interface HardwareAddr {
	byteArray: number[]
	toString(): string
	nocolon: string
}

// ParseMAC parses s as an IEEE 802 MAC-48, EUI-48, EUI-64, or a 20-octet
// IP over InfiniBand link-layer address using one of the following formats:
//
//	00:00:5e:00:53:01
//	02:00:5e:10:00:00:00:01
//	00:00:00:00:fe:80:00:00:00:00:00:00:02:00:5e:10:00:00:00:01
//	00-00-5e-00-53-01
//	02-00-5e-10-00-00-00-01
//	00-00-00-00-fe-80-00-00-00-00-00-00-02-00-5e-10-00-00-00-01
//	0000.5e00.5301
//	0200.5e10.0000.0001
//	0000.0000.fe80.0000.0000.0000.0200.5e10.0000.0001
export function parseMAC(s: string): HardwareAddr | null {
	const slen = s.length
	if (slen < 12) {
		return null
	}

	let hw: number[]
	const s2 = s.charCodeAt(2)
	const s4 = s.charCodeAt(4)
	if (s2 === colon || s2 === hyphen) {
		if (slen < 14) {
			return null
		}
		if ((slen + 1) % 3 !== 0) {
			return null
		}
		const n = (slen + 1) / 3
		if (n != 6 && n != 8 && n != 20) {
			return null
		}
		hw = new Array(n)
		let x = 0,
			i = 0
		for (; i < n; i++) {
			const b = xtoi2(s.slice(x), s2)
			if (b == null) {
				return null
			}
			hw[i] = b
			x += 3
		}
	} else if (s4 === dot) {
		if (slen < 14) {
			return null
		}
		if ((slen + 1) % 5 !== 0) {
			return null
		}
		const n = (2 * (slen + 1)) / 5
		if (n != 6 && n != 8 && n != 20) {
			return null
		}
		hw = new Array(n)
		let x = 0,
			i = 0
		for (; i < n; i += 2) {
			const b = xtoi2(s.slice(x, x + 2), 0)
			if (b == null) {
				return null
			}
			hw[i] = b

			const b2 = xtoi2(s.slice(x + 2), s4)
			if (b2 == null) {
				return null
			}
			hw[i + 1] = b2
			x += 5
		}
	} else {
		const n = slen / 2
		if (n != 6 && n != 8 && n != 20) {
			return null
		}
		hw = new Array(n)

		let x = 0,
			i = 0
		for (; i < n; i++) {
			const b = xtoi2(s.slice(x, x + 2), 0)
			if (b == null) {
				return null
			}
			hw[i] = b
			x += 2
		}
	}

	return {
		byteArray: hw,
		toString() {
			const len = this.byteArray.length
			if (len == 0) {
				return ""
			}

			let s = ""

			for (let i = 0; i < len; i++) {
				if (i > 0) {
					s += ":"
				}
				s += this.byteArray[i].toString(16).padStart(2, "0")
			}

			return s
		},
		get nocolon() {
			const len = this.byteArray.length
			if (len == 0) {
				return ""
			}

			let s = ""

			for (let i = 0; i < len; i++) {
				s += this.byteArray[i].toString(16).toUpperCase().padStart(2, "0")
			}

			return s
		},
	}
}

export function addColonsToMAC(mac: string) {
	if (mac.length !== 12) return mac
	const s: string[] = []
	for (let i = 0; i < mac.length; i += 2) {
		s.push(mac.slice(i, i + 2))
	}
	return s.join(":").toLowerCase()
}
