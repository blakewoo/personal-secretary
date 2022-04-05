const {ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    let type = "input"

    ipcRenderer.send("inputYesNoModalInitRequest",{value:true})
    ipcRenderer.on('inputYesNoModalInit',(event, arg) => {
        document.getElementsByClassName("window_header")[0].innerHTML = " <span class=\"spring_span\"></span> <label>"+arg.title+"</label>"

        let str = "<label>"+arg.explain+"</label>"
        +"<input class='input_border modalInput' id='inputTextbox' type='text' placeholder="+arg.placeHolder+"/> <br>"
        +"<input class='public_button' id='yesButton' type='button' value='Accept'/>"
        +"<input class='public_button' id='noButton' type='button' value='Decline'/>"


        document.getElementById("main_html_div").innerHTML = str


        document.getElementById("close_button").removeEventListener("click",closeButtonEvent)
        document.getElementById("close_button").addEventListener("click",closeButtonEvent)

        document.getElementById("yesButton").removeEventListener("click",yesButtonEvent)
        document.getElementById("yesButton").addEventListener("click",yesButtonEvent)

        document.getElementById("noButton").removeEventListener("click",noButtonEvent)
        document.getElementById("noButton").addEventListener("click",noButtonEvent)

        document.getElementById("inputTextbox").removeEventListener("keyup",inputButtonEvent)
        document.getElementById("inputTextbox").addEventListener("keyup",inputButtonEvent)
    })


    function closeButtonEvent(event) {
        ipcRenderer.send("inputYesNoModalClose",{value:true})
    }
    function yesButtonEvent(event) {
        let textValue = document.getElementById("inputTextbox").value
        ipcRenderer.send("inputYesNoModalRequestResponse",{result:true, value:textValue})
    }

    function noButtonEvent(event) {
        ipcRenderer.send("inputYesNoModalRequestResponse",{result:false})
    }

    function inputButtonEvent(event) {
        if (event.keyCode === 13) {
            document.getElementById("yesButton").click()
        }
    }
})

