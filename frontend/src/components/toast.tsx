import { useAction, useSelect } from "@context"
import { css } from "@emotion/react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { animated, easings, useSpringRef, useTransition } from "@react-spring/web"
import cx from "clsx"
import {
	Children,
	cloneElement,
	isValidElement,
	useEffect,
	useMemo,
	type HTMLAttributes,
	type PropsWithChildren,
	type ReactElement,
} from "react"
import { FormattedMessage } from "react-intl"
import { tw } from "twobj"
import { isElement, zs } from "./lib"

const toastVariants = zs(
	css(tw`pointer-events-auto touch-none transition-colors
	relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border
	p-4 pr-6 shadow-lg
	`),
	{
		variants: {
			variant: {
				default: css(tw`border bg-background text-foreground`),
				destructive: css(tw`border-destructive bg-destructive text-destructive-foreground`),
				primary: css(tw`bg-background border-primary`),
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
)

const style = {
	title: css(tw`text-sm font-semibold [&+div]:text-xs`),
	description: css(tw`text-sm opacity-90`),
	closeBtn: css(tw`
	absolute right-0.5 top-0.5 rounded-md p-0.5 text-foreground/50 not-mobile:opacity-0 transition-opacity
	hover:text-foreground
	focus:(opacity-100 outline-none ring-1 ring-ring/30)
	group-hover:opacity-100
	group-[.destructive]:(text-red-300 hover:text-red-50 focus:(ring-red-400 ring-offset-red-600))
	`),
	closeIcon: css(tw`h-4 w-4`),
	closeText: css(tw`sr-only`),
	action: css(tw`
	inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent
	px-3 text-sm font-medium transition-colors
	hover:bg-secondary focus:(outline-none ring-1 ring-ring) disabled:(pointer-events-none opacity-50)
	group-[.destructive]:(
		border-muted
		hover:(border-muted/30 bg-destructive text-destructive-foreground)
		focus:ring-destructive
	)
	group-[.primary]:(
		border-muted
		hover:(border-muted/30 bg-primary text-primary-foreground)
		focus:ring-primary
	)
	`),
	toaster: css(
		tw`absolute top-0 z-50 w-full p-4 pointer-events-none sm:(right-0 bottom-0 top-auto) md:max-w-[420px]`,
	),
	toastsWrapper: css(tw`relative flex flex-col-reverse sm:flex-col`),
	toast: css(tw`pb-2 first-of-type:(absolute inset-0 top-auto) sm:(pt-3 first-of-type:relative)`),
}

export function Toaster() {
	const { removeAllToast } = useAction().app
	useEffect(() => {
		return () => {
			removeAllToast()
		}
	}, [removeAllToast])
	return (
		<div id="toaster" css={style.toaster}>
			<div css={style.toastsWrapper}>
				<Toasts />
			</div>
		</div>
	)
}

function ToastTitle({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div css={style.title} {...props}>
			{children}
		</div>
	)
}

function ToastDescription({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
	return (
		<div css={style.description} {...props}>
			{children}
		</div>
	)
}

function CloseButton({ onClick }: { onClick?(): void }) {
	return (
		<button type="button" css={style.closeBtn} onClick={onClick}>
			<Cross2Icon tw="h-4 w-4" />
			<span tw="sr-only">
				<FormattedMessage id="close" />
			</span>
		</button>
	)
}

function ToastAction({ children, id }: PropsWithChildren<{ id: string }>) {
	const { dismissToast } = useAction().app
	if (Children.count(children) > 1 && Children.toArray(children).every(isValidElement)) {
		return Children.map(children, child => <ToastAction id={id}>{child}</ToastAction>)
	}

	if (!isValidElement(children) || isElement(children, FormattedMessage)) {
		return (
			<button type="button" css={style.action} onClick={() => dismissToast(id)}>
				{children}
			</button>
		)
	}

	const child = children as ReactElement<HTMLAttributes<HTMLElement>>

	return cloneElement(child, {
		onClick: e => {
			dismissToast(id)
			child.props.onClick?.(e)
		},
	})
}

function Toasts() {
	const toasts = useSelect(state => state.app.toasts)
	const { dismissToast, cancelDismissToast, restartDismissToast } = useAction().app
	const items = useMemo(() => {
		return Object.values(toasts).sort((a, b) => Number(a.id) - Number(b.id))
	}, [toasts])

	const refMap = useMemo(() => new WeakMap(), [])
	const cancelMap = useMemo(() => new WeakMap(), [])
	const api = useSpringRef()
	const transitions = useTransition(items, {
		ref: api,
		keys: item => item.id,
		from: {
			opacity: 0.7,
			height: 0,
			transform: "translateX(0%)",
		},
		enter: item => async (next, cancel) => {
			cancelMap.set(item, cancel)
			await next({
				opacity: 1,
				transform: "translateX(0%)",
				height: refMap.get(item).offsetHeight,
			})
		},
		leave: [{ opacity: 0, transform: "translateX(100%)" }, { height: 0 }],
		config: { duration: 300, easing: easings.easeInOutCubic },
	})

	useEffect(() => {
		api.start()
	}, [api, items])

	return transitions((s, item) => (
		<animated.div tw="relative" style={s}>
			<div
				css={style.toast}
				className={cx("group", item.variant)}
				ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
			>
				<div
					css={toastVariants(item)}
					onPointerEnter={() => {
						cancelDismissToast(item.id)
					}}
					onPointerLeave={() => {
						restartDismissToast(item.id)
					}}
				>
					<div tw="grid gap-1">
						{item.title && <ToastTitle>{item.title}</ToastTitle>}
						{item.description && (
							<ToastDescription>
								{item.description} {item.id}
							</ToastDescription>
						)}
					</div>
					{item.action && <ToastAction id={item.id}>{item.action}</ToastAction>}
					<CloseButton onClick={() => dismissToast(item.id)} />
				</div>
			</div>
		</animated.div>
	))
}
