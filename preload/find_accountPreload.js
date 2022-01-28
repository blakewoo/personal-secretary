window.addEventListener('DOMContentLoaded', () => {
    const {ipcRenderer} = require('electron')

    document.getElementById("close_button").addEventListener('click', closeClickEvent)


    function closeClickEvent (event) {

        ipcRenderer.send('findFrameButtonEvent',{value:"close"});

    }

})