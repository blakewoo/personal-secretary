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
        fullscreenable:false,
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
    })

    ipcMain.on('mainPageInitData', (event,arg) => {
        let data;
        let indexFile;
        // const toAscii = (string) => string.split('').map(char=>char.charCodeAt(0)).join("")
        try{
            indexFile = Array(fs.readFileSync("./index"));

            try {
                data = fs.readFileSync("./"+indexFile[0]);
            }
            catch(e) {
                data = {}
                fs.writeFileSync("./"+indexFile[0]);
            }

        }
        catch(e){
            indexFile = []
            fs.writeFileSync("./index",indexFile.toString())
        }
        data = ""
        event.sender.send("sendInitData",data)
    })

    // Read category
    ipcMain.on('categoryReadData', (event,arg) => {

    })

    // Update category
    ipcMain.on('categoryUpdateData', (event,arg) => {

    })

    // Read todo
    ipcMain.on('detailTodoReadData', (event,arg) => {

    })

    // Update todo
    ipcMain.on('detailTodoUpdateData', (event,arg) => {

    })

    return mainWindow
}