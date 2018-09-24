const {app, BrowserWindow, ipcMain } = require('electron');

ipcMain.on('say hi', () => console.log('hi!'));

let mainWindow;

function createWindow () {
	mainWindow = new BrowserWindow({width: 1280, height: 720});
	mainWindow.loadURL('http://localhost:3000');
	mainWindow.on('closed', function () {
		mainWindow = null;
	})
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
})

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
})
