package main

func main() {
	app := New()
	if err := app.Run(); err != nil {
		panic(err)
	}
}
