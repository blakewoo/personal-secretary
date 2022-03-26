const {ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded', () => {

    ipcRenderer.send("yesNoModalInitRequest",{value:true})
    ipcRenderer.on('YesNoModalInit',(event, arg) => {

        let str = "<label>라라라라라</label>" +
            "<input type='button' value='Yes'>" +
            "<input type='button' value='No'>"

        document.getElementById("main_html_div").innerHTML = str
    })

    clovineButtonEvent()

})

function clovineButtonEvent() {
    document.getElementById("close_button").addEventListener("click",function (event) {
        ipcRenderer.send("yesNoModalClose",{value:true})
    })
}