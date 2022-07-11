const {ipcRenderer} = require('electron')
let checkedList = new Map();
let initData = {}
let timeLine = {}
let sizeFlag = "small"

window.addEventListener('DOMContentLoaded', () => {


    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    function closeClickEvent() {
        ipcRenderer.send('mainFrameButtonEvent',{value:"close"});
    }

    document.getElementById("under_button").addEventListener('click', underClickEvent)
    function underClickEvent() {

        ipcRenderer.send('mainFrameButtonEvent',{value:"under"});
    }

    document.getElementById("sizeSwitch_button").addEventListener('click', sizeClickEvent)
    function sizeClickEvent() {
        if (sizeFlag === "small") {
            sizeFlag = "big"
            document.getElementById("sizeSwitch_button").value="ㅁ"
        }
        else {
            sizeFlag = "small"
            document.getElementById("sizeSwitch_button").value="□"
        }
        ipcRenderer.send('mainFrameButtonEvent',{value:"size",size:sizeFlag});
    }

    document.getElementById("timeline_button").addEventListener('click',timeLineSwitchingEvent)
    function timeLineSwitchingEvent (event) {
        timeLineInitial()
    }

    document.getElementById("file_dashboard_button").addEventListener('click',fileDashboardSwitchingEvent)
    function fileDashboardSwitchingEvent(event) {
        fileDashboardInitial()
    }

    ipcRenderer.send('mainPageInitData',{value:true});
    ipcRenderer.on('sendInitData', (event,arg) =>{
        let categoryList = []

        if(arg.timeLine) {
            timeLine = new Set(arg.timeLine)
        }

        if (arg.all) {
            initData = new Map(arg.all)
            let temp = initData.keys()
            for(let value of temp){
                categoryList.push(JSON.parse(value))
            }
            for(let i=0;i<categoryList.length;i++) {
                let tempTarget = initData.get(categoryList[i].toString())
                let tempResult = new Set();
                if (tempTarget) {
                    tempTarget.forEach(v =>{
                        tempResult.add(v.toString())
                    } );
                    initData.set(categoryList[i].toString(),tempResult)
                }
            }

        }
        else {
            initData = new Map()
        }

        if(arg.checked) {
            checkedList = arg.checked
        }
        else{
            checkedList = new Map()
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


// 타임라인 기능
function timeLineInitial() {
    // test code
    // timeLine = new Set([
    //              {category:"1",value:"2",date:"1652018750224"},
    //             {category:"1",value:"3",date:"1657048750225"},
    //     {category:"1",value:"5",date:"1657018750300"},
    //     {category:"1",value:"2",date:"1657018850222"}
    //          ])

    let Data = []

    Data = Array.from(timeLine).sort((a,b)=>{return Number(a.date - b.date)})

    let category = document.getElementsByClassName("category_label")
    for (let i = 0; i < category.length; i++) {
        category[i].classList.remove("selected_category")
    }

    let tempTimeLine = ""
    for(let dataIndex=0;dataIndex<Data.length;dataIndex++) {
        tempTimeLine += "<div class='todo_detail_row'>" +"<label class=\"checkbox\" id="+Data[dataIndex].category+"_"+Data[dataIndex].date+">\n"
        let tempCheckList = checkedList.get(Data[dataIndex].category)
        if(tempCheckList && tempCheckList.has(Data[dataIndex].category+"_"+Data[dataIndex].date)){
            tempTimeLine +=    "<span class='timeline_complete'> 완료 </span>"
        }
        else{
            tempTimeLine +=    "<span class='timeline_incomplete'> 미완료 </span>"
        }
        tempTimeLine += "   <span class=\"checkbox_text timeline_category_detail\"><label class='todo_value'>"+Data[dataIndex].value+"</label><input type='text' style='display: none' class='todoModifyInput' /></span>"

        if(tempCheckList && tempCheckList.has(Data[dataIndex].category+"_"+Data[dataIndex].date)){
            tempTimeLine +=    "   <span class=\"detail_date\">"+"생성 : "+new Date(+Data[dataIndex].date + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')+"  완료 : "+new Date(+Data[dataIndex].date + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')+"</span>" +
                "</div>"
        }
        else{
            tempTimeLine +=    "   <span class=\"detail_date\">"+"생성 : "+new Date(+Data[dataIndex].date + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')+"</span>" +
                "</div>"
        }

    }

    let str = "    <div class=\"timeline_detail\"><img /><label> 타임 라인 </label>\n" +
        "    <div class=\"timeline_detail_top container\">\n" +tempTimeLine +
        "    </div>"
    document.getElementsByClassName("right_container")[0].innerHTML = str
}


// 파일 현황 기능
function fileDashboardInitial() {
    let str = "    <div class=\"file_detail\"><img /><label> 파일 현황 </label>\n" +
        "    <div class=\"file_detail_top container\">\n" +
        "    </div>"
    document.getElementsByClassName("right_container")[0].innerHTML = str
}

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
                data.push(JSON.parse(v))
            });
        }


        let str = ""

        for (let i =0;i<data.length;i++) {
            console.log(data[i].date)
            str += "<div class='todo_detail_row'>" +"<label class=\"checkbox\" id="+targetIndex+"_"+data[i].date+">\n"
            let tempCheckList = checkedList.get(targetIndex)
            if(tempCheckList && tempCheckList.has(targetIndex+"_"+data[i].date)){
                str +=    "   <input type=\"checkbox\" checked>\n"
            }
            else{
                str +=    "   <input type=\"checkbox\">\n"
            }
            str +=    "   <span class=\"checkbox_icon\"></span></label>\n" +
                "   <span class=\"checkbox_text category_detail\"><label class='todo_value'>"+data[i].value+"</label><input type='text' style='display: none' class='todoModifyInput' /></span>"+
                "<span class='delete_detail'>X</span>"+
                "   <span class=\"detail_date\">"+new Date(+data[i].date + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')+"</span>" +
                "</div>"
        }

        if(data.length!==0){
            todoDetailContainer.innerHTML = str
        }
        else{
            todoDetailContainer.innerHTML = ""
        }

    }
    addTodoDetailEvent()
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
            let tempHtml = document.createElement("div")
            tempHtml.classList.add("todo_detail_row")
            tempHtml.innerHTML = "<label class=\"checkbox\" id="+selectedCategory[0].innerText+"_"+targetData+">\n" +
                "   <input type=\"checkbox\">\n" +
                "   <span class=\"checkbox_icon\"></span></label>\n" +
                "   <span class=\"checkbox_text category_detail\"><label class='todo_value'>"+add_todo.value+"</label><input type='text' style='display: none' class='todoModifyInput' /></span>" +
                "<span class='delete_detail'>X</span>"+
                "   <span class=\"checkbox_text detail_date\">"+new Date(+targetData + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')+"</span>"
            categoryContainer.appendChild(tempHtml)
            todoDetailEventBinder()

            let temp = initData.get(selectedCategory[0].innerText)
            if(temp) {
                let tempObject = '{"value":"'+add_todo.value.toString()+'","date":"'+targetData+'"}'
                temp.add(tempObject)
                timeLine.add(tempObject)
                initData.set(selectedCategory[0].innerText,temp)
            }
            else {
                temp = new Set()
                let tempObject = '{"value":"'+add_todo.value.toString()+'","date":"'+targetData+'"}'
                temp.add(tempObject)
                timeLine.add(tempObject)
                initData.set(selectedCategory[0].innerText,temp)
            }

            ipcRenderer.send('createTodo',{category:selectedCategory[0].innerText,todo:temp,timeLine:timeLine});

            add_todo.value = ""
        }
    })

}

function todoDetailEventBinder(){
    let todo_checkbox = document.getElementsByClassName("checkbox_icon")
    let delete_todo = document.getElementsByClassName("delete_detail")
    let modify_todo = document.getElementsByClassName("category_detail")

    for (let i =0;i<todo_checkbox.length;i++) {
        todo_checkbox[i].removeEventListener("click",todoCheck)
        todo_checkbox[i].addEventListener("click",todoCheck)
    }

    for(let i=0;i<delete_todo.length;i++) {
        delete_todo[i].removeEventListener("click",deleteTodoEvent)
        delete_todo[i].addEventListener("click",deleteTodoEvent)
    }

    for(let i=0;i<modify_todo.length;i++) {
        modify_todo[i].removeEventListener("click",modifyTodoEvent)
        modify_todo[i].addEventListener("click",modifyTodoEvent)
    }

}

function modifyTodoEvent(event) {
    let target = event.currentTarget
    let selectedCategory = document.getElementsByClassName("selected_category")
    let tempPrevTodo =  target.querySelector(".todo_value").innerText
    target.querySelector(".todo_value").style.display = "none"

    let targetInput = target.querySelector("input")
    targetInput.style.display = "inline-block"
    targetInput.focus()
    targetInput.value = tempPrevTodo
    targetInput.addEventListener("keyup",function (event) {
        if(event.key === "Enter") {
            let targetId = event.currentTarget.parentNode.parentNode.querySelector('label').id
            let targetDate = Number(targetId.split("_")[1])
            let prevTargetObj = '{"value":"'+tempPrevTodo.toString()+'","date":"'+targetDate+'"}'
            let afterTargetObj = '{"value":"'+targetInput.value.toString()+'","date":"'+targetDate+'"}'


            let memoryTodo = initData.get(selectedCategory[0].innerText)
            if(memoryTodo) {
                memoryTodo.delete(prevTargetObj.toString())
                memoryTodo.add(afterTargetObj.toString())

                timeLine.delete(prevTargetObj.toString())
                timeLine.add(afterTargetObj.toString())
                initData.set(selectedCategory[0].innerText,memoryTodo)
            }

            ipcRenderer.send('updateTodo', {
                category: selectedCategory[0].innerText,
                todo:memoryTodo,
                timeLine:timeLine
            });
            let tempText = targetInput.value
            targetInput.style.display = "none"
            target.querySelector(".todo_value").innerText = tempText
            target.querySelector(".todo_value").style.display = "inline-block"
        }
    })

    targetInput.addEventListener("focusout",function (event) {
        let targetId = event.currentTarget.parentNode.parentNode.querySelector('label').id
        let targetDate = Number(targetId.split("_")[1])
        let prevTargetObj = '{"value":"'+tempPrevTodo.toString()+'","date":"'+targetDate+'"}'
        let afterTargetObj = '{"value":"'+targetInput.value.toString()+'","date":"'+targetDate+'"}'

        let memoryTodo = initData.get(selectedCategory[0].innerText)
        if(memoryTodo) {
            memoryTodo.delete(prevTargetObj.toString())
            memoryTodo.add(afterTargetObj.toString())

            timeLine.delete(prevTargetObj.toString())
            timeLine.add(afterTargetObj.toString())
            initData.set(selectedCategory[0].innerText, memoryTodo)
        }

        ipcRenderer.send('updateTodo', {
            category: selectedCategory[0].innerText,
            todo:memoryTodo,
            timeLine:timeLine
        });
        let tempText = targetInput.value
        targetInput.style.display = "none"
        target.querySelector(".todo_value").innerText = tempText
        target.querySelector(".todo_value").style.display = "inline-block"
    })
}



function todoCheck(event) {
    let selectedCategory = document.getElementsByClassName("selected_category")
    let targetNode = event.currentTarget.parentNode.id

    let tempCheckList = checkedList.get(selectedCategory[0].innerText)
    if(tempCheckList && tempCheckList.has(targetNode)) {
        tempCheckList.delete(targetNode)
        checkedList.set(selectedCategory[0].innerText,tempCheckList)
    }
    else{
        if(tempCheckList) {
            tempCheckList.add(targetNode)
            checkedList.set(selectedCategory[0].innerText,tempCheckList)
        }
        else{
            tempCheckList = new Set();
            tempCheckList.add(targetNode)
            checkedList.set(selectedCategory[0].innerText,tempCheckList)
        }

    }
    ipcRenderer.send('checkTodo', {
        category: selectedCategory[0].innerText,
        todoID: targetNode
    });
}

function deleteTodoEvent(event) {
    let currentTargetNode= event.currentTarget
    ipcRenderer.send('yesNoModal', {
        title: "삭제 확인",
        explain: "정말로 삭제하시겠습니까?"
    });

    ipcRenderer.on("yesNoModalResDeleteYes",function (event2, args) {
            let selectedCategory = document.getElementsByClassName("selected_category")
            let targetNode = currentTargetNode.parentNode
            let todoValue = targetNode.querySelector(".category_detail").innerText
            let targetId = currentTargetNode.parentNode.querySelector('label').id
            let targetDate = Number(targetId.split("_")[1])
            let targetObj = '{"value":"'+todoValue.toString()+'","date":"'+targetDate+'"}'

            if(checkedList.has(targetId)) {
                checkedList.delete(targetId)
            }

            let memoryTodo = initData.get(selectedCategory[0].innerText)
            if(memoryTodo) {
                memoryTodo.delete(targetObj.toString())
                timeLine.delete(targetObj.toString())
                initData.set(selectedCategory[0].innerText,memoryTodo)
            }

            ipcRenderer.send('deleteTodo', {category:selectedCategory[0].innerText,todo:memoryTodo,timeLine:timeLine})

            targetNode.remove()
    })

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
                ipcRenderer.send('yesNoModal',{title:"카테고리 삭제",explain:"선택한 카테고리를 삭제하시겠습니까?",type:"category"});
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
        todolistSwitchingEvent()
        initTodoDetail(event.currentTarget.innerText)
    }

    function todolistSwitchingEvent() {
        document.getElementsByClassName("right_container")[0].innerHTML =
            "<div class=\"todo_detail\"><img /><label> 세부 내용 </label>\n" +
            "    <div class=\"todo_detail_top container\">\n" +
            "\n" +
            "    </div>\n" +
            "    <div class=\"todo_detail_bottom\">\n" +
            "        <input type=\"text\" id=\"input_todo_detail\" class=\"todo_detail_text\">\n" +
            "    </div>\n" +
            "    </div>"
    }
}