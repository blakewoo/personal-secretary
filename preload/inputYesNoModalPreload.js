const {ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send("inputYesNoModalInitRequest",{value:true})
    ipcRenderer.on('inputYesNoModalInit',(event, arg) => {
        let str = "<label></label>"



        document.getElementById("main_html_div").innerHTML = str
    })

})