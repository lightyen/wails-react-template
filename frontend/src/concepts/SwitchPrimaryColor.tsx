import { Button } from "@components/button"
import { Command, CommandItem, CommandList } from "@components/command"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@components/popover"
import { tw } from "twobj"
import { setTheme } from "./theme"

import { useState } from "react"
import "./global.css"

function ColorIcon() {
	return (
		<div tw="w-4 h-4 p-[3px]">
			<div tw="rounded-full w-2.5 h-2.5 ring-1 ring-offset-1 ring-offset-background ring-primary bg-primary" />
		</div>
	)
}

const circleStyle = tw`flex items-center gap-2`

interface PrimaryColor {
	light: string
	dark: string
}

const primaryColors: Record<string, PrimaryColor> = {
	zinc: {
		light: "240 5.9% 10%",
		dark: "240 5.2% 33.9%",
	},
	slate: {
		light: "215.4 16.3% 46.9%",
		dark: "215.3 19.3% 34.5%",
	},
	stone: {
		light: "25 5.3% 44.7%",
		dark: "33.3 5.5% 32.4%",
	},
	gray: {
		light: "220 8.9% 46.1%",
		dark: "215 13.8% 34.1%",
	},
	neutral: {
		light: "0 0% 45.1%",
		dark: "0 0% 32.2%",
	},
	red: {
		light: "0 72.2% 50.6%",
		dark: "0 72.2% 50.6%",
	},
	rose: {
		light: "346.8 77.2% 49.8%",
		dark: "346.8 77.2% 49.8%",
	},
	orange: {
		light: "24.6 95% 53.1%",
		dark: "20.5 90.2% 48.2%",
	},
	green: {
		light: "142.1 76.2% 36.3%",
		dark: "142.1 70.6% 45.3%",
	},
	blue: {
		light: "221.2 83.2% 53.3%",
		dark: "217.2 91.2% 59.8%",
	},
	yellow: {
		light: "47.9 95.8% 53.1%",
		dark: "47.9 95.8% 53.1%",
	},
	violet: {
		light: "262.1 83.3% 57.8%",
		dark: "263.4 70% 50.4%",
	},
}

function variables({ light, dark }: PrimaryColor) {
	return {
		"--primary": light,
		":is(.dark &)": {
			"--primary": dark,
		},
	}
}

export function SwitchPrimaryColor() {
	const [color, setColor] = useState(localStorage.getItem("theme.color"))
	return (
		<Popover placement="bottom-end">
			<PopoverTrigger>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					tw="rounded-none"
					css={color && primaryColors[color] && variables(primaryColors[color])}
				>
					<ColorIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command tw="w-28 p-1">
					<PopoverClose>
						<CommandList>
							<CommandItem value="-" tw="hidden" />
							{Object.entries(primaryColors).map(([color, p]) => (
								<CommandItem
									key={color}
									css={[circleStyle, variables(p)]}
									onSelect={() => {
										localStorage.setItem("theme.color", color)
										setTheme({ color })
										setColor(color)
									}}
								>
									<ColorIcon />
									<span tw="pointer-events-none capitalize">{color}</span>
								</CommandItem>
							))}
						</CommandList>
					</PopoverClose>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
