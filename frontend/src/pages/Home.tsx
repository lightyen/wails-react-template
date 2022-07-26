import { Anchor } from "@components/anchor"
import { Button } from "@components/button"
import { Input } from "@components/input"
import { Label } from "@components/label"
import { SwitchLanguage } from "@concepts/SwitchLanguage"
import { SwitchPrimaryColor } from "@concepts/SwitchPrimaryColor"
import { SwitchTheme } from "@concepts/SwitchTheme"
import { useAction, useSelect } from "@context"
import * as calc from "@wails/features/Calc"
import { useState } from "react"
import { FormattedMessage } from "react-intl"

export function Home() {
	return (
		<article
			tw="px-3 min-h-full grid items-center"
			onDragOver={e => {
				e.preventDefault()
			}}
			onDrop={e => {
				e.preventDefault()
			}}
		>
			<div>
				<div tw="grid place-items-center gap-3">
					<div tw="text-sm text-muted-foreground whitespace-nowrap">
						<FormattedMessage
							id="press"
							values={{
								key: (
									<kbd tw="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
										<span tw="text-xs">⌘</span>K
									</kbd>
								),
							}}
						/>
					</div>
					<div tw="flex">
						<SwitchLanguage />
						<SwitchPrimaryColor />
						<SwitchTheme />
					</div>
				</div>
				<div tw="mb-1 text-center">
					<Anchor
						href="https://www.radix-ui.com/icons"
						tw="hover:underline accent-accent"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://www.radix-ui.com/icons
					</Anchor>
				</div>
				<div tw="mb-1 text-center">
					<Anchor
						href="https://floating-ui.com/docs/getting-started"
						tw="hover:underline accent-accent"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://floating-ui.com/docs/getting-started
					</Anchor>
				</div>
				<div tw="mb-1 text-center">
					<Anchor
						href="https://ui.shadcn.com/docs"
						tw="hover:underline accent-accent"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://ui.shadcn.com/docs
					</Anchor>
				</div>
				<UserDataDirectory />
				<div tw="flex justify-center">
					<Buttons />
				</div>
				<div tw="pt-3 mx-auto max-w-[var(--dialog-width)]">
					<MD5Form />
					<Demo />
				</div>
			</div>
		</article>
	)
}

function UserDataDirectory() {
	const { openExplorer } = useAction().app
	const userDataPath = useSelect(state => state.app.userDataPath)
	return (
		<div tw="mb-2 text-center text-xs hover:(underline cursor-pointer)" onClick={() => openExplorer(userDataPath)}>
			{userDataPath}
		</div>
	)
}

function MD5Form() {
	const [inputText, setText] = useState("")
	const [response, setResponse] = useState("")
	return (
		<form
			tw="p-4 mb-3 border"
			onSubmit={e => {
				e.preventDefault()
				calc.MD5(inputText).then(resp => setResponse(resp))
			}}
		>
			<div tw="flex gap-4 items-center justify-between">
				<Label>MD5</Label>
				<Input onChange={e => setText(e.target.value)} value={inputText} />
				<Button type="submit" variant="outline">
					<FormattedMessage id="submit" />
				</Button>
			</div>
			<p tw="py-2 min-h-[52px] flex items-end">{response}</p>
		</form>
	)
}

function Buttons() {
	const { openFile, openDirectory } = useAction().app
	return (
		<div tw="mb-3 flex gap-4">
			<Button onClick={() => openFile()}>Open an image</Button>
			<Button onClick={() => openDirectory()}>Open directory</Button>
		</div>
	)
}

function Demo() {
	const images = useSelect(state => state.app.images)
	return (
		<div tw="pt-3 pb-1">
			{images &&
				(Array.isArray(images) ? (
					images.map(src => <img key={src} src={"/img/" + src} />)
				) : (
					<img key={images} tw="w-full" src={"/img/" + images} />
				))}
		</div>
	)
}
