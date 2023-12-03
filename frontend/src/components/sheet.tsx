import { Cross2Icon } from "@radix-ui/react-icons"
import { animated, easings, useSpringRef, useTransition } from "@react-spring/web"
import {
	Children,
	cloneElement,
	isValidElement,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ButtonHTMLAttributes,
	type ComponentProps,
	type HTMLAttributes,
	type PropsWithChildren,
	type ReactElement,
	type ReactNode,
} from "react"
import { FormattedMessage } from "react-intl"
import { tx } from "twobj"
import { Button, type ButtonProps } from "./button"
import { useDialog, type DialogProps } from "./dialog"
import { isElement, zs } from "./lib"
import { dialogContext } from "./lib/dialogContext"
import { Overlay } from "./overlay"

export const sheetVariants = zs(tx`absolute gap-4 bg-background p-6 shadow-lg`, {
	variants: {
		side: {
			top: tx`inset-x-0 top-0 border-b`,
			bottom: tx`inset-x-0 bottom-0 border-t`,
			left: tx`inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm`,
			right: tx`inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm`,
		},
	},
	defaultVariants: {
		side: "right",
	},
})

function animationVariants(side: "top" | "right" | "bottom" | "left") {
	const visible = { transform: "translateX(0%) translateY(0%)" }
	switch (side) {
		case "top":
			return {
				from: { transform: "translateX(0%) translateY(-100%)" },
				enter: visible,
				leave: { transform: "translateX(0%) translateY(-100%)" },
			}
		case "bottom":
			return {
				from: { transform: "translateX(0%) translateY(100%)" },
				enter: visible,
				leave: { transform: "translateX(0%) translateY(100%)" },
			}
		case "left":
			return {
				from: { transform: "translateX(-100%) translateY(0%)" },
				enter: visible,
				leave: { transform: "translateX(-100%) translateY(0%)" },
			}
		default:
			return {
				from: { transform: "translateX(100%) translateY(0%)" },
				enter: visible,
				leave: { transform: "translateX(100%) translateY(0%)" },
			}
	}
}

export const useSheet = useDialog

export function SheetTrigger({ children, ...props }: PropsWithChildren<Omit<ButtonProps, "onClick">>) {
	const { setVisible } = useContext(dialogContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <SheetTrigger>{c}</SheetTrigger>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<Button {...props} onClick={() => setVisible(true)}>
				{children}
			</Button>
		)
	}

	const child = children as ReactElement<HTMLAttributes<HTMLElement>>

	return cloneElement(child, {
		...props,
		onClick: e => {
			setVisible(true)
			child.props.onClick?.(e)
		},
	})
}

function CloseButton() {
	return (
		<SheetClose>
			<button
				type="button"
				tw="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity
	hover:opacity-100
	focus:(outline-none ring-2 ring-ring ring-offset-2)
	disabled:pointer-events-none"
			>
				<Cross2Icon tw="h-4 w-4" />
				<span tw="sr-only">
					<FormattedMessage id="close" />
				</span>
			</button>
		</SheetClose>
	)
}

interface SheetContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
	side?: "top" | "right" | "bottom" | "left"
	children?: ReactNode | ((args: { close(): void }) => ReactNode)
}

export function SheetContent({
	side = "right",
	onPointerDown,
	onPointerUp,
	onClick,
	children,
	...props
}: PropsWithChildren<SheetContentProps> & HTMLAttributes<HTMLDivElement>) {
	const { visible, setVisible } = useContext(dialogContext)

	useEffect(() => {
		function handle(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setVisible(false)
			}
		}
		window.addEventListener("keydown", handle)
		return () => {
			window.removeEventListener("keydown", handle)
		}
	}, [setVisible])

	const api = useSpringRef()
	const [transitions] = useTransition(visible, () => ({
		ref: api,
		config: { duration: 250, easing: easings.easeOutCubic },
		...animationVariants(side),
	}))

	useEffect(() => {
		if (visible) {
			api.start()
		}
		return () => {
			if (visible) {
				api.start()
			}
		}
	}, [visible, api])

	return transitions((style, item) => {
		return (
			item && (
				<animated.div
					role="dialog"
					{...props}
					css={sheetVariants({ side })}
					style={style}
					onPointerDown={event => {
						event.stopPropagation()
						onPointerDown?.(event)
					}}
					onPointerUp={event => {
						event.stopPropagation()
						onPointerUp?.(event)
					}}
					onClick={event => {
						event.stopPropagation()
						onClick?.(event)
					}}
				>
					{typeof children === "function" ? children({ close: () => setVisible(false) }) : children}
					<CloseButton />
				</animated.div>
			)
		)
	})
}

export function SheetClose({
	children,
	...props
}: PropsWithChildren<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">>) {
	const { setVisible } = useContext(dialogContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <SheetClose>{c}</SheetClose>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<button type="button" {...props} onClick={() => setVisible(false)}>
				{children}
			</button>
		)
	}

	const child = children as ReactElement<HTMLAttributes<HTMLElement>>

	return cloneElement(child, {
		onClick: e => {
			setVisible(false)
			child.props.onClick?.(e)
		},
	})
}

export function SheetHeader({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col space-y-2 text-center sm:text-left" {...props}>
			{children}
		</div>
	)
}

export function SheetTitle({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-lg font-semibold text-foreground" {...props}>
			{children}
		</div>
	)
}

export function SheetDescription({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-sm text-muted-foreground" {...props}>
			{children}
		</div>
	)
}

export function SheetFooter({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2" {...props}>
			{children}
		</div>
	)
}

export function Sheet({
	visible,
	setVisible = () => void 0,
	blur,
	overlayExit = true,
	onClickOverlay,
	children,
}: PropsWithChildren<DialogProps>) {
	const [innerVisible, innerSetVisible] = useState(false)

	const ctx = useMemo(() => {
		if (visible == null) {
			return { visible: innerVisible, setVisible: innerSetVisible }
		}
		return { visible, setVisible }
	}, [innerVisible, visible, setVisible])

	const contentReactElement = Children.toArray(children).find(
		(e): e is ReactElement<ComponentProps<typeof SheetContent>> => isElement(e, SheetContent),
	)
	return (
		<dialogContext.Provider value={ctx}>
			{Children.map(children, child => {
				if (isElement(child, SheetContent)) {
					return null
				}
				return child
			})}
			<Overlay
				visible={ctx.visible}
				blur={blur}
				onClick={() => {
					onClickOverlay?.()
					if (overlayExit === true) {
						ctx.setVisible(false)
					}
				}}
			>
				{contentReactElement}
			</Overlay>
		</dialogContext.Provider>
	)
}
