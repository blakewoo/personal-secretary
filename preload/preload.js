const {ipcRenderer} = require('electron')
let checkedList = new Set();
let initData = {}

window.addEventListener('DOMContentLoaded', () => {


    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    function closeClickEvent() {
        ipcRenderer.send('mainFrameButtonEvent',{value:"close"});
    }

    ipcRenderer.send('mainPageInitData',{value:true});
    ipcRenderer.on('sendInitData', (event,arg) =>{
        let categoryList = []
        if (arg) {
            initData = new Map(arg)
            let temp = initData.keys()
            for(let value of temp){
                categoryList.push(JSON.parse(value))
            }
            for(let i=0;i<categoryList.length;i++) {
                let tempTarget = initData.get(categoryList[i].toString())
                let tempResult = new Set();
                if (tempTarget) {
                    tempTarget.forEach(v =>{
                        tempResult.add(JSON.parse(v))
                    } );
                    initData.set(categoryList[i],tempResult)
                }
            }

        }
        else {
            initData = new Map()
        }
        if(initData) {
            // init data
            initTodoCategory(categoryList)
        }
        else {
            // init data
            initTodoCategory([])
        }

        // init event binder
        addCategoryButtonEvent()
        addCategoryEvent()
        todoDetailEventBinder()
        addTodoDetailEvent()
    })
})

function initTodoCategory(categoryList) {
    let categoryContainer = document.getElementsByClassName("todo_category")[0]

    let str = ""

    for (let i =0;i<categoryList.length;i++) {
        str += "<label class='category_label'>"+categoryList[i]+"</label>"
    }
    categoryContainer.innerHTML = str
    addCategoryEvent()
}
function initTodoDetail(categoryName){
    let targetIndex = categoryName;

    let todoDetailContainer = document.getElementsByClassName("todo_detail_top")[0]
    let rawData = initData

    if (rawData.get(targetIndex)) {
        let data = []
        let temp =rawData.get(targetIndex)
        if (temp) {
            temp.forEach(v =>{
                if(v) {
                    data.push(JSON.parse(v))
                }
            } );
        }

        let str = ""

        for (let i =0;i<data.length;i++) {
            str += "<div class='todo_detail_row'>" +"<label class=\"checkbox\" id="+targetIndex+"_"+data[i].date+">\n" +
                "   <input type=\"checkbox\">\n" +
                "   <span class=\"checkbox_icon\"></span></label>\n" +
                "   <span class=\"checkbox_text category_detail\">"+data[i].value+"</span>"+
                "   <span class=\"checkbox_text detail_date\">"+new Date(+data[i].date + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')+"</span>" +
                "</div>"
        }

        if(data.length!==0){
            todoDetailContainer.innerHTML = str
        }
        else{
            todoDetailContainer.innerHTML = ""
        }

    }

    todoDetailEventBinder()
}


function addTodoDetailEvent() {
    let add_todo = document.getElementById("input_todo_detail")

    add_todo.addEventListener("keyup",function (event) {
        let selectedCategory = document.getElementsByClassName("selected_category")
        if(event.key === "Enter") {
            if (add_todo.value === "") {
                return;
            }

            if(selectedCategory.length === 0){
                return;
            }

            let categoryContainer = document.getElementsByClassName("todo_detail_top")[0]
            let targetData = new Date().getTime()
            categoryContainer.innerHTML += "<div class='todo_detail_row'>" +
                "<label class=\"checkbox\" id="+selectedCategory[0].innerText+"_"+targetData+">\n" +
                "   <input type=\"checkbox\">\n" +
                "   <span class=\"checkbox_icon\"></span></label>\n" +
                "   <span class=\"checkbox_text category_detail\">"+add_todo.value+"</span>" +
                "   <span class=\"checkbox_text detail_date\">"+new Date(+targetData + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')+"</span>" +
                "</div>"
            todoDetailEventBinder()

            let temp = initData.get(selectedCategory[0].innerText)
            if(temp) {
                let tempObject = '{"value":"'+add_todo.value+'","date":'+new Date().getTime()+'}'
                temp.add(tempObject)
                initData.set(selectedCategory[0].innerText,temp)
            }
            else {
                temp = new Set()
                let tempObject = '{"value":"'+add_todo.value+'","date":'+new Date().getTime()+'}'
                temp.add(tempObject)
                initData.set(selectedCategory[0].innerText,temp)
            }
            ipcRenderer.send('createTodo',{category:selectedCategory[0].innerText,todo:{value:add_todo.value,date:new Date()}});

            add_todo.value = ""
        }
    })

}

function todoDetailEventBinder(){
    let todo_checkbox = document.getElementsByClassName("checkbox_icon")

    for (let i =0;i<todo_checkbox.length;i++) {
        todo_checkbox[i].removeEventListener("click",todoCheck)
        todo_checkbox[i].addEventListener("click",todoCheck)
    }
}

function todoCheck(event) {
    let targetNode = event.currentTarget.parentNode.id
    let temp = checkedList.get(targetNode)
    if(temp) {
        temp.delete(targetNode)
    }
    else{
        temp.add(targetNode)
    }
}

function addCategoryButtonEvent() {

    document.getElementById("add_category").removeEventListener("click",addCategorySend)
    document.getElementById("add_category").addEventListener("click",addCategorySend)

    ipcRenderer.on("inputYesNoModalResYes",function (event, args) {
        let categoryContainer = document.getElementsByClassName("todo_category")[0]
        categoryContainer.innerHTML += "<label class='category_label'>"+args.Text+"</label>"
        addCategoryEvent()
        initData.set(args.Text,new Set())
        ipcRenderer.send('createCategory',{category:args.Text});
    })

    document.getElementById("modify_category").removeEventListener("click",modifyCategorySend)
    document.getElementById("modify_category").addEventListener("click",modifyCategorySend)

    document.getElementById("delete_category").removeEventListener("click",deleteCategorySend)
    document.getElementById("delete_category").addEventListener("click",deleteCategorySend)
}

function addCategorySend(event) {
    // 모달 창 on
    ipcRenderer.send('inputYesNoModal',{title:"카테고리 추가",explain:"새로 추가할 카테고리 이름을 입력해주세요.",placeHolder:"카테고리 이름",type:"add"});
    // 입력 받고 accept
}



function modifyCategorySend(event) {
    let selectCount = document.getElementsByClassName("selected_category")
    if(selectCount.length!==0) {
        ipcRenderer.send('inputYesNoModal', {
            title: "카테고리 수정",
            explain: "변경할 카테고리 이름을 입력해주세요.",
            placeHolder: "카테고리 이름",
            type: 'modify'
        });
        ipcRenderer.on("inputYesNoModalResModifyYes", function (event, args) {
            let category = document.getElementsByClassName("category_label")
            for (let i = 0; i < category.length; i++) {
                if (category[i].classList.contains("selected_category")) {
                    let prevStr = category[i].innerText
                    category[i].innerText = args.Text
                    let todoData = initData.get(prevStr)
                    initData.set(args.Text,todoData)
                    ipcRenderer.send('updateCategory',{prevCategory:prevStr,nextCategory:args.Text});
                }
            }
        })
    }else{

    }
}

function deleteCategorySend(event) {
    let category = document.getElementsByClassName("category_label")
    if (category.length!==0) {
        for (let i =0 ;i<category.length;i++) {
            if (category[i].classList.contains("selected_category")){
                ipcRenderer.send('yesNoModal',{title:"카테고리 삭제",explain:"선택한 카테고리를 삭제하시겠습니까?"});
                ipcRenderer.on("yesNoModalRequestDelete",function (event, args) {
                    let removeCategory = category[i].innerText
                    ipcRenderer.send('deleteCategory',{category:removeCategory});
                    category[i].remove()
                })
            }
        }
    }
}

function addCategoryEvent() {
    let category = document.getElementsByClassName("category_label")
    for (let i = 0; i < category.length; i++) {
        category[i].removeEventListener("click", categoryClickEvent)
        category[i].addEventListener("click", categoryClickEvent)
    }


    function categoryClickEvent(event) {
        let category = document.getElementsByClassName("category_label")
        for (let i = 0; i < category.length; i++) {
            category[i].classList.remove("selected_category")
        }

        event.currentTarget.classList.add("selected_category")
        initTodoDetail(event.currentTarget.innerText)
    }
}