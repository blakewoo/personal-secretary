const {app, BrowserWindow } = require('electron')
const path = require('path')

function createLoginWindow() {
    // Create the browser login window.
    const mainWindow = new BrowserWindow({
        width: 300,
        height: 400,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'loginPreload.js')
        },
        title:"Login to timeout"
    })
    mainWindow.setResizable(false);
    mainWindow.loadFile('login.html')
}

function createSignupWindow() {
    // Create the browser Signup window.
    const mainWindow = new BrowserWindow({
        width: 300,
        height: 400,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'signupPreload.js')
        },
        title:"Sign up"
    })
    mainWindow.setResizable(false);
    mainWindow.loadFile('signup.html')
}

function createFindAccount() {
    // Create the browser find account window.
    const mainWindow = new BrowserWindow({
        width: 300,
        height: 400,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'find_accountPreload.js')
        },
        title:"Find your account"
    })
    mainWindow.setResizable(false);
    mainWindow.loadFile('find_account.html')
}


function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
    createSignupWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

