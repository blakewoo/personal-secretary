const {ipcRenderer} = require('electron')
let checkedList = new Set();

window.addEventListener('DOMContentLoaded', () => {

    let initData = {}
    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    function closeClickEvent() {
        ipcRenderer.send('mainFrameButtonEvent',{value:"close"});
    }

    ipcRenderer.send('mainPageInitData',{value:true});
    ipcRenderer.on('sendInitData', (event,arg) => {
        initData = arg
    })


    // init data
    initTodoCategory(initData)
    initTodoDetail(initData)

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
function initTodoDetail(initData,categoryIndex){
    let targetIndex = 0;
    if (!categoryIndex) {
        targetIndex = 0
    }
    else {
        targetIndex = categoryIndex
    }

    let todoDetailContainer = document.getElementsByClassName("todo_detail_top")[0]
    // test data
    let rawData = new Map()
    rawData.set(0,[1,2,3])
    rawData.set(1,[2,3,4])
    rawData.set(2,[3,4,5])
    rawData.set(3,[4,5,6])
    rawData.set(4,[5,6,7])

    let data = rawData.get(Number(targetIndex))
    let str = ""

    for (let i =0;i<data.length;i++) {
        str += "<div class='todo_detail_row'>" +"<label class=\"checkbox\" id="+i+">\n" +
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
    let todo_checkbox = document.getElementsByClassName("checkbox")

    for (let i =0;i<todo_checkbox.length;i++) {
        todo_checkbox[i].removeEventListener("click",todoCheck)
        todo_checkbox[i].addEventListener("click",todoCheck)
    }
}

function todoCheck(event) {
    checkedList.add(event.currentTarget.getAttribute("id"))
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
    console.log(categoryDetail)
    initTodoDetail(categoryDetail)
}

