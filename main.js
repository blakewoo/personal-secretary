const {app, BrowserWindow } = require('electron')
const path = require('path')

function createLoginWindow() {
    // Create the browser login window.
    const mainWindow = new BrowserWindow({
        width: 300,
        height: 400,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'loginPreload.js')
        },
        title:"Login to timeout"
    })
    mainWindow.setResizable(false);
    mainWindow.loadFile('login.html')
}


function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
    createLoginWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

