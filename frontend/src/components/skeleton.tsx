import { css } from "@emotion/react"
import { tw } from "twobj"

const style = {
	skeleton: css(tw`animate-pulse rounded-md bg-primary/10`),
}

export function Skeleton(props: React.HTMLAttributes<HTMLDivElement>) {
	return <div css={style.skeleton} {...props} />
}
