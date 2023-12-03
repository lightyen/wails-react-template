import { HTMLAttributes, forwardRef } from "react"

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <div ref={ref} tw="rounded-xl border bg-card text-card-foreground shadow" {...props} />
})
Card.displayName = "Card"

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <div ref={ref} tw="flex flex-col space-y-1.5 p-6" {...props} />
})
CardHeader.displayName = "CardHeader"

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <div ref={ref} tw="flex items-center p-6 pt-0" {...props} />
})
CardFooter.displayName = "CardFooter"

const CardTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <h3 ref={ref} tw="font-semibold leading-none tracking-tight" {...props} />
})
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <p ref={ref} tw="text-sm text-muted-foreground" {...props} />
})
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <div ref={ref} tw="p-6 pt-0" {...props} />
})
CardContent.displayName = "CardContent"

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
