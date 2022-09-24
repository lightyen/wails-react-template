import { useAction, useSelect } from "./store"

export function TitleBar({ className }: { className?: string }) {
	const { toggleMaximizeWindow } = useAction().app
	return (
		<div
			tw="relative flex
			[--control-panel-width: (var(--control-ratio) * 138px)]
			[--icon-size: (var(--control-ratio) * 10px)]
			[height: calc(var(--titlebar-height))]
			[line-height: calc(var(--titlebar-height))]
			text-white bg-gray-900
		"
			className={className}
		>
			<div tw="absolute inset-0 flex">
				<div aria-label="appicon" tw="[width: calc(var(--control-panel-width))]"></div>
				<div tw="text-xs text-white/50 flex-1 flex justify-center items-center overflow-hidden whitespace-nowrap select-none text-ellipsis duration-150">
					{import.meta.env.VITE_APP_NAME}
				</div>
				<div
					aria-label="control-panel"
					tw="flex
					[button]:(h-full flex items-center justify-center font-bold outline-none hover:bg-red-500 duration-150 [width: calc(var(--control-panel-width) / 3)])
					[svg]:(fill-gray-100 [width: calc(var(--icon-size))] [height: calc(var(--icon-size))])"
				>
					<MinimiseButton />
					<MaxButton />
					<CloseButton />
				</div>
			</div>
			<div tw="relative w-[calc(100% - var(--control-panel-width))]" onClick={toggleMaximizeWindow}>
				<DragRegion tw="absolute top-1 right-0 bottom-0 left-1" />
			</div>
		</div>
	)
}

function DragRegion({ children, className }: React.PropsWithChildren<{ className?: string }>) {
	return (
		<div aria-label="wails-drag-region" tw="[--wails-draggable: drag]" className={className}>
			{children}
		</div>
	)
}

function MaxButton() {
	const { toggleMaximizeWindow } = useAction().app
	const isMaximized = useSelect(state => state.app.isMaximized)
	return (
		<button type="button" onClick={toggleMaximizeWindow}>
			{isMaximized ? (
				<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 10">
					<mask id="Mask">
						<rect fill="#ffffff" width="10" height="10" />
						<path fill="#000000" d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z" />
						<path fill="#000000" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z" />
					</mask>
					<path d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z" mask="url(#Mask)" />
				</svg>
			) : (
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
					<path d="M 0 0 L 0 9.5 L 10 9.5 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 8.5 L 1 8.5 L 1 1 z " />
				</svg>
			)}
		</button>
	)
}

function MinimiseButton() {
	const { minimiseWindow } = useAction().app
	return (
		<button type="button" onClick={minimiseWindow}>
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 1.5">
				<rect width="10" height="1.5" />
			</svg>
		</button>
	)
}

function CloseButton() {
	const { quit } = useAction().app
	return (
		<button type="button" onClick={quit}>
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 10">
				<polygon points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5" />
			</svg>
		</button>
	)
}
