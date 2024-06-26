import {
	addDialogCount,
	getDialogCount,
	getViewportElement,
	setScroll,
	subtractDialogCount,
} from "@components/lib/scrollbar"
import { animated, useSpringRef, useTransition } from "@react-spring/web"
import { useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { createPortal } from "react-dom"
import { tw } from "twobj"

interface OverlayProps extends HTMLAttributes<HTMLDivElement> {
	visible: boolean
	blur?: boolean
	duration?: number
}

export function Overlay({
	visible,
	blur = true,
	duration = 100,
	onPointerDown,
	onPointerUp,
	onClick,
	...props
}: PropsWithChildren<OverlayProps>) {
	const api = useSpringRef()

	const hold = useRef(false)

	const destroyedRef = useRef<null | boolean>(null)

	useEffect(() => {
		const destroyed = destroyedRef.current
		if (visible) {
			setScroll(true)
		}
		return () => {
			if (typeof destroyed === "boolean") {
				if (getDialogCount() === 0) {
					setScroll(false)
				}
			}
		}
	}, [visible])

	const [transitions] = useTransition(visible, () => ({
		ref: api,
		from: { opacity: 0.8 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: { duration },
		onDestroyed(end) {
			if (end) {
				if (getDialogCount() === 0) {
					setScroll(false)
				}
			}

			destroyedRef.current = true
			if (getDialogCount() === 0) {
				setScroll(false)
			}
		},
	}))

	useEffect(() => {
		if (visible) {
			addDialogCount()
			api.start()
		}
		return () => {
			if (visible) {
				subtractDialogCount()
				api.start()
			}
		}
	}, [visible, api])

	useEffect(() => {
		return () => {
			if (destroyedRef.current === false && getDialogCount() === 0) {
				setScroll(false)
			}
		}
	}, [])

	const [appview, setAppview] = useState<HTMLElement | null>(null)

	useLayoutEffect(() => {
		setAppview(getViewportElement())
	}, [])

	return (
		appview &&
		createPortal(
			transitions((s, item) => {
				return (
					item && (
						<animated.div
							data-type="overlay"
							tw="fixed inset-0 top-[calc(var(--control-ratio) * 30px)] z-50 bg-background/75 [:nth-last-of-type(-n+2)]:pointer-events-auto"
							css={blur && tw`backdrop-blur-sm`}
							style={s}
							onPointerDown={event => {
								onPointerDown?.(event)
								hold.current = true
							}}
							onPointerUp={event => {
								onPointerUp?.(event)
								if (hold.current) {
									onClick?.(event)
								}
								hold.current = false
							}}
							onClick={() => {
								hold.current = false
							}}
							{...props}
						/>
					)
				)
			}),
			appview,
		)
	)
}
