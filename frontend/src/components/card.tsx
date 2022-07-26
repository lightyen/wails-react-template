import { css } from "@emotion/react"
import { HTMLAttributes, forwardRef } from "react"
import { tw } from "twobj"

const style = {
	card: css(tw`rounded-xl border bg-card text-card-foreground shadow`),
	header: css(tw`flex flex-col space-y-1.5 p-6`),
	title: css(tw`font-semibold leading-none tracking-tight`),
	description: css(tw`text-sm text-muted-foreground`),
	content: css(tw`p-6 pt-0`),
	footer: css(tw`flex items-center p-6 pt-0`),
}

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <div ref={ref} css={style.card} {...props} />
})
Card.displayName = "Card"

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <div ref={ref} css={style.header} {...props} />
})
CardHeader.displayName = "CardHeader"

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <div ref={ref} css={style.footer} {...props} />
})
CardFooter.displayName = "CardFooter"

const CardTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <h3 ref={ref} css={style.title} {...props} />
})
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <p ref={ref} css={style.description} {...props} />
})
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
	return <div ref={ref} css={style.content} {...props} />
})
CardContent.displayName = "CardContent"

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
