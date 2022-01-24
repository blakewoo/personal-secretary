const {app, BrowserWindow } = require('electron')

const path = require('path')
const {ipcMain} = require('electron');
const mainFunction = require('./module/mainModule');
const loginFunction = require('./module/loginModule');
const signupFunction = require('./module/signupModule');
const findIdFunction = require('./module/findidModule');


app.whenReady().then(() => {
    let loginWindow = loginFunction.createLoginWindow()

})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

