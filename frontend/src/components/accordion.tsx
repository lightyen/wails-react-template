import { css } from "@emotion/react"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import {
	Children,
	cloneElement,
	createContext,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type ComponentProps,
	type HTMLAttributes,
	type PropsWithChildren,
	type ReactElement,
} from "react"
import { tw } from "twobj"
import { getElementHeight, isElement } from "./lib"

interface IndexProp {
	index?: number
}

interface AccordionContextItem {
	open: boolean
}

interface AccordionContext {
	items: AccordionContextItem[]
	toggle(i: number): void
}

const accordionContext = createContext(null as unknown as AccordionContext)

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
	type?: "single" | "multiple"
}

export function Accordion({ type = "single", children, ...props }: PropsWithChildren<AccordionProps>) {
	const result = useMemo(() => {
		return Children.toArray(children)
			.filter((e): e is ReactElement<ComponentProps<typeof AccordionItem>> => isElement(e, AccordionItem))
			.map((e, index) => cloneElement(e, { index }))
	}, [children])

	const [items, setItems] = useState<AccordionContextItem[]>(result.map(() => ({ open: false })))

	useEffect(() => {
		setItems(result.map(() => ({ open: false })))
	}, [result])

	if (result.length !== items.length) {
		return null
	}

	return (
		<accordionContext.Provider
			value={{
				toggle(index) {
					if (type === "single") {
						setItems(s => {
							const arr = s.slice()
							for (let i = 0; i < arr.length; i++) {
								if (index === i) {
									arr[i].open = !arr[i].open
								} else {
									arr[i].open = false
								}
							}
							return arr
						})
					} else {
						setItems(s => {
							const arr = s.slice()
							arr[index].open = !arr[index].open
							return arr
						})
					}
					return
				},
				items,
			}}
		>
			<div {...props}>{result}</div>
		</accordionContext.Provider>
	)
}

interface AccordionItemProps extends IndexProp {
	position?: "relative" | "absolute"
}

export function AccordionItem({ children, index = -1, position = "relative" }: PropsWithChildren<AccordionItemProps>) {
	const ref = useRef<HTMLElement>(null)
	const { items } = useContext(accordionContext)
	useLayoutEffect(() => {
		if (position === "absolute") {
			if (ref.current) {
				const el = ref.current
				const h = el.offsetHeight
				el.style.setProperty("--accordion-item-height", h + "px")
			}
		}
	}, [position])

	const { trigger, content } = useMemo(() => {
		const array = Children.toArray(children)
		const triggerElement = array.find((e): e is ReactElement<ComponentProps<typeof AccordionTrigger>> =>
			isElement(e, AccordionTrigger),
		)
		const contentElement = array.find((e): e is ReactElement<ComponentProps<typeof AccordionTrigger>> =>
			isElement(e, AccordionContent),
		)
		return {
			trigger: triggerElement && cloneElement(triggerElement, { index }),
			content: contentElement && cloneElement(contentElement),
		}
	}, [index, children])

	return (
		<section
			ref={ref}
			tw="relative z-10 border-b"
			css={[
				css`
					z-index: ${items.length - index};
				`,
				position === "absolute" && tw`h-[var(--accordion-item-height)]`,
			]}
		>
			{trigger}
			{content}
		</section>
	)
}

interface AccordionTriggerProps extends IndexProp {}

export function AccordionTrigger({ index = -1, children }: PropsWithChildren<AccordionTriggerProps>) {
	const { toggle, items } = useContext(accordionContext)
	return (
		<button
			type="button"
			tw="px-1
				w-full flex items-center justify-between py-4 text-sm font-medium hover:underline
				[&[data-state=open] + div]:h-[var(--accordion-content-height)]
				[& > svg]:(duration-200 h-4 w-4 text-muted-foreground)
				[&[data-state=open] > svg]:rotate-180
			"
			data-state={items[index].open ? "open" : "closed"}
			onClick={() => {
				toggle(index)
			}}
		>
			{children}
			<ChevronDownIcon />
		</button>
	)
}

export function AccordionContent({ children, ...props }: PropsWithChildren) {
	const ref = useRef<HTMLDivElement>(null)
	useLayoutEffect(() => {
		if (ref.current) {
			const el = ref.current
			el.style.setProperty("--accordion-content-height", getElementHeight(el) + "px")
		}
	}, [])
	return (
		<div ref={ref} tw="px-1 transition-[height] overflow-hidden h-0 text-sm [& > div]:(bg-background pb-4)">
			<div {...props}>{children}</div>
		</div>
	)
}
