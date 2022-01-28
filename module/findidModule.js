
const {app, BrowserWindow } = require('electron')

const path = require('path')
const {ipcMain} = require('electron');


exports.createFindAccount = function () {
    // Create the browser find account window.
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
            preload: path.join(__dirname, '../preload/find_accountPreload.js')
        },
        title:"Find your account"
    })
    mainWindow.setResizable(false);
    mainWindow.loadFile('html/find_account.html')
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    ipcMain.on('findFrameButtonEvent', (event,arg) => {
        if (arg.value === "close") {
            mainWindow.close()
        }
    })

}