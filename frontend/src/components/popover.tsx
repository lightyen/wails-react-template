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
	useMemo,
	useState,
	type ButtonHTMLAttributes,
	type CSSProperties,
	type HTMLAttributes,
	type PropsWithChildren,
	type ReactElement,
	type ReactNode,
	type RefAttributes,
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
}

const popoverContext = createContext<PopoverContext>(null as unknown as PopoverContext)

export function PopoverTrigger({ children, ...props }: PropsWithChildren<Omit<ButtonProps, "onClick">>) {
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

	const child = children as ReactElement<RefAttributes<HTMLElement>>

	return cloneElement(child, {
		...props,
		ref: refs.setReference,
		...getReferenceProps({
			onClick() {
				setVisible(true)
			},
		}),
	})
}

interface PopoverContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
	children?: ReactNode | ((args: { close(): void }) => ReactNode)
}

export function PopoverContent({ children, ...props }: PopoverContentProps) {
	const { isMounted, refs, floatingStyles, getFloatingProps, styles, setVisible } = useContext(popoverContext)
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

	const child = children as ReactElement<HTMLAttributes<HTMLElement>>

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
}

export function Popover({
	children,
	placement = "bottom",
	visible,
	setVisible = () => void 0,
}: PropsWithChildren<PopoverProps>) {
	const [innerVisible, innerSetVisible] = useState(false)

	const ctx = useMemo(() => {
		if (visible == null) {
			return { visible: innerVisible, setVisible: innerSetVisible }
		}
		return { visible, setVisible }
	}, [innerVisible, visible, setVisible])

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
