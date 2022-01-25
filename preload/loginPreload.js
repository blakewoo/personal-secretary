

window.addEventListener('DOMContentLoaded', () => {
    const {ipcRenderer} = require('electron')

    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    document.getElementById("login_button").addEventListener('click', loginClickEvent)
    document.getElementById("signup_button").addEventListener('click', signUpClickEvent)
    document.getElementById("findpass_button").addEventListener('click', findClickEvent)


    function closeClickEvent (event) {

        ipcRenderer.send('loginFrameButtonEvent',{value:"close"});

    }

    function loginClickEvent(event) {
        ipcRenderer.send('loginButtonEvent',{value:"login"});
    }

    function signUpClickEvent(event) {
        ipcRenderer.send('loginButtonEvent',{value:"signup"});
    }

    function findClickEvent(event) {
        ipcRenderer.send('loginButtonEvent',{value:"findid"});
    }
})
