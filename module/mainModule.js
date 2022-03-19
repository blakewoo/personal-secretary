const {app, BrowserWindow } = require('electron')

const path = require('path')
const {ipcMain} = require('electron');
const fs = require("fs")

exports.createWindow = function (target) {
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
        try{
            data = fs.readFileSync("./"+target.toString('base64'));
        }
        catch(e){
            data = {}
            fs.writeFileSync("./"+target.toString('base64'),data.toString())
        }

        event.sender.send("sendInitData",data)
    })

    return mainWindow
}

function getInitDate(target) {
    try{
        let rawData = fs.readFileSync('./Data.dat')
        let targetData = JSON.parse(rawData.toString()).target
        return targetData
    }
    catch(e) {
        return false
    }
}

function inputData(target,inputData) {
    try{
        // let rawData = fs.writeFileSync('./Data.dat')
        // let targetData = JSON.parse(rawData.toString()).target
        // return targetData
        return true
    }
    catch(e) {
        return false
    }
}