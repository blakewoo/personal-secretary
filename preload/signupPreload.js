

window.addEventListener('DOMContentLoaded', () => {
    const {ipcRenderer} = require('electron')

    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    document.getElementById("accept_button").addEventListener('click', acceptClickEvent)
    document.getElementById("cancel_button").addEventListener('click', cancelClickEvent)


    function closeClickEvent (event) {

        ipcRenderer.send('signupFrameButtonEvent',{value:"close"});
    }

    function acceptClickEvent(event) {
        ipcRenderer.send('signupButtonEvent',{value:"accept"});
        ipcRenderer.on('singupDeclineButton',(event, arg) => {

        })
    }

    function cancelClickEvent(event) {
        ipcRenderer.send('signupButtonEvent',{value:"cancel"});
    }

})
