const {ipcRenderer} = require('electron')
window.addEventListener('DOMContentLoaded', () => {

    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    function closeClickEvent() {
        ipcRenderer.send('mainFrameButtonEvent',{value:"close"});
    }
    // init data
    initTodoCategory()
    initTodoDetail(0)

    // init event binder
    addCategoryButtonEvent()
    addCategoryEvent(0)
    todoDetailEventBinder()
    addTodoDetailEvent()
})

function initTodoCategory() {
    let categoryContainer = document.getElementsByClassName("todo_category")[0]

    //example data
    let data = [{index:0,value:"ABA"},{index:1,value:"BABA"}]
    let str = ""

    for (let i =0;i<data.length;i++) {
        str += "<label class='category_label' categoryIndex="+data[i].index+">"+data[i].value+"</label>"
    }

    categoryContainer.innerHTML = str
    addCategoryEvent()
}
function initTodoDetail(categoryIndex){
    let todoDetailContainer = document.getElementsByClassName("todo_detail_top")[0]
    let rawData = new Map(  [
        [0, [1,2,3]],
        [1, [2,3,4]],
        [2, [3,4,5]],
        [3, [4,5,6]],
        [4, [5,6,7]]
    ])
    let data = rawData.get(categoryIndex)
    let str = ""

    for (let i =0;i<data.length;i++) {
        str += "<div class='todo_detail_row'>" +"<label class=\"checkbox\">\n" +
            "   <input type=\"checkbox\">\n" +
            "   <span class=\"checkbox_icon\"></span>\n" +
            "   <span class=\"checkbox_text category_detail\">"+data[i]+"</span>"+
            "</div>"
    }

    todoDetailContainer.innerHTML = str
    todoDetailEventBinder()
}


function addTodoDetailEvent() {
    let add_todo = document.getElementById("input_todo_detail")

    add_todo.addEventListener("keyup",function (event) {
        if(event.key === "Enter") {
            let numberOfDetailRow = document.getElementsByClassName("todo_detail_row")
            let categoryContainer = document.getElementsByClassName("todo_detail_top")[0]
            categoryContainer.innerHTML += "<div class='todo_detail_row'>" +
                "<label class=\"checkbox\">\n" +
                "   <input type=\"checkbox\">\n" +
                "   <span class=\"checkbox_icon\"></span>\n" +
                "   <span class=\"checkbox_text category_detail\">"+add_todo.value+"</span></div>"
            todoDetailEventBinder()
        }
    })

}

function todoDetailEventBinder(){
    let todo_checkbox_uncheck = document.getElementsByClassName("unchecked_checkbox")

    for (let i =0;i<todo_checkbox_uncheck.length;i++) {
        if (todo_checkbox_uncheck[i].classList.contains("checked_checkbox")) {
            todo_checkbox_uncheck[i].removeEventListener("click",todoCheckedDetailEvent)
            todo_checkbox_uncheck[i].addEventListener("click",todoCheckedDetailEvent)
        }
        else{
            todo_checkbox_uncheck[i].removeEventListener("click",todoUncheckedDetailEvent)
            todo_checkbox_uncheck[i].addEventListener("click",todoUncheckedDetailEvent)
        }
    }
}
function todoCheckedDetailEvent(event) {
    let current_target = event.currentTarget
    current_target.classList.remove("checked_checkbox")
    todoDetailEventBinder()
}

function todoUncheckedDetailEvent(event) {
    let current_target = event.currentTarget
    current_target.classList.add("checked_checkbox")
    todoDetailEventBinder()
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
}

function categoryClickEvent(event) {
    let category = document.getElementsByClassName("category_label")
    for (let i =0 ;i<category.length;i++) {
        category[i].classList.remove("selected_category")
    }

    event.currentTarget.classList.add("selected_category")
    let categoryDetail = event.currentTarget.getAttribute("categoryIndex")
    initTodoDetail(categoryDetail)
}

