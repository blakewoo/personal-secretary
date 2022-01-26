const {app, BrowserWindow } = require('electron')

const {ipcMain} = require('electron');
const mainFunction = require('./module/mainModule');
const loginFunction = require('./module/loginModule');
const signupFunction = require('./module/signupModule');
const findIdFunction = require('./module/findidModule');

app.whenReady().then(() => {
    let loginWindow = loginFunction.createLoginWindow()

    ipcMain.on('loginButtonEvent', (event,arg) => {
        if (arg.value === "login") {
            let id = arg.ID
            let pass = arg.PASSWORD

            if(IsLogin(id,pass)) {
                loginWindow.close()
                mainFunction.createWindow()
            }
            else {

            }
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

function IsLogin(id,pass) {
    console.log(id,pass)
    return true
}

