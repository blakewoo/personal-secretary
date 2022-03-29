const {ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded', () => {

    ipcRenderer.send("yesNoModalInitRequest",{value:true})
    ipcRenderer.on('yesNoModalInit',(event, arg) => {
        document.getElementsByClassName("window_header")[0].innerHTML = " <span class=\"spring_span\"></span> <label>"+arg.title+"</label>"

        let str = "<label class='modal_label'>"+arg.explain+"</label>"
            +"<input class='public_button' type='button' value='Accept'/>"
            +"<input class='public_button' type='button' value='Decline'/>"

        document.getElementById("main_html_div").innerHTML = str
    })

    clovineButtonEvent()

})

function clovineButtonEvent() {
    document.getElementById("close_button").addEventListener("click",function (event) {
        ipcRenderer.send("yesNoModalClose",{value:true})
    })
}