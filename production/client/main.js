const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
			nodeIntegration: true,
			nativeWindowOpen: true,
		}
	});

	// This is a popup window for performance metrics
	win.webContents.on('new-window',
		(event, url, frameName, disposition, options, additionalFeatures) => {
			// This is the name we chose for our window. You can have multiple names for
			// multiple windows and each have their options
			if (frameName === 'Expanded Performance Metrics') {
				event.preventDefault();
				Object.assign(options, {
					// This will prevent interactions with the mainWindow
					parent: win,
					width: 800,
					height: 600,
					// You can also set `left` and `top` positions
				});
				event.newGuest = new BrowserWindow(options);
			}
		});

	// and load the index.html of the app.
	// win.loadFile('client/index.html')

	// In order to render a running instance of the initialized React App
	// win.loadURL('http://localhost:3000/');

	// This is used when distributing the Electron app
	win.loadURL(`file://${path.join(__dirname, '../client/index.html')}`);

	// Open the DevTools.
	win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
});
