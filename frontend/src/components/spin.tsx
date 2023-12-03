import { css, keyframes } from "@emotion/react"
import { SVGAttributes, useMemo } from "react"

const spin = keyframes`
from {
	transform: rotate(0deg);
}
to {
	transform: rotate(359deg);
}`

interface SpinArcProps extends SVGAttributes<SVGSVGElement> {
	radius?: number
	strokeWidth?: number
}

export function SpinArcLoading({ radius = 8, strokeWidth = 3, ...props }: SpinArcProps) {
	let openAngle = 0
	const _s = strokeWidth / 2
	const _r = radius + _s
	const length = radius * (2 * Math.PI - openAngle)
	const running = useMemo(
		() => keyframes`
		0% {
			stroke-dashoffset: 0;
			opacity: 1;
		}
		20% { opacity: 1; }
		50% {
			opacity: 0.75;
			stroke-dashoffset: ${length};
		}
		80% { opacity: 1; }
		100% {
			stroke-dashoffset: ${2 * length};
			opacity: 1;
		}`,
		[length],
	)

	if (openAngle > 2 * Math.PI) openAngle = 2 * Math.PI

	if (openAngle < 0) openAngle = 0

	const largeArc = openAngle > Math.PI ? "0" : "1"

	function transform() {
		let x = radius * Math.cos(openAngle)
		let y = radius * Math.sin(openAngle)
		y = -y
		x += radius + _s
		y += radius + _s

		const epsilon = 10e-6
		if (openAngle === 0) y -= epsilon
		return { x, y }
	}

	const { x, y } = transform()

	return (
		<svg height={2 * _r} width={2 * _r} tw="stroke-current" {...props}>
			<g
				css={css`
					transform-origin: ${_r}px ${_r}px;
					animation: ${spin} 1.2s linear infinite;
				`}
			>
				<path
					css={css`
						stroke-width: ${strokeWidth}px;
						fill: none;
						stroke-dasharray: ${length};
						stroke-dashoffset: 0;
						animation: ${running} 2s linear reverse infinite;
					`}
					d={`M${2 * radius + _s} ${radius + _s} A${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}`}
				/>
			</g>
		</svg>
	)
}

export function CircleLoading({ ...props }: {}) {
	return (
		<div
			tw="rounded-full after:(rounded-full w-full h-full) aspect-square border-muted border-l-primary/75 animate-spin"
			{...props}
		/>
	)
}
