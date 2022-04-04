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
        if (arg) {
            initData = arg.toString()
        }
        else {
            initData = ""
        }


        if(initData === "") {
            // init data
            initTodoCategory([])
            initTodoDetail(new Map())
        }
        else {
            // init data
            initTodoCategory(initData)
            initTodoDetail(initData)
        }

        // init event binder
        addCategoryButtonEvent()
        addCategoryEvent(0)
        todoDetailEventBinder()
        addTodoDetailEvent()
    })
})

function initTodoCategory(initData) {
    let categoryContainer = document.getElementsByClassName("todo_category")[0]

    //example data
    // let data = [{index:0,value:"ABA"},{index:1,value:"BABA"}]
    let data = initData
    let str = ""

    for (let i =0;i<data.length;i++) {
        str += "<label class='category_label' categoryIndex="+data[i].index+">"+data[i].value+"</label>"
    }

    categoryContainer.innerHTML = str
    addCategoryEvent()
}
function initTodoDetail(initData,categoryIndex){
    let targetIndex = categoryIndex;

    let todoDetailContainer = document.getElementsByClassName("todo_detail_top")[0]
    let rawData = new Map(initData)
    // data type example
    // rawData.set(0,[{value:1,date:new Date()},{value:2,date:new Date()},{value:3,date:new Date()}])

    if (targetIndex!== undefined) {
        let data = rawData.get(Number(targetIndex))
        let str = ""

        for (let i =0;i<data.length;i++) {
            str += "<div class='todo_detail_row'>" +"<label class=\"checkbox\" id="+i+">\n" +
                "   <input type=\"checkbox\">\n" +
                "   <span class=\"checkbox_icon\"></span></label>\n" +
                "   <span class=\"checkbox_text category_detail\">"+data[i].value+"</span>"+
                "   <span class=\"checkbox_text detail_date\">"+new Date(+data[i].date + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')+"</span>" +
                "</div>"
        }

        todoDetailContainer.innerHTML = str
    }

    todoDetailEventBinder()
}


function addTodoDetailEvent() {
    let add_todo = document.getElementById("input_todo_detail")

    add_todo.addEventListener("keyup",function (event) {
        if(event.key === "Enter") {
            if (add_todo.value === "") {
                return;
            }

            let categoryContainer = document.getElementsByClassName("todo_detail_top")[0]
            categoryContainer.innerHTML += "<div class='todo_detail_row'>" +
                "<label class=\"checkbox\">\n" +
                "   <input type=\"checkbox\">\n" +
                "   <span class=\"checkbox_icon\"></span></label>\n" +
                "   <span class=\"checkbox_text category_detail\">"+add_todo.value+"</span>" +
                "   <span class=\"checkbox_text detail_date\">"+new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')+"</span>" +
                "</div>"
            todoDetailEventBinder()

            add_todo.value = ""
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
        // 모달 창 on
        ipcRenderer.send('inputYesNoModal',{title:"카테고리 추가",explain:"새로 추가할 카테고리 이름을 입력해주세요.",placeHolder:"카테고리 이름"});
        // 입력 받고 accept
    })

    ipcRenderer.on("inputYesNoModalResYes",function (event, args) {
        let categoryContainer = document.getElementsByClassName("todo_category")[0]
        categoryContainer.innerHTML += "<label class='category_label'>"+args.Text+"</label>"
        addCategoryEvent()
    })

    document.getElementById("modify_category").addEventListener("click",function (event){

        let category = document.getElementsByClassName("category_label")
        let target = null
        if(category.length!==0) {
            for (let i =0 ;i<category.length;i++) {
                if(category[i].classList.contains("selected_category")){
                    target = category[i]
                    ipcRenderer.send('inputYesNoModal',{title:"카테고리 수정",explain:"변경할 카테고리 이름을 입력해주세요.",placeHolder:"카테고리 이름"});
                }
            }
        }
        else{
            return;
        }
        ipcRenderer.on("inputYesNoModalResYes",function (event, args) {
            target.innerText = args.Text
        })
    })

    document.getElementById("delete_category").addEventListener("click",function (event){

        let category = document.getElementsByClassName("category_label")
        if (category.length!==0) {
            for (let i =0 ;i<category.length;i++) {
                if (category[i].classList.contains("selected_category")){
                    ipcRenderer.send('yesNoModal',{title:"카테고리 삭제",explain:"선택한 카테고리를 삭제하시겠습니까?"});
                    // category[i].remove()
                }
            }
        }
        else{

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
