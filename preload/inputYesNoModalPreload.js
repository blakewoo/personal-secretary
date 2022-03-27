const {ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send("inputYesNoModalInitRequest",{value:true})
    ipcRenderer.on('inputYesNoModalInit',(event, arg) => {
        document.getElementsByClassName("window_header")[0].innerHTML += "<label>"+arg.title+"</label>"


        let str = "<label>"+arg.explain+"</label>"
        +"<input class='input_border modalInput' type='text' placeholder="+arg.placeHolder+"/> <br>"
        +"<input class='public_button' type='button' value='Accept'/>"
        +"<input class='public_button' type='button' value='Decline'/>"


        document.getElementById("main_html_div").innerHTML = str
    })

    clovineButtonEvent()

})

function clovineButtonEvent() {
    document.getElementById("close_button").addEventListener("click",function (event) {
        ipcRenderer.send("inputYesNoModalClose",{value:true})
    })
}