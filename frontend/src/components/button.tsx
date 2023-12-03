import { forwardRef, type ButtonHTMLAttributes } from "react"
import { tx } from "twobj"
import { zs, type VariantProps } from "./lib"

export const buttonVariants = zs(
	tx`inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors
	focus-visible:(outline-none ring-1 ring-ring) disabled:(pointer-events-none opacity-50)`,
	{
		variants: {
			variant: {
				default: tx`bg-primary text-primary-foreground hover:bg-primary/90`,
				destructive: tx`bg-destructive text-destructive-foreground hover:bg-destructive/90`,
				outline: tx`border border-input bg-background hover:(bg-accent text-accent-foreground)`,
				secondary: tx`bg-secondary text-secondary-foreground hover:bg-secondary/80`,
				ghost: tx`hover:(bg-accent text-accent-foreground)`,
				link: tx`text-primary underline-offset-4 hover:underline`,
			},
			size: {
				default: tx`h-9 px-4 py-2`,
				sm: tx`h-8 rounded-md px-3 text-xs`,
				lg: tx`h-10 rounded-md px-8`,
				icon: tx`h-9 w-9`,
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ type = "button", ...props }, ref) => {
	return <button type={type} role="button" css={buttonVariants(props)} ref={ref} {...props} />
})
Button.displayName = "Button"
