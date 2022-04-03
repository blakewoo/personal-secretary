const {ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded', () => {

    ipcRenderer.send("yesNoModalInitRequest",{value:true})
    ipcRenderer.on('yesNoModalInit',(event, arg) => {
        document.getElementsByClassName("window_header")[0].innerHTML = " <span class=\"spring_span\"></span> <label>"+arg.title+"</label>"

        let str = "<label class='modal_label'>"+arg.explain+"</label>"
            +"<input class='public_button' id='yesButton' type='button' value='Accept'/>"
            +"<input class='public_button' id='noButton' type='button' value='Decline'/>"

        document.getElementById("main_html_div").innerHTML = str
        closeButtonEvent()
        yesNoButtonEvent()
    })
})

function closeButtonEvent() {
    document.getElementById("close_button").addEventListener("click",function (event) {
        ipcRenderer.send("yesNoModalClose",{value:true})
    })
}

function yesNoButtonEvent() {
    document.getElementById("yesButton").addEventListener("click",function (event){
        ipcRenderer.send("YesNoModalRequestResponse",{result:true})
    })
    document.getElementById("noButton").addEventListener("click",function (event){
        ipcRenderer.send("YesNoModalRequestResponse",{result:false})
    })
}