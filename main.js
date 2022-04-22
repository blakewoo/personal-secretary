const {app, BrowserWindow } = require('electron')
const { dialog } = require('electron');  //새로 사용할 질문창
const {ipcMain} = require('electron');
const electron = require('electron')
const mainFunction = require('./module/mainModule');
const loginFunction = require('./module/loginModule');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path')
let inputYesNoModalWindow
let yesNoModalWindow
let mainData = new Map();

app.whenReady().then(() => {
    let loginWindow = loginFunction.createLoginWindow()

    let mainWindow;

    let inputYesNoModalTitle = ""
    let inputYesNoModalExplain = ""
    let inputYesNoModalPlaceHolder = ""
    let inputYesNoModalType = "add"

    let YesNoModalTitle = ""
    let YesNoModalExplain = ""

    yesNoModalWindow = initYesNoModal()
    inputYesNoModalWindow = initInputYesNoModal()

    ipcMain.on('findIdButtonEvent', (event,arg) => {

        if(findId(arg.email)) {
            event.sender.send('findIdResultButton',true);
        }
        else{
            event.sender.send('findIdResultButton',false);
        }
    })

    // 로그인 버튼
    ipcMain.on('loginButtonEvent', (event,arg) => {
        if (arg.value === "login") {
            let id = arg.ID
            let pass = arg.PASSWORD

            if(isLogin(id,pass)) {
                loginWindow.close()
                mainWindow = mainFunction.createWindow(pass)
                mainWindow.on("close", function (event) {
                    inputYesNoModalWindow.close()
                    yesNoModalWindow.close()
                })
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

    // 회원가입 버튼
    ipcMain.on('signupButtonEvent', (event,arg) => {

        function saveData(type,title,message){
            dialog.showMessageBox(null,{type:type,title:title, message:message});
        }

        if (arg.value === "accept") {
            if (insertID(arg.id,arg.pass)) {
                loginWindow.loadFile('html/login.html')
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
            loginWindow.loadFile('html/login.html')
        }

    })

    ipcMain.on('mainPageInitData', (event,arg) => {
        let data=new Map();
        let indexFile;
        // const toAscii = (string) => string.split('').map(char=>char.charCodeAt(0)).join("")
        try{
            indexFile = Array(fs.readFileSync("./index"));

            try {
                for(let i =0;i<indexFile.length;i++) {

                    data = fs.readFileSync("./"+indexFile[i]);
                }
            }
            catch(e) {
                data = {}
                fs.writeFileSync("./"+indexFile[0]);
            }

        }
        catch(e){
            indexFile = []
            fs.writeFileSync("./index",data.toString())
        }
        data = ""
        event.sender.send("sendInitData",data)
    })

    // YES NO 모달
    ipcMain.on('yesNoModal',(event,args) =>{
        yesNoModalFunction (args.title,args.explain)
    })

    // YES NO 모달 닫기
    ipcMain.on('yesNoModalClose',(event,args) =>{
        yesNoModalWindow.hide()
    })

    // YES NO 답신
    ipcMain.on('YesNoModalRequestResponse',function (event,args) {
        if (args.result) {
            mainWindow.webContents.send('yesNoModalRequestDelete', {Text:args.value})
            yesNoModalWindow.hide()
        }
        else{
            yesNoModalWindow.hide()
        }
    })

    // YES NO 모달 초기화
    ipcMain.on('yesNoModalInitRequest',function (event) {
        event.sender.send('yesNoModalInit',{title:YesNoModalTitle,explain:YesNoModalExplain});
    })

    // INPUT YES NO 모달
    ipcMain.on('inputYesNoModal',(event,args) =>{
        inputYesNoModalFunction(args.title,args.explain,args.placeHolder,args.type)
    })

    // INPUT YES NO 모달 답신
    ipcMain.on('inputYesNoModalRequestResponse',function (event,args) {
        if (args.result === true) {
            if (inputYesNoModalType ==="add") {
                mainWindow.webContents.send('inputYesNoModalResYes', {Text:args.value})
            }
            else{
                mainWindow.webContents.send('inputYesNoModalResModifyYes', {Text:args.value})
            }
            inputYesNoModalWindow.hide()
        }
        else{
            inputYesNoModalWindow.hide()
        }
    })

    ipcMain.on('inputYesNoModalClose',function (event,args) {
        inputYesNoModalWindow.hide()
    })

    ipcMain.on('inputYesNoModalInitRequest',function (event) {
        event.sender.send('inputYesNoModalInit',{title:inputYesNoModalTitle,explain:inputYesNoModalExplain,placeHolder:inputYesNoModalPlaceHolder});
    })

    // 카테고리 추가시
    ipcMain.on('createCategory',function (event,args) {
        try{
            mainData.set(args.category,new Set())
            // 하드 변경
            fs.writeFileSync(args.category,"")
        }
        catch(e) {

        }
    })

    // 카테고리 변경시
    ipcMain.on('updateCategory',function (event,args) {
        // 메모리 변경
        try{
            let targetCategory = mainData.get(args.prevCategory)
            mainData.set(args.nextCategory,targetCategory)
            mainData.delete(args.prevCategory)

            // 하드에서 변경
            let prev = fs.readFileSync(args.prevCategory)
            fs.writeFileSync(args.nextCategory,prev)
        }
        catch(e) {

        }
    })
    // 카테고리 삭제시
    ipcMain.on('deleteCategory',function (event,args) {
        // 메모리 변경
        mainData.delete(args.category)

        //하드에서 변경
        fs.unlink(args.category,function (error){
            if(error)
                console.log(error)
        })

    })

    // Todo 추가시
    ipcMain.on('createTodo',function (event,args) {

        try{
            // 메모리 변경
            let target = mainData.get(args.category)
            if(target) {
                target.add(args.todo)
            }
            else{
                mainData.set(args.category,new Set([args.todo]));
            }
            // 하드 변경
            fs.writeFileSync(args.category,target.toString())

        }
        catch(e) {
            console.log("write error")
        }
    })

    // Todo 변경시
    ipcMain.on('updateTodo',function (event,args) {

        try{
            // 메모리 변경
            let target = mainData.get(args.category)
            target.delete(args.prevTodo)
            target.add(args.afterTodo)

            // 하드 변경
            fs.writeFileSync(args.category,target.toString())
        }
        catch(e){

        }
    })

    // Todo 삭제시
    ipcMain.on('deleteTodo',function (event,args) {
        try{
            // 메모리 변경
            let target = mainData.get(args.category)
            target.delete(args.Todo)

            //하드에서 변경
            fs.unlink(args.category,function (error){
                if(error)
                    console.log(error)
            })
        }
        catch(e) {

        }
    })


    function initYesNoModal() {
        return new BrowserWindow({
            show:false,
            resizable:false,
            minimizable:false,
            maximizable:false,
            fullscreenable:false,
            frame:false,
            width: 300,
            height: 110,
            autoHideMenuBar: true,
            modal:true,
            webPreferences: {
                nodeIntegration: true, contextIsolation: false,
                preload: path.join(__dirname, './preload/yesNoModalPreload.js')
            }
        })
    }

    function initInputYesNoModal() {
        return new BrowserWindow({
            show:false,
            resizable:false,
            minimizable:false,
            maximizable:false,
            fullscreenable:false,
            frame:false,
            width: 300,
            height: 130,
            autoHideMenuBar: true,
            // parent:parentWindow,
            modal:true,
            webPreferences: {
                nodeIntegration: true, contextIsolation: false,
                preload: path.join(__dirname, './preload/inputYesNoModalPreload.js')
            }
        })
    }


    function yesNoModalFunction (title,explain) {
        YesNoModalTitle = title
        YesNoModalExplain = explain

        yesNoModalWindow.loadFile('html/yesNoModal.html')
        yesNoModalWindow.show()
    }

    function inputYesNoModalFunction(title,explain,placeHolder,type) {
        inputYesNoModalTitle = title
        inputYesNoModalExplain = explain
        inputYesNoModalPlaceHolder = placeHolder
        inputYesNoModalType = type

        inputYesNoModalWindow.loadFile('html/inputYesNoModal.html')
        inputYesNoModalWindow.show()
    }

})
app.disableHardwareAcceleration()
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})


function isLogin(id,pass) {
    let data = {}
    try{
        data = fs.readFileSync('./loginData.dat')
        return data.toString() === createHashedPassword(id + pass).toString();
    }
    catch(e) {
        return false
    }
}

function insertID(id,pass) {
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

function findId(email) {
    return true
}