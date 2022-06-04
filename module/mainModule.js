const {app, BrowserWindow } = require('electron')

const path = require('path')
const {ipcMain} = require('electron');
const fs = require("fs")

exports.createWindow = function (pass) {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        show:false,
        resizable:false,
        minimizable:false,
        maximizable:false,
        fullscreenable:true,
        frame:false,
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true, contextIsolation: false,
            preload: path.join(__dirname, '../preload/preload.js')
        }
    })

    mainWindow.loadFile('html/index.html')
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })



    ipcMain.on('mainFrameButtonEvent', (event,arg) => {
        if (arg.value === "close") {
            mainWindow.close()
        }
        else if (arg.value === "size") {
            if(arg.size === "big") {
                mainWindow.setFullScreen(true)
            }
            else {
                mainWindow.setFullScreen(false)
            }
        }
        else if(arg.value === "under") {
            mainWindow.minimize()
        }
    })


    return mainWindow
}