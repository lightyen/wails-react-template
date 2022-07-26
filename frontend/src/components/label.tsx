import { css } from "@emotion/react"
import { forwardRef, type LabelHTMLAttributes } from "react"
import { tw } from "twobj"

const style = {
	label: css(tw`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`),
}

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ ...props }, ref) => (
	<label ref={ref} css={style.label} {...props} />
))
Label.displayName = "Label"
