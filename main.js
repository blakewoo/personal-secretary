const {app, BrowserWindow } = require('electron')

const {ipcMain} = require('electron');
const mainFunction = require('./module/mainModule');
const loginFunction = require('./module/loginModule');
const fs = require('fs');
const crypto = require('crypto');

app.whenReady().then(() => {
    let loginWindow = loginFunction.createLoginWindow()
    let signupWindow;
    let mainWindow;


    ipcMain.on('findIdButtonEvent', (event,arg) => {

        if(findId(arg.email)) {
            event.sender.send('findIdResultButton',true);
        }
        else{
            event.sender.send('findIdResultButton',false);
        }
    })



    ipcMain.on('loginButtonEvent', (event,arg) => {
        if (arg.value === "login") {
            let id = arg.ID
            let pass = arg.PASSWORD

            if(isLogin(id,pass)) {
                loginWindow.close()
                mainWindow = mainFunction.createWindow()
            }
            else {
                event.sender.send('errorLogin',true);
            }
        }
        else if (arg.value === "signup") {
            loginWindow.loadFile('html/signup.html')
        }
        else if (arg.value === "findid") {
            loginWindow.loadFile('html/find_account.html')
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

    ipcMain.on('mainPageButtonEvent', (event,arg) => {


    })

})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

function isLogin(id,pass) {
    console.log(id,pass)
    let data = {}
    try{
        data = fs.readFileSync('./loginData.dat')
        return data === createHashedPassword(id + pass);

    }
    catch(e) {
        return false
    }
}

function insertID(id,pass) {
    console.log(id,pass)
    let data = ""
    try{
        data = createHashedPassword(id+pass)
        fs.writeFileSync('./loginData.dat',data.toString())
        return true
    }
    catch(e) {
        return false
    }
}

const createHashedPassword = (password) => {
    return crypto.createHash("sha512").update(password).digest("base64");
};

const createSalt = async () => {
    const buf = await crypto.randomBytes(64);

    return buf.toString("base64");
};

function findId(email) {


}