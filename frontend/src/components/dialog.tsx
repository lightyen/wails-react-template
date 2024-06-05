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
	type DetailedReactHTMLElement,
	type HTMLAttributes,
	type PropsWithChildren,
	type ReactElement,
	type ReactNode,
} from "react"
import { FormattedMessage } from "react-intl"
import { tw } from "twobj"
import { Button, type ButtonProps } from "./button"
import { isElement } from "./lib"
import { dialogContext } from "./lib/dialogContext"
import { Overlay } from "./overlay"

export function useDialog(initialState: boolean | (() => boolean) = false) {
	const [visible, setVisible] = useState(initialState)
	return { visible, setVisible }
}

export function DialogTrigger({ children, ...props }: PropsWithChildren<Omit<ButtonProps, "onClick">>) {
	const { setVisible } = useContext(dialogContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <DialogTrigger>{c}</DialogTrigger>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<Button {...props} onClick={() => setVisible(true)}>
				{children}
			</Button>
		)
	}

	const child = children as DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>

	return cloneElement(child, {
		...props,
		onClick(e) {
			setVisible(true)
			child.props.onClick?.(e)
		},
	})
}

function CloseButton() {
	return (
		<DialogClose>
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
		</DialogClose>
	)
}

interface DialogContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
	layout?: boolean | "false"
	children?: ReactNode | ((args: { close(): void }) => ReactNode)
}

export function DialogContent({
	layout = true,
	onPointerDown,
	onPointerUp,
	onClick,
	children,
	...props
}: DialogContentProps) {
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
		from: { opacity: 0.5, transform: "scale(0.98) translateX(-50%) translateY(-50%)" },
		enter: { opacity: 1, transform: "scale(1) translateX(-50%) translateY(-50%)" },
		leave: { opacity: 0, transform: "scale(0.98) translateX(-50%) translateY(-50%)" },
		config: { duration: 250, easing: easings.easeOutCubic },
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

	return transitions((s, item) => {
		return (
			item && (
				<animated.div
					role="dialog"
					{...props}
					style={s}
					tw="absolute left-[50%] top-[50%] shadow-lg origin-center sm:(rounded-lg w-full)"
					css={
						layout === true &&
						tw`grid gap-4 border bg-background p-6 w-full max-w-lg sm:max-w-[var(--dialog-width)]`
					}
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

export function DialogClose({
	children,
	...props
}: PropsWithChildren<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">>) {
	const { setVisible } = useContext(dialogContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <DialogClose>{c}</DialogClose>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<button
				type="button"
				tw="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity
					hover:opacity-100
					focus:(outline-none ring-2 ring-ring ring-offset-2)
					disabled:pointer-events-none"
				{...props}
				onClick={() => setVisible(false)}
			>
				{children}
			</button>
		)
	}

	const child = children as DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>

	return cloneElement(child, {
		onClick: e => {
			setVisible(false)
			child.props.onClick?.(e)
		},
	})
}

export function DialogHeader({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col space-y-1.5 text-center sm:text-left" {...props}>
			{children}
		</div>
	)
}

export function DialogTitle({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-lg font-semibold leading-none tracking-tight" {...props}>
			{children}
		</div>
	)
}

export function DialogDescription({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="text-sm text-muted-foreground" {...props}>
			{children}
		</div>
	)
}

export function DialogFooter({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div tw="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2" {...props}>
			{children}
		</div>
	)
}

export interface DialogProps {
	visible?: boolean
	setVisible?(v: boolean | ((prev: boolean) => boolean)): void

	/** @default true */
	blur?: boolean
	/** @default true */
	overlayExit?: boolean

	onClickOverlay?(): void
}

export function Dialog({
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
		(e): e is ReactElement<ComponentProps<typeof DialogContent>> => isElement(e, DialogContent),
	)

	return (
		<dialogContext.Provider value={ctx}>
			{Children.map(children, child => {
				if (isElement(child, DialogContent)) {
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
