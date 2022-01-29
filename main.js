const {app, BrowserWindow } = require('electron')

const {ipcMain} = require('electron');
const mainFunction = require('./module/mainModule');
const loginFunction = require('./module/loginModule');
const signupFunction = require('./module/signupModule');
const findIdFunction = require('./module/findidModule');

app.whenReady().then(() => {
    let loginWindow = loginFunction.createLoginWindow()
    let signupWindow;

    ipcMain.on('loginButtonEvent', (event,arg) => {
        if (arg.value === "login") {
            let id = arg.ID
            let pass = arg.PASSWORD

            if(!isLogin(id,pass)) {
                loginWindow.close()
                mainFunction.createWindow()
            }
            else {
                event.sender.send('errorLogin',true);
            }
        }
        else if (arg.value === "signup") {
            loginWindow.close()
            signupWindow = signupFunction.createSignupWindow()
        }
        else if (arg.value === "findid") {
            loginWindow.close()
            findIdFunction.createFindAccount()
        }
        else {
            loginWindow.close()
        }
    })

    ipcMain.on('signupButtonEvent', (event,arg) => {
        if (arg.value === "accept") {
            if (insertID(arg.id,arg.pass)) {
                signupWindow.close()
                loginWindow = loginFunction.createLoginWindow()
            }
            else {
                event.sender.send('singupDeclineButton',true);
            }

        }
        else if (arg.value === "cancel") {
            signupWindow.close()
            loginWindow = loginFunction.createLoginWindow()
        }

    })

})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

function isLogin(id,pass) {
    console.log(id,pass)
    return true
}

function insertID(id,pass) {
    console.log(id,pass)
    return true
}
