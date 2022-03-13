const {app, BrowserWindow } = require('electron')
const { dialog } = require('electron');  //새로 사용할 질문창
const {ipcMain} = require('electron');
const mainFunction = require('./module/mainModule');
const loginFunction = require('./module/loginModule');
const fs = require('fs');
const crypto = require('crypto');

app.whenReady().then(() => {
    let loginWindow = loginFunction.createLoginWindow()
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

        function saveData(type,title,message){
            dialog.showMessageBox(null,{type:type,title:title, message:message});
        }

        if (arg.value === "accept") {
            if (insertID(arg.id,arg.pass)) {
                loginWindow.close()
                loginWindow = loginFunction.createLoginWindow()
            }
            else {
                event.sender.send('singupDeclineButton',true);
            }

        }
        else if(arg.value === "passConfirm") {
            saveData("error","패스워드 오류","패스워드가 일치하지 않습니다")
        }
        else if(arg.value === "emailError") {
            saveData("error","이메일 오류","이메일이 형식에 맞지 않습니다")
        }
        else if (arg.value === "cancel") {
            loginWindow.close()
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