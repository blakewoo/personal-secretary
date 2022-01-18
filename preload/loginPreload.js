

window.addEventListener('DOMContentLoaded', () => {
    const {ipcRenderer} = require('electron')

    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    document.getElementById("login_button").addEventListener('click', loginClickEvent)
    document.getElementById("signup_button").addEventListener('click', signUpClickEvent)
    document.getElementById("findpass_button").addEventListener('click', findClickEvent)


    function closeClickEvent (event) {

        ipcRenderer.send('buttonEvent',{value:"close"});

    }

    function loginClickEvent(event) {
        ipcRenderer.send('buttonEvent',{value:"login"});
    }

    function signUpClickEvent(event) {
        ipcRenderer.send('buttonEvent',{value:"signup"});
    }

    function findClickEvent(event) {
        ipcRenderer.send('buttonEvent',{value:"findid"});
    }
})
