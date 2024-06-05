/* eslint-disable @typescript-eslint/no-explicit-any */
import { type CSSObject, type SerializedStyles } from "@emotion/react"
import {
	isValidElement,
	type ComponentProps,
	type JSXElementConstructor,
	type ReactElement,
	type ReactNode,
} from "react"

type UserVariants<S> = Record<string, S>

export type Variants<S> = {
	variants: Record<string, UserVariants<S>>
	defaultVariants: {
		[P in keyof Variants<S>["variants"]]: keyof Variants<S>["variants"][P]
	}
}

export type InnerVariantProps<T extends Variants<S>, S> = {
	[P in keyof T["variants"]]?: keyof T["variants"][P]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VariantProps<Fn extends (...args: any) => CSSObject | SerializedStyles[]> = Parameters<Fn>[0]

export function zs<V extends Variants<S>, S extends SerializedStyles = SerializedStyles>(base: S, variants: V) {
	return (props: InnerVariantProps<V, S>): S[] => {
		const s: S[] = [base]
		for (const t in variants.variants) {
			const value = (props[t] as string) ?? variants.defaultVariants[t]
			if (value != null) {
				const styles = variants.variants[t]?.[value]
				if (styles) {
					s.push(styles)
				}
			}
		}
		return s
	}
}

export function isElement<C extends JSXElementConstructor<any> = JSXElementConstructor<any>>(
	e: ReactNode,
	c: C,
): e is ReactElement<ComponentProps<C>, C> {
	if (!isValidElement(e)) {
		return false
	}

	if (typeof e.type === "function" && typeof c === "function") {
		if (e.type === c) {
			return true
		}

		if (process.env.NODE_ENV === "development") {
			const a = e.type["name"]
			const b = c["name"]
			if (a && a === b) {
				return true
			}
		}
	}

	const type = e.props["__EMOTION_TYPE_PLEASE_DO_NOT_USE__"]

	if (typeof type === "function" && typeof c === "function") {
		if (type === c) {
			return true
		}
	}

	return false
}

export function getElementHeight(el: HTMLElement): number {
	el.style.height = "auto"
	const h = el.offsetHeight
	el.style.height = ""
	return h
}

export function getElementWidth(el: HTMLElement): number {
	const h = el.offsetWidth
	return h
}

export function isMobile() {
	return matchMedia("(pointer: coarse)").matches
}

export function isDesktop() {
	return matchMedia("(pointer: fine), (pointer: none)").matches
}

export function isTouchDesktop() {
	return matchMedia("(pointer: fine) and (any-pointer: coarse)").matches
}

export function isFirefox() {
	return /Firefox\//i.test(window.navigator.userAgent)
}
