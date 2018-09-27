const { app, BrowserWindow, Menu } = require('electron');

let mainWindow;

function createWindow () {
	mainWindow = new BrowserWindow({width: 1280, height: 720});
	mainWindow.loadURL('http://localhost:3000');
	mainWindow.on('closed', function () {
		mainWindow = null;
	})

	Menu.setApplicationMenu(Menu.buildFromTemplate([
		{
			label: 'File',
			submenu: [
				{
					label: 'Open',
					accelerator: 'CmdOrCtrl+O',
					click(item, focusedWindow) {
						if (focusedWindow) focusedWindow.webContents.send('open');
					}
				},
				{
					label: 'Save',
					accelerator: 'CmdOrCtrl+S',
					click(item, focusedWindow) {
						if (focusedWindow) focusedWindow.webContents.send('save');
					}
				},
				{
					label: 'Save as',
					accelerator: 'CmdOrCtrl+Shift+S',
					click(item, focusedWindow) {
						if (focusedWindow) focusedWindow.webContents.send('save', true);
					}
				},
			],
		},
		{
			label: 'Developer',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					click(item, focusedWindow) {
						if (focusedWindow) focusedWindow.reload()
					}
				},
				{
					label: 'Toggle developer tools',
					accelerator: 'CmdOrCtrl+Shift+I',
					click (item, focusedWindow) {
						if (focusedWindow) focusedWindow.webContents.toggleDevTools()
					}
				}
			]
		}
	]));
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
