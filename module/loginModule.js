const {app, BrowserWindow } = require('electron')

const path = require('path')
const {ipcMain} = require('electron');

exports.createLoginWindow = function() {
    // Create the browser login window.
    const mainWindow = new BrowserWindow({
        show:false,
        resizable:false,
        minimizable:false,
        maximizable:false,
        fullscreenable:false,
        frame:false,
        width: 300,
        height: 400,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '../preload/loginPreload.js')
        },
        title:"로그인"
    })
    mainWindow.setResizable(false);
    mainWindow.loadFile('html/login.html')
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    ipcMain.on('frameButtonEvent', (event,arg) => {
        if (arg.value === "close") {
            mainWindow.close()
        }
    })

    ipcMain.on('loginButtonEvent', (event,arg) => {
        if (arg.value === "login") {
            mainWindow.close()
        }
        else if (arg.value === "signup") {
            mainWindow.close()
        }
        else if (arg.value === "findid") {
            mainWindow.close()
        }
        else {
            mainWindow.close()
        }
    })

    return mainWindow
}