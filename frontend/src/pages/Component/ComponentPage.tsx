import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/accordion"
import { Badge } from "@components/badage"
import { Button } from "@components/button"
import { Command, CommandItem, CommandList } from "@components/command"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@components/dialog"
import { Input } from "@components/input"
import { Label } from "@components/label"
import { Overlay } from "@components/overlay"
import { Popover, PopoverContent, PopoverTrigger } from "@components/popover"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@components/sheet"
import { CircleLoading } from "@components/spin"
import { RouteTab, RouterTabs } from "@concepts/RouteTabs"
import { useToast } from "@context"
import { PlusIcon } from "@radix-ui/react-icons"
import dayjs from "dayjs"
import { Fragment, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { Outlet, useNavigate } from "react-router-dom"
import { Header, Separator } from "~/pages/common"

export function Component() {
	return (
		<article tw="max-w-3xl ml-[25%] mr-[20%] pt-6 pb-20">
			<Header>Time</Header>
			<div tw="whitespace-pre">{dayjs().format("LLLL")}</div>
			<Separator />
			<Header>Button</Header>
			<ButtonView />
			<Separator />
			<Header>Badge</Header>
			<BadgeView />
			<Separator />
			<Header>Tabs</Header>
			<TabView />
			<Separator />
			<Header>Dialog</Header>
			<DialogView />
			<Separator />
			<Header>Accordion</Header>
			<AccordionView />
		</article>
	)
}

function ButtonView() {
	return (
		<div tw="flex flex-wrap gap-4">
			<Button>Apply</Button>
			<Button variant="outline">Detail</Button>
			<Button variant="outline">
				<PlusIcon /> Icon
			</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="link">Link</Button>
			<Button variant="destructive">Delete</Button>
		</div>
	)
}
function BadgeView() {
	return (
		<div tw="flex flex-wrap gap-4">
			<Badge>badge</Badge>
			<Badge variant="outline">badge</Badge>
			<Badge variant="secondary">badge</Badge>
		</div>
	)
}

function DialogView() {
	return (
		<div tw="max-w-xl space-y-4 [& > div]:(flex flex-wrap gap-4)">
			<div>
				<DialogDemo />
			</div>
			<div>
				<SheetForm />
				<SheetForm side="left" />
				<SheetForm side="top" />
				<SheetForm side="bottom" />
			</div>
			<div>
				<ToastDemo />
			</div>
			<div>
				<Waiting />
			</div>
		</div>
	)
}

function ToastDemo() {
	const { toast } = useToast()
	return (
		<Button
			variant="outline"
			onClick={() => {
				toast({
					variant: randomVariant(),
					title: "Scheduled: Catch up ",
					description:
						Math.round(Math.random() * 100) % 2 == 0 ? (
							<FormattedMessage id="off" />
						) : (
							"osfb2 n23fns 30n32ibsd sodfwnef sdfoanfwaeo sdofnsafowe sdfosandf asdfaso"
						),
					action: "Accept",
				})
			}}
		>
			Toast
		</Button>
	)
	function randomVariant() {
		const n = Math.round(Math.random() * 100) % 3
		switch (n) {
			case 1:
				return "primary"
			case 2:
				return "destructive"
			default:
				return undefined
		}
	}
}

function TabView() {
	const navigate = useNavigate()
	return (
		<Fragment>
			<RouterTabs onNavigate={navigate}>
				<RouteTab title="Preview" to="preview" />
				<RouteTab title="Tab 2" to="tab2" />
				<RouteTab title="Tab 3" to="tab3" />
				<RouteTab title="Tab 4" to="tab4" />
				<RouteTab title="Tab 5" to="tab5" />
				<RouteTab title="Tab 6" to="tab6" />
			</RouterTabs>
			<Outlet />
		</Fragment>
	)
}

function DialogDemo({ depth = 2 }: { depth?: number }) {
	return (
		<Dialog>
			<DialogTrigger>
				<Button variant="outline">Dialog</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				{depth > 0 && <Input autoFocus type="text" placeholder="username" />}
				<DialogFooter>
					{depth > 0 ? (
						<DialogDemo depth={depth - 1} />
					) : (
						<DialogClose>
							<Button type="submit">Done</Button>
						</DialogClose>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function SheetForm({ side }: { side?: "top" | "right" | "bottom" | "left" }) {
	return (
		<Sheet>
			<SheetTrigger variant="outline">Sheet {side ?? "right"}</SheetTrigger>
			<SheetContent side={side}>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when you&#39;re done.
					</SheetDescription>
				</SheetHeader>
				<div tw="grid gap-4 py-4">
					<div tw="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" tw="text-right">
							Name
						</Label>
						<Input autoFocus id="name" tw="col-span-3" />
					</div>
					<div tw="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="username" tw="text-right">
							Username
						</Label>
						<Input id="username" tw="col-span-3" />
					</div>
				</div>
				<SheetFooter>
					<SheetClose>
						<Button type="submit">
							<FormattedMessage id="apply" />
						</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

export function Waiting() {
	const [open, setOpen] = useState(false)
	useEffect(() => {
		if (open) {
			window.setTimeout(() => {
				setOpen(false)
			}, 1500)
		}
	}, [open])
	return (
		<Fragment>
			<Button variant="outline" onClick={() => setOpen(true)}>
				Waiting
			</Button>
			<Overlay visible={open}>
				<div tw="absolute inset-0 grid place-items-center">
					<div tw="flex gap-3 flex-col items-center">
						<CircleLoading tw="w-20 border-8" />
						<div tw="text-2xl">Waiting</div>
					</div>
				</div>
			</Overlay>
		</Fragment>
	)
}

function AccordionView() {
	return (
		<Accordion tw="max-w-xl">
			<AccordionItem>
				<AccordionTrigger>Is it accessible?</AccordionTrigger>
				<AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
			</AccordionItem>
			<AccordionItem>
				<AccordionTrigger>Is it styled?</AccordionTrigger>
				<AccordionContent>
					Yes. It comes with default styles that matches the other components&apos; aesthetic.
					<div tw="mt-5">
						<Popover placement="bottom-start">
							<PopoverTrigger>
								<Button variant="outline">Command</Button>
							</PopoverTrigger>
							<PopoverContent>
								<Command tw="min-w-[150px] p-1">
									<CommandList>
										<CommandItem>AAA</CommandItem>
										<CommandItem>BBB</CommandItem>
										<CommandItem>CCC</CommandItem>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem>
				<AccordionTrigger>Is it animated?</AccordionTrigger>
				<AccordionContent>
					Yes. It&lsquo;s animated by default, but you can disable it if you prefer.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}
