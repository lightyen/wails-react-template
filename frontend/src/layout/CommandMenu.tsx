import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@components/command"
import { useDialog } from "@components/dialog"
import { getDialogCount } from "@components/lib/scrollbar"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function CommandMenu() {
	const navigate = useNavigate()
	const { visible, setVisible } = useDialog()
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				if (!open && getDialogCount() > 0) {
					return
				}
				setVisible(visible => !visible)
			}
		}
		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [setVisible])
	return (
		<CommandDialog visible={visible} setVisible={setVisible}>
			<CommandInput placeholder="Type a command or search..." autoFocus />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					<CommandItem
						onSelect={() => {
							setVisible(false)
							navigate("/")
						}}
					>
						Home
					</CommandItem>
					<CommandItem
						onSelect={() => {
							setVisible(false)
							navigate("/components")
						}}
					>
						Components
					</CommandItem>
					<CommandItem
						onSelect={() => {
							setVisible(false)
							navigate("/form")
						}}
					>
						Form
					</CommandItem>
					<CommandItem
						onSelect={() => {
							setVisible(false)
							navigate("/table")
						}}
					>
						Table
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	)
}
