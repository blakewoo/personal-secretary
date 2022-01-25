const {ipcRenderer} = require('electron')
window.addEventListener('DOMContentLoaded', () => {

    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    function closeClickEvent() {
        ipcRenderer.send('mainFrameButtonEvent',{value:"close"});
    }
    addCategoryButtonEvent()
})

function addCategoryButtonEvent() {


    document.getElementById("add_category").addEventListener("click",function (event){
        alert("ddd")
    })

    document.getElementById("modify_category").addEventListener("click",function (event){
        alert("ddd")
    })

    document.getElementById("delete_category").addEventListener("click",function (event){
        alert("ddd")
    })
}

