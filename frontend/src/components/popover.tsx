import {
	autoUpdate,
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useInteractions,
	useTransitionStyles,
	type Placement,
	type UseFloatingReturn,
} from "@floating-ui/react"
import {
	Children,
	cloneElement,
	createContext,
	isValidElement,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ButtonHTMLAttributes,
	type CSSProperties,
	type DetailedReactHTMLElement,
	type HTMLAttributes,
	type MutableRefObject,
	type PropsWithChildren,
	type ReactElement,
	type ReactNode,
} from "react"
import { FormattedMessage } from "react-intl"
import { Button, type ButtonProps } from "./button"
import { isElement } from "./lib"

interface PopoverContext {
	visible: boolean
	setVisible(v: boolean): void
	refs: UseFloatingReturn["refs"]
	floatingStyles: UseFloatingReturn["floatingStyles"]
	getReferenceProps: ReturnType<typeof useInteractions>["getReferenceProps"]
	getFloatingProps: ReturnType<typeof useInteractions>["getFloatingProps"]
	styles: CSSProperties
	isMounted: boolean
	onLeave(): void
}

const popoverContext = createContext<PopoverContext>(null as unknown as PopoverContext)

interface PopoverTriggerProps extends Omit<ButtonProps, "onClick"> {
	mode?: "click" | "none"
}

export function PopoverTrigger({ children, mode = "click", ...props }: PropsWithChildren<PopoverTriggerProps>) {
	const { setVisible, refs, getReferenceProps } = useContext(popoverContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <PopoverTrigger>{c}</PopoverTrigger>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<Button ref={refs.setReference} {...getReferenceProps()}>
				{children}
			</Button>
		)
	}

	const child = children as ReactElement<HTMLAttributes<Element>> & {
		ref: ((instance: HTMLElement | null) => void) | MutableRefObject<HTMLElement | null> | null
	}

	const innerProps = getReferenceProps({
		ref: node => {
			refs.setReference(node)
			if (typeof child.ref === "function") {
				child.ref(node as HTMLElement)
			} else if (child.ref) {
				child.ref.current = node as HTMLElement
			}
		},
		onClick(e) {
			if (mode === "click") {
				setVisible(true)
			}
			child.props.onClick?.(e)
		},
	})

	const keys = Object.getOwnPropertyNames(child.props)
	for (const k of keys) {
		if (k === "ref") {
			continue
		}
		if (Object.prototype.hasOwnProperty.call(innerProps, k)) {
			const ch = child.props[k]
			const inner = innerProps[k]
			if (typeof ch === "function" && typeof inner === "function") {
				innerProps[k] = (...args: unknown[]) => {
					ch(...args)
					inner(...args)
				}
			}
		}
	}

	return cloneElement(child, {
		...props,
		...innerProps,
	})
}

interface PopoverContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
	children?: ReactNode | ((args: { close(): void }) => ReactNode)
}

export function PopoverContent({ children, ...props }: PopoverContentProps) {
	const { isMounted, refs, floatingStyles, getFloatingProps, styles, setVisible, onLeave } =
		useContext(popoverContext)
	const cb = useRef(onLeave)
	useEffect(() => {
		const onLeave = cb.current
		return () => {
			if (isMounted) {
				onLeave()
			}
		}
	}, [isMounted])
	if (children == null) {
		return null
	}
	return (
		isMounted && (
			<div ref={refs.setFloating} style={{ ...floatingStyles, zIndex: 20 }} {...getFloatingProps()} {...props}>
				<div style={styles}>
					{typeof children === "function" ? children({ close: () => setVisible(false) }) : children}
				</div>
			</div>
		)
	)
}

export function PopoverClose({
	children,
	...props
}: PropsWithChildren<Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">>) {
	const { setVisible } = useContext(popoverContext)

	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, c => <PopoverClose>{c}</PopoverClose>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<button type="button" {...props} onClick={() => setVisible(false)}>
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

export function usePopover(initialState: boolean | (() => boolean) = false) {
	const [visible, setVisible] = useState(initialState)
	return { visible, setVisible }
}

interface PopoverProps {
	placement?: Placement
	visible?: boolean
	setVisible?(v: boolean | ((prev: boolean) => boolean)): void
	onLeave?(): void
}

export function Popover({
	children,
	placement = "bottom",
	visible,
	setVisible = () => void 0,
	onLeave = () => void 0,
}: PropsWithChildren<PopoverProps>) {
	const [innerVisible, innerSetVisible] = useState(false)

	const ctx = useMemo(() => {
		if (visible == null) {
			return { visible: innerVisible, setVisible: innerSetVisible, onLeave }
		}
		return { visible, setVisible, onLeave }
	}, [innerVisible, visible, setVisible, onLeave])

	const { refs, floatingStyles, context } = useFloating({
		open: ctx.visible,
		onOpenChange: ctx.setVisible,
		placement,
		middleware: [offset(5), shift({ padding: 8 }), flip()],
		whileElementsMounted: autoUpdate,
	})
	const dismiss = useDismiss(context, {
		referencePressEvent: "pointerdown",
		outsidePress: true,
	})
	const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])
	const { isMounted, styles } = useTransitionStyles(context, {
		duration: { open: 180, close: 200 },
		common: ({ side }) => ({
			transitionTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)",
			zIndex: 50,
			transformOrigin: {
				top: "bottom",
				left: "right",
				bottom: "top",
				right: "left",
			}[side],
		}),
		initial: ({ side }) => ({
			opacity: 0,
			transform: {
				top: "translateY(5px) scale(0.9)",
				right: "translateX(-5px) scale(0.9)",
				bottom: "translateY(-5px) scale(0.9)",
				left: "translateX(5px) scale(0.9)",
			}[side],
		}),
		close: () => ({ opacity: 0 }),
	})
	return (
		<popoverContext.Provider
			value={{
				...ctx,
				isMounted,
				refs,
				floatingStyles,
				getReferenceProps,
				getFloatingProps,
				styles,
			}}
		>
			{children}
		</popoverContext.Provider>
	)
}
