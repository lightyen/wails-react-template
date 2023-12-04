import { forwardRef, type HTMLAttributes } from "react"
import { tw } from "twobj"
import { zs, type VariantProps } from "./lib"

export const badgeVariants = zs(
	tw`inline-flex items-baseline rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors
	focus:(outline-none ring-2 ring-ring ring-offset-2)`,
	{
		variants: {
			variant: {
				default: tw`border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80`,
				secondary: tw`border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80`,
				destructive: tw`border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80`,
				outline: tw`text-foreground`,
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
)

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
	return <div css={badgeVariants(props)} ref={ref} {...props} />
})
Badge.displayName = "Badge"
