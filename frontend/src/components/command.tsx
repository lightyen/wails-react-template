import { css } from "@emotion/react"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Command as CommandPrimitive } from "cmdk"
import { PropsWithChildren, forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react"
import { tw } from "twobj"
import { Dialog, DialogContent, type DialogProps } from "./dialog"

const style = {
	command: css(
		tw`flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground border shadow-md`,
	),
	dialogContent: css(tw`overflow-hidden p-0`),
	dialogCommand: css(tw`
		[& [cmdk-group-heading]]:(px-2 font-medium text-muted-foreground)
		[& [cmdk-group]]:px-1
		[& [cmdk-group]:not([hidden]) ~[cmdk-group]]:pt-0
		[& [cmdk-input-wrapper] svg]:(h-5 w-5)
		[& [cmdk-input]]:h-12
		[& [cmdk-item]]:(px-2 py-3)
		[& [cmdk-item] svg]:(h-5 w-5)
	`),
	group: css(
		tw`overflow-hidden p-1 text-foreground [& [cmdk-group-heading]]:(px-2 py-1.5 text-xs font-medium text-muted-foreground)`,
	),
	list: css(tw`max-h-[300px] overflow-y-auto overflow-x-hidden`),
	item: css(tw`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
		aria-selected:(bg-primary/10 text-primary/80) data-[disabled]:(pointer-events-none opacity-50)`),
	input: {
		wrapper: css(tw`flex items-center border-b px-3`),
		icon: css(tw`mr-2 h-4 w-4 shrink-0 opacity-50`),
		input: css(
			tw`flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:(cursor-not-allowed opacity-50)`,
		),
	},
	empty: css(tw`py-6 text-center text-sm`),
	separator: css(tw`-mx-1 h-px bg-border`),
	shortcut: css(tw`ml-auto text-xs tracking-widest text-muted-foreground`),
}

export const Command = forwardRef<
	ElementRef<typeof CommandPrimitive>,
	ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ ...props }, ref) => <CommandPrimitive ref={ref} css={style.command} {...props} />)
Command.displayName = CommandPrimitive.displayName

export function CommandDialog({ children, ...props }: PropsWithChildren<DialogProps>) {
	return (
		<Dialog {...props}>
			<DialogContent css={style.dialogContent}>
				<Command css={style.dialogCommand}>{children}</Command>
			</DialogContent>
		</Dialog>
	)
}

export const CommandInput = forwardRef<
	ElementRef<typeof CommandPrimitive.Input>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>((props, ref) => (
	<div css={style.input.wrapper}>
		<MagnifyingGlassIcon css={style.input.icon} />
		<CommandPrimitive.Input ref={ref} css={style.input.input} {...props} />
	</div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

export const CommandList = forwardRef<
	ElementRef<typeof CommandPrimitive.List>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>((props, ref) => <CommandPrimitive.List ref={ref} css={style.list} {...props} />)
CommandList.displayName = CommandPrimitive.List.displayName

export const CommandEmpty = forwardRef<
	ElementRef<typeof CommandPrimitive.Empty>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} css={style.empty} {...props} />)
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

export const CommandGroup = forwardRef<
	ElementRef<typeof CommandPrimitive.Group>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>((props, ref) => <CommandPrimitive.Group ref={ref} css={style.group} {...props} />)
CommandGroup.displayName = CommandPrimitive.Group.displayName

export const CommandSeparator = forwardRef<
	ElementRef<typeof CommandPrimitive.Separator>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>((props, ref) => <CommandPrimitive.Separator ref={ref} css={style.separator} {...props} />)
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

export const CommandItem = forwardRef<
	ElementRef<typeof CommandPrimitive.Item>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>((props, ref) => <CommandPrimitive.Item ref={ref} css={style.item} {...props} />)
CommandItem.displayName = CommandPrimitive.Item.displayName

export const CommandShortcut = (props: React.HTMLAttributes<HTMLSpanElement>) => {
	return <span css={style.shortcut} {...props} />
}
CommandShortcut.displayName = "CommandShortcut"
