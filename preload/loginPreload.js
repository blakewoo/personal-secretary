

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
        ipcRenderer.on('errorLogin',(event, arg) => {
            document.getElementById("wrong_account").style.display="block"
        })
    }

    function signUpClickEvent(event) {
        ipcRenderer.send('loginButtonEvent',{value:"signup"});
    }

    function findClickEvent(event) {
        ipcRenderer.send('loginButtonEvent',{value:"findid"});
    }


    // signup page
    // document.getElementById("close_button").addEventListener('click', closeClickEvent)
    // document.getElementById("accept_button").addEventListener('click', acceptClickEvent)
    // document.getElementById("cancel_button").addEventListener('click', cancelClickEvent)
    //
    //
    // function closeClickEvent (event) {
    //
    //     ipcRenderer.send('signupFrameButtonEvent',{value:"close"});
    // }
    //
    // function acceptClickEvent(event) {
    //     ipcRenderer.send('signupButtonEvent',{value:"accept"});
    //     ipcRenderer.on('singupDeclineButton',(event, arg) => {
    //
    //     })
    // }
    //
    // function cancelClickEvent(event) {
    //     ipcRenderer.send('signupButtonEvent',{value:"cancel"});
    // }

})
