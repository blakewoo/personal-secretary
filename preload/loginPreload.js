

window.addEventListener('DOMContentLoaded', () => {
    const {ipcRenderer} = require('electron')

    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    document.getElementById("login_button").addEventListener('click', closeClickEvent)
    document.getElementById("signup_button").addEventListener('click', closeClickEvent)
    document.getElementById("findpass_button").addEventListener('click', closeClickEvent)


    function closeClickEvent (event) {

        ipcRenderer.send('close',null);

    }
})
