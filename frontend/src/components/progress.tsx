import { css } from "@emotion/react"
import { HTMLAttributes, forwardRef } from "react"
import { tw } from "twobj"

const style = {
	bar: css(tw`relative h-2 w-full overflow-hidden rounded-full bg-primary/20`),
	progress: css(tw`h-full w-full flex-1 bg-primary transition-all`),
}

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
	/** 0 - 100 */
	value: number
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(({ value, ...props }, ref) => {
	return (
		<div css={style.bar} ref={ref} {...props}>
			<div css={[style.progress, { transform: `translateX(-${100 - Math.max(Math.min(100, value), 0)}%)` }]} />
		</div>
	)
})
Progress.displayName = "Progress"
