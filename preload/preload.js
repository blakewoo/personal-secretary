const {ipcRenderer} = require('electron')
window.addEventListener('DOMContentLoaded', () => {

    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    function closeClickEvent() {
        ipcRenderer.send('mainFrameButtonEvent',{value:"close"});
    }
    addCategoryButtonEvent()
    addCategoryEvent()
})

function addCategoryButtonEvent() {

    document.getElementById("add_category").addEventListener("click",function (event){
        let categoryContainer = document.getElementsByClassName("todo_category")[0]
        categoryContainer.innerHTML += "<input type=\"text\" class=\"category_label\" />"
    })

    document.getElementById("modify_category").addEventListener("click",function (event){

    })

    document.getElementById("delete_category").addEventListener("click",function (event){
        let categoryContainer = document.getElementsByClassName("todo_category")[0]
        
        categoryContainer.innerHTML += "<input type=\"text\" class=\"category_label\" />"
    })

}

function addCategoryEvent() {
    let category = document.getElementsByClassName("category_label")
    for (let i =0 ;i<category.length;i++) {
        category[i].removeEventListener("click",categoryClickEvent)
        category[i].addEventListener("click",categoryClickEvent)
    }

    function categoryClickEvent(event) {
        event.currentTarget
    }
}

