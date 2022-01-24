const {app, BrowserWindow } = require('electron')

const path = require('path')
const {ipcMain} = require('electron');

exports.createWindow = function () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        show:false,
        resizable:false,
        minimizable:false,
        maximizable:false,
        fullscreenable:false,
        frame:false,
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js')
        }
    })

    mainWindow.loadFile('html/index.html')
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
}