const {app, BrowserWindow } = require('electron')

const path = require('path')
const {ipcMain} = require('electron');



exports.createSignupWindow = function () {
    // Create the browser Signup window.
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
            preload: path.join(__dirname, '../preload/signupPreload.js')
        },
        title:"Sign up"
    })
    mainWindow.setResizable(false);
    mainWindow.loadFile('html/signup.html')
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    ipcMain.on('signupFrameButtonEvent', (event,arg) => {
        if (arg.value === "close") {
            mainWindow.close()
        }
    })

    ipcMain.on('signupButtonEvent', (event,arg) => {
        if (arg.value === "accept") {
            mainWindow.close()
            createWindow()
        }
        else if (arg.value === "cancel") {
            mainWindow.close()
            createWindow()
        }

    })

    return mainWindow
}