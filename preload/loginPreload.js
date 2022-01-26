

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
        let id = document.getElementById("user_input").value;
        let pass = document.getElementById("password_input").value;

        ipcRenderer.send('loginButtonEvent',{value:"login",ID:id,PASSWORD:pass});
    }

    function signUpClickEvent(event) {
        ipcRenderer.send('loginButtonEvent',{value:"signup"});
    }

    function findClickEvent(event) {
        ipcRenderer.send('loginButtonEvent',{value:"findid"});
    }
})
