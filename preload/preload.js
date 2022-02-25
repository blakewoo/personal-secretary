const {ipcRenderer} = require('electron')
window.addEventListener('DOMContentLoaded', () => {

    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    function closeClickEvent() {
        ipcRenderer.send('mainFrameButtonEvent',{value:"close"});
    }
    addCategoryButtonEvent()
    addCategoryEvent()
    todoDetailEventBinder()
    addTodoDetailEvent()
})

function addTodoDetailEvent() {
    let add_todo = document.getElementById("input_todo_detail")

    add_todo.addEventListener("keyup",function (event) {
        if(event.key === "Enter") {
            let categoryContainer = document.getElementsByClassName("todo_detail_top")[0]
            categoryContainer.innerHTML += "<span class='unchecked_checkbox'></span><label class='category_detail'>"+add_todo.value+"</label>"
            todoDetailEventBinder()
        }
    })

}

function todoDetailEventBinder(){
    let todo_checkbox_uncheck = document.getElementsByClassName("unchecked_checkbox")
    let todo_checkbox_check = document.getElementsByClassName("checked_checkbox")
    for (let i =0;i<todo_checkbox_check.length;i++) {
        todo_checkbox_check[i].removeEventListener("click",todoCheckedDetailEvent)
        todo_checkbox_check[i].addEventListener("click",todoCheckedDetailEvent)
    }

    for (let i =0;i<todo_checkbox_uncheck.length;i++) {
        todo_checkbox_uncheck[i].removeEventListener("click",todoUncheckedDetailEvent)
        todo_checkbox_uncheck[i].addEventListener("click",todoUncheckedDetailEvent)
    }
}
function todoCheckedDetailEvent(event) {
    event.currentTarget.classList.add("check")
}

function todoUncheckedDetailEvent(event) {
    event.currentTarget.classList.remove("check")
}


function addCategoryButtonEvent() {

    document.getElementById("add_category").addEventListener("click",function (event){
        let categoryContainer = document.getElementsByClassName("todo_category")[0]
        categoryContainer.innerHTML += "<label class='category_label'>ss </label>"
        addCategoryEvent()
    })

    document.getElementById("modify_category").addEventListener("click",function (event){
        let category = document.getElementsByClassName("category_label")
        for (let i =0 ;i<category.length;i++) {
            if(category[i].classList.contains("selected_category")){

            }
        }
    })

    document.getElementById("delete_category").addEventListener("click",function (event){
        let category = document.getElementsByClassName("category_label")
        for (let i =0 ;i<category.length;i++) {
            if (category[i].classList.contains("selected_category")){
                category[i].remove()
            }
        }
    })

}

function addCategoryEvent() {
    let category = document.getElementsByClassName("category_label")
    for (let i =0 ;i<category.length;i++) {
        category[i].removeEventListener("click",categoryClickEvent)
        category[i].addEventListener("click",categoryClickEvent)
    }

    function categoryClickEvent(event) {
        let category = document.getElementsByClassName("category_label")
        for (let i =0 ;i<category.length;i++) {
            category[i].classList.remove("selected_category")
        }

        event.currentTarget.classList.add("selected_category")
    }
}

