import { HTMLAttributes, forwardRef } from "react"

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
	/** 0 - 100 */
	value: number
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(({ value, ...props }, ref) => {
	return (
		<div tw="relative h-2 w-full overflow-hidden rounded-full bg-primary/20" ref={ref} {...props}>
			<div
				tw="h-full w-full flex-1 bg-primary transition-all"
				css={{ transform: `translateX(-${100 - Math.max(Math.min(100, value), 0)}%)` }}
			/>
		</div>
	)
})
Progress.displayName = "Progress"
