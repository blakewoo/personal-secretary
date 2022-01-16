

window.addEventListener('DOMContentLoaded', () => {
    const {ipcRenderer} = require('electron')
    ipcRenderer.send('close',null);
    let dd =  document.getElementById("close_button")
    console.log(dd)
    document.getElementById("close_button").addEventListener('click', closeClickEvent)

    function closeClickEvent (event) {



    }
})
