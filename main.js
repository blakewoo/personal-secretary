const {app, BrowserWindow } = require('electron')

const path = require('path')
const {ipcMain} = require('electron');
const mainFunction = require('./module/mainModule');
const loginFunction = require('./module/loginModule');
const signupFunction = require('./module/signupModule');
const findIdFunction = require('./module/findidModule');


app.whenReady().then(() => {
    let loginWindow = loginFunction.createLoginWindow()

    ipcMain.on('loginButtonEvent', (event,arg) => {
        if (arg.value === "login") {
            loginWindow.close()
            mainFunction.createWindow()
        }
        else if (arg.value === "signup") {
            loginWindow.close()
            signupFunction.createSignupWindow()
        }
        else if (arg.value === "findid") {
            loginWindow.close()
            findIdFunction.createFindAccount()
        }
        else {
            loginWindow.close()
        }
    })


})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

