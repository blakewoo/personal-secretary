const {ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send("inputYesNoModalInitRequest",{value:true})
    ipcRenderer.on('inputYesNoModalInit',(event, arg) => {
        document.getElementsByClassName("window_header")[0].innerHTML = " <span class=\"spring_span\"></span> <label>"+arg.title+"</label>"

        let str = "<label>"+arg.explain+"</label>"
        +"<input class='input_border modalInput' id='inputTextbox' type='text' placeholder="+arg.placeHolder+"/> <br>"
        +"<input class='public_button' id='yesButton' type='button' value='Accept'/>"
        +"<input class='public_button' id='noButton' type='button' value='Decline'/>"


        document.getElementById("main_html_div").innerHTML = str
        closeButtonEvent()
        yesNoInputButtonEvent()
    })
})

function closeButtonEvent() {
    document.getElementById("close_button").addEventListener("click",function (event) {
        ipcRenderer.send("inputYesNoModalClose",{value:true})
    })
}
function yesNoInputButtonEvent() {
    let textValue = document.getElementById("inputTextbox").value
    document.getElementById("yesButton").addEventListener("click",function (event){
        ipcRenderer.send("inputYesNoModalRequestResponse",{result:true, value:textValue})
    })
    document.getElementById("noButton").addEventListener("click",function (event){
        ipcRenderer.send("inputYesNoModalRequestResponse",{result:false})
    })
    document.getElementById("inputTextbox").addEventListener("keyup",function (event){
        if (event.keyCode === 13) {
            document.getElementById("yesButton").click()
        }
    })
}