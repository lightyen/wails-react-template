# Wails React Template

## About

This is a [Wails](https://github.com/wailsapp/wails) template including a frameless window with the titlebar and AssetsHandler.

## Prepare

1. Install wails CLI

	```sh
	go install github.com/wailsapp/wails/v2/cmd/wails@latest
	```

2. Install nodejs and [pnpm](https://pnpm.io/)

### Create a new project from template

```sh
wails init -n wailsapp -t https://github.com/lightyen/wails-react-template
```

## Live Development

To run in live development mode, run `wails dev` in the project directory.

## Building

To build a redistributable, production mode package, use `wails build`.
