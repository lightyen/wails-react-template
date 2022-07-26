import { BrowserOpenURL } from "@wails/runtime"
import { forwardRef, type AnchorHTMLAttributes } from "react"

interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(({ onClick, ...props }, ref) => {
	return (
		<a
			ref={ref}
			onClick={e => {
				const link = e.target as HTMLAnchorElement
				const url = new URL(link.href)
				const { protocol } = url
				if (protocol === "http:" || url.protocol === "https:") {
					e.preventDefault()
					BrowserOpenURL(link.href)
				}
				onClick?.(e)
			}}
			{...props}
		/>
	)
})
Anchor.displayName = "Anchor"
