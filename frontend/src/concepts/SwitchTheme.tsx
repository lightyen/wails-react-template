import { Button } from "@components/button"
import { Command, CommandItem, CommandList } from "@components/command"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@components/popover"
import { Half2Icon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { FormattedMessage } from "react-intl"
import { tw } from "twobj"
import { setTheme } from "./theme"

const style = tw`flex items-center gap-2`

export function SwitchTheme() {
	type ThemeStyle = "system" | "light" | "dark"
	const [themeStyle, setStyle] = useState<ThemeStyle>(() => {
		return (localStorage.getItem("theme.style") as ThemeStyle) ?? "system"
	})
	return (
		<Popover placement="bottom-end">
			<PopoverTrigger>
				<Button type="button" variant="ghost" size="icon" tw="rounded-none">
					{(() => {
						switch (themeStyle) {
							case "light":
								return <SunIcon />
							case "dark":
								return <MoonIcon />
							default:
								return <Half2Icon />
						}
					})()}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command tw="w-auto p-1">
					<PopoverClose>
						<CommandList>
							<CommandItem value="-" tw="hidden" />
							<CommandItem
								onSelect={() => {
									localStorage.removeItem("theme.style")
									setTheme({ style: "system" })
									setStyle("system")
								}}
								css={style}
							>
								<Half2Icon />
								<span tw="pointer-events-none capitalize">
									<FormattedMessage id="system_mode" />
								</span>
							</CommandItem>
							<CommandItem
								onSelect={() => {
									localStorage.setItem("theme.style", "light")
									setTheme({ style: "light" })
									setStyle("light")
								}}
								css={style}
							>
								<SunIcon />
								<span tw="pointer-events-none capitalize">
									<FormattedMessage id="light_mode" />
								</span>
							</CommandItem>
							<CommandItem
								onSelect={() => {
									localStorage.setItem("theme.style", "dark")
									setTheme({ style: "dark" })
									setStyle("dark")
								}}
								css={style}
							>
								<MoonIcon />
								<span tw="pointer-events-none capitalize">
									<FormattedMessage id="dark_mode" />
								</span>
							</CommandItem>
						</CommandList>
					</PopoverClose>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
