const {app, BrowserWindow } = require('electron')
const { dialog } = require('electron');  //새로 사용할 질문창
const {ipcMain} = require('electron');
const electron = require('electron')
const mainFunction = require('./module/mainModule');
const loginFunction = require('./module/loginModule');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path')
const filePath = app.getPath('userData')
let inputYesNoModalWindow
let yesNoModalWindow
const base64url = require('base64url');
let mainData = new Map();
let checkTodoMap = new Map();
let id
let pass
let userIndex
let indexFile
let timeLine
let proWorkerGrade = false

const makeFolder =(dir_path)=>{
    if(!fs.existsSync(dir_path)) {
        fs.mkdirSync(dir_path)
    }
}

console.log(app.getPath('userData'))

app.whenReady().then(() => {
    makeFolder(filePath)

    let loginWindow = loginFunction.createLoginWindow()

    let mainWindow;

    let inputYesNoModalTitle = ""
    let inputYesNoModalExplain = ""
    let inputYesNoModalPlaceHolder = ""
    let inputYesNoModalType = "add"

    let YesNoModalTitle = ""
    let YesNoModalExplain = ""
    let YesNoModalType = ""


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
            id = arg.ID
            pass = arg.PASSWORD

            if(isLogin(id,pass)) {
                loginWindow.close()
                mainWindow = mainFunction.createWindow(pass)
                yesNoModalWindow = initYesNoModal()
                inputYesNoModalWindow = initInputYesNoModal()
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
        let data={}
        let checkedData = {}
        let indexTempFile = []
        let timeLineTemp = []
        let tempCheckedDataSet = new Set()
        indexFile = [];
        userIndex = createHashedPassword(id+pass)
        timeLine= []

        try{
            timeLineTemp = fs.readFileSync(filePath + base64url(userIndex) + "_timeline").toString().split("\n")
            if(timeLineTemp[0] !== "") {
                for(let i=0;i<timeLineTemp.length-1;i++) {
                    timeLine.push(decryptionFiles(base64url.decode(timeLineTemp[i]), pass))
                }
            }
        }
        catch(e) {
            console.log(e)
            fs.writeFileSync(filePath+base64url(userIndex)+"_timeline","")
        }

        try {
            //index file
            indexFile = fs.readFileSync(filePath + base64url(userIndex) + "_index").toString().split(",");
            if(indexFile[0] !== "") {
                //  index file to index
                for (let i = 0; i < indexFile.length; i++) {
                    indexTempFile.push(decryptionFiles(base64url.decode(indexFile[i]), pass).split(",")[1])
                }
                try {
                    // 인덱스 파일 하나씩 순회
                    for (let i = 0; i < indexTempFile.length; i++) {
                        data = fs.readFileSync(filePath + indexFile[i]).toString().split(",");
                        // 카테고리 파일이 있고, 안에 빈 내용이 아닐 경우
                        if (data.length !== 0) {
                            // 각 카데고리 내의 Todo내용들
                            let tempDataSet = new Set()
                            for(let i=0;i<data.length ;i++) {
                                if (data[0] !== "") {
                                    tempDataSet.add(decryptionFiles(base64url.decode(data[i]), pass))
                                }
                            }
                            try{
                                tempCheckedDataSet = new Map()
                                checkedData = fs.readFileSync(filePath + indexFile[i]+"_checked").toString().split(",");

                                for(let i=0;i<checkedData.length ;i++) {
                                    if (checkedData[0] !== "") {
                                        let checkTemp = decryptionFiles(base64url.decode(checkedData[i]), pass).split(",")
                                        tempCheckedDataSet.set(checkTemp[0],checkTemp[1])
                                    }
                                }
                            }
                            catch(e) {

                            }
                            checkTodoMap.set(indexTempFile[i], tempCheckedDataSet)
                            mainData.set(indexTempFile[i], tempDataSet)
                        }
                        else {
                            checkTodoMap.set(indexTempFile[i], null)
                            mainData.set(indexTempFile[i], null)
                        }
                    }
                }
                catch (e) {
                    console.log(e)
                }
            }
        }
        catch(e){
            console.log(e)
            fs.writeFileSync(filePath+base64url(userIndex)+"_index","")
            indexFile = new Set()
        }
        indexFile= new Set(indexFile)
        event.sender.send("sendInitData",{all:mainData,checked:checkTodoMap,timeLine:timeLine,proWorkerGrade:proWorkerGrade})
    })

    // YES NO 모달
    ipcMain.on('yesNoModal',(event,args) =>{
        yesNoModalFunction (args.title,args.explain,args.type)
    })

    // YES NO 모달 닫기
    ipcMain.on('yesNoModalClose',(event,args) =>{
        yesNoModalWindow.hide()
    })

    // YES NO 답신
    ipcMain.on('YesNoModalRequestResponse',function (event,args) {
        if (args.result) {
            if(args.type === "category") {
                mainWindow.webContents.send('yesNoModalRequestDelete', {Text:args.value})
                yesNoModalWindow.hide()
            }
            else {
                mainWindow.webContents.send('yesNoModalResDeleteYes', {Text:args.value})
                yesNoModalWindow.hide()
            }
        }
        else{
            yesNoModalWindow.hide()
        }
    })

    // YES NO 모달 초기화
    ipcMain.on('yesNoModalInitRequest',function (event) {
        event.sender.send('yesNoModalInit',{title:YesNoModalTitle,explain:YesNoModalExplain,type:YesNoModalType});
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
            else {
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
            // 메모리에서 변경
            mainData.set(args.category,new Set())
            indexFile.add(base64url(encrytionFiles(id+","+args.category,pass)))

            // 하드 변경
            fs.writeFileSync(filePath+base64url(userIndex)+"_index",(Array.from(indexFile)).toString())
            fs.writeFileSync(filePath+base64url(encrytionFiles(id+","+args.category,pass)),"");
        }
        catch(e) {
            console.log(e)
        }
    })

    // 카테고리 변경시
    ipcMain.on('updateCategory',function (event,args) {
        // 메모리 변경
        try{
            let targetCategory = mainData.get(args.prevCategory)
            mainData.set(args.nextCategory,targetCategory)
            mainData.delete(args.prevCategory)
            indexFile.delete(base64url(encrytionFiles(id+","+args.prevCategory,pass)))
            indexFile.add(base64url(encrytionFiles(id+","+args.nextCategory,pass)))

            // 하드에서 변경
            fs.writeFileSync(filePath+base64url(userIndex)+"_index",Array.from(indexFile).toString())
            let prev = fs.readFileSync(filePath+base64url(encrytionFiles(id+","+args.prevCategory,pass)))
            fs.writeFileSync(filePath+base64url(encrytionFiles(id+","+args.nextCategory,pass)),prev)
            fs.unlink(filePath+base64url(encrytionFiles(id+","+args.prevCategory,pass)),function (error){
                if(error) {
                    console.log(error)
                }
            })

        }
        catch(e) {
            console.log(e)
        }
    })
    // 카테고리 삭제시
    ipcMain.on('deleteCategory',function (event,args) {
        // 메모리 변경
        mainData.delete(args.category)
        indexFile.delete(base64url(encrytionFiles(id+","+args.prevCategory,pass)))

        //하드에서 변경
        fs.unlink(filePath+base64url(encrytionFiles(id+","+args.category,pass)),function (error){
            if(error) {
                console.log(error)
            }
            fs.writeFileSync(filePath+base64url(userIndex)+"_index",Array.from(indexFile).toString())
        })

    })

    // Todo 추가시
    ipcMain.on('createTodo',function (event,args) {

        try{
            let tempStr = []
            args.todo.forEach((value,key,set) => {
                tempStr.push(base64url(encrytionFiles(value,pass)))
            })

            let tempTimeline = ""
            args.timeLine.forEach((value,key,set) => {
                tempTimeline += base64url(encrytionFiles(value,pass)) + "\n"
            })


            // 하드 변경
            fs.writeFileSync(filePath+base64url(encrytionFiles(id+","+args.category,pass)),tempStr.toString())
            fs.writeFileSync(filePath+base64url(userIndex)+"_timeline",tempTimeline)
        }
        catch(e) {
            console.log(e)
        }
    })

    // Todo 변경시
    ipcMain.on('updateTodo',function (event,args) {
        try{
            // 메모리 변경
            let tempStr = []
            args.todo.forEach((value,key,set) => {
                tempStr.push(base64url(encrytionFiles(value,pass)))
            })

            let tempTimeline = ""
            args.timeLine.forEach((value,key,set) => {
                tempTimeline += base64url(encrytionFiles(value,pass)) +"\n"
            })

            // 하드 변경
            fs.writeFileSync(filePath+base64url(encrytionFiles(id+","+args.category,pass)),tempStr.toString())
            fs.writeFileSync(filePath+base64url(userIndex)+"_timeline",tempTimeline)
        }
        catch(e){
            console.log(e)
        }
    })

    // Todo 삭제시
    ipcMain.on('deleteTodo',function (event,args) {
        try{
            // 메모리 변경
            let tempStr = []
            args.todo.forEach((value,key,set) => {
                tempStr.push(base64url(encrytionFiles(value,pass)))
            })

            let tempTimeline = ""
            args.timeLine.forEach((value,key,set) => {
                tempTimeline += base64url(encrytionFiles(value,pass)) +"\n"
            })

            // 하드 변경
            fs.writeFileSync(filePath+base64url(encrytionFiles(id+","+args.category,pass)),tempStr.toString())
            fs.writeFileSync(filePath+base64url(userIndex)+"_timeline",tempTimeline)
        }
        catch(e) {
            console.log(e)
        }
    })
    

    ipcMain.on("checkTodo",function (event,args) {
        try{
            // 메모리
            let tempMap = checkTodoMap.get(args.category)
            if (tempMap) {
                if(tempMap.has(args.todoID)) {
                    tempMap.delete(args.todoID)
                }
                else {
                    tempMap.set(args.todoID,args.currentTime)
                }
            }
            else {
                tempMap = new Map()
                tempMap.set(args.todoID,args.currentTime)
                checkTodoMap.set(args.category,tempMap)
            }
            let tempStr = []
            tempMap.forEach((value,key,set) => {
                tempStr.push(base64url(encrytionFiles((key+","+value),pass)))
            })

            //파일
            fs.writeFileSync(filePath+base64url(encrytionFiles(id+","+args.category,pass))+"_checked",tempStr.toString())
        }
        catch(e){
            // 에러
            console.log(e)
        }
    })


    function initYesNoModal() {
        return new BrowserWindow({
            parent:mainWindow,
            modal:true,
            show:false,
            resizable:false,
            minimizable:false,
            maximizable:false,
            fullscreenable:false,
            frame:false,
            width: 300,
            height: 110,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true, contextIsolation: false,
                preload: path.join(__dirname, './preload/yesNoModalPreload.js')
            }
        })
    }

    function initInputYesNoModal() {
        return new BrowserWindow({
            parent:mainWindow,
            modal:true,
            show:false,
            resizable:false,
            minimizable:false,
            maximizable:false,
            fullscreenable:false,
            frame:false,
            width: 300,
            height: 130,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true, contextIsolation: false,
                preload: path.join(__dirname, './preload/inputYesNoModalPreload.js')
            }
        })
    }


    function yesNoModalFunction (title,explain,type) {
        YesNoModalTitle = title
        YesNoModalExplain = explain
        YesNoModalType = type

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
    let data;
    try{
        data = fs.readFileSync(filePath+'/loginData.dat').toString().split("\n")
        for(let i=0;i<data.length;i++) {
            if(data[i].toString() === createHashedPassword(id +","+ pass).toString()) {
                return true
            }
        }

        return false
    }
    catch(e) {
        console.log(e)
        return false
    }
}

function insertID(id,pass) {
    let data = createHashedPassword(id+","+pass)
    try{
        let legacyAccount = fs.readFileSync(filePath+'/loginData.dat');
        legacyAccount += "\n"+data.toString()
        fs.writeFileSync(filePath+'/loginData.dat',legacyAccount)
        return true
    }
    catch(e) {
        fs.writeFileSync(filePath+'/loginData.dat',data.toString())
        return true
    }
}

const createHashedPassword = (password) => {
    return crypto.createHash("sha512").update(password).digest("base64");
};

function findId(email) {
    return true
}

function encrytionFiles(input, key) {
    const encKey =crypto.scryptSync(key,"salt",32)
    const iv = Buffer.alloc(16,0)
    const cipher = crypto.createCipheriv('aes-256-cbc', encKey,iv);
    let result = cipher.update(input, 'utf8', 'base64');
    result += cipher.final('base64');
    return result
}

function decryptionFiles(input, key) {
    const decKey =crypto.scryptSync(key,"salt",32)
    const iv = Buffer.alloc(16,0)
    const decipher = crypto.createDecipheriv('aes-256-cbc', decKey,iv);
    let result2 = decipher.update(input, 'base64', 'utf8');
    result2 += decipher.final('utf8');
    return result2
}