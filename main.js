const {app, BrowserWindow } = require('electron')
const path = require('path')


const win = new BrowserWindow({
    webPreferences: {
        preload: path.join(__dirname, 'payload.js')
    },
    width: 800,
    height: 1500,
    autoHideMenuBar: true
})

win.loadURL('https://github.com')

const contents = win.webContents
console.log(contents)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
