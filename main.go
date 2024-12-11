package main

import (
	"context"
	"embed"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed test.sh
var test embed.FS

//go:embed all:frontend/dist/*
var assets embed.FS
var wailsContext *context.Context

func (a *App) onSecondInstanceLaunch(secondInstanceData options.SecondInstanceData) {
	secondInstanceArgs := secondInstanceData.Args

	println("user opened second instance", strings.Join(secondInstanceData.Args, ","))
	println("user opened second from", secondInstanceData.WorkingDirectory)
	runtime.WindowUnminimise(*wailsContext)
	runtime.Show(*wailsContext)
	go runtime.EventsEmit(*wailsContext, "launchArgs", secondInstanceArgs)
}

func main() {
	RunSHFile()
	// Create an instance of the app structure
	app := NewApp()

	icon, err := os.ReadFile("build/appicon.png")
	if err != nil {
		println("Error reading icon file:", err.Error())
	}
	// Create application with options
	err = wails.Run(&options.App{
		Title:  "liha",
		Width:  1920,
		Height: 1080,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour:  &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:         app.startup,
		HideWindowOnClose: true,
		Bind: []interface{}{
			app,
		},
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: true,
				HideTitle:                  true,
				HideTitleBar:               false,
				FullSizeContent:            true,
				UseToolbar:                 true,
				HideToolbarSeparator:       true,
			},
			About: &mac.AboutInfo{
				Title:   "Liha",
				Message: "Liha is a desktop app for managing your tasks.",
				Icon:    icon,
			},
		},
		SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId:               "e3984e08-28dc-4e3d-b70a-45e961589cdc",
			OnSecondInstanceLaunch: app.onSecondInstanceLaunch,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}

}

func RunSHFile() {
	data, err := test.ReadFile("test.sh")
	if err != nil {
		println("Error reading file:", err.Error())
	}
	// Run the script
	cmd := exec.Command("sh")
	cmd.Stdin = strings.NewReader(string(data))
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err = cmd.Run()
	if err != nil {
		println("Error running script:", err.Error())
	}

	fmt.Print("Script ran successfully")
}

func RunAIPythonBin() {
	execPath, err := os.Executable()
	if err != nil {
		println("Error getting executable path:", err.Error())
		return
	}
	// Run the script
	appDir := filepath.Dir(execPath)
	resourcesPath := filepath.Join(appDir, "../Resources/ai_new/_build/app-server/bin/python")

	cmd := exec.Command(resourcesPath, "-m", "server")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err = cmd.Run()
	if err != nil {
		println("Error running script:", err.Error())
		return
	}
	cmd.Wait()
}
