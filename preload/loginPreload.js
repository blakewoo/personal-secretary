
const {ipcRenderer} = require('electron')
window.addEventListener('DOMContentLoaded', () => {
    loadLoginPage()
})

function loadLoginPage() {
    let str = "    <h1 class=\"head_title\">일잘러의 수첩</h1>\n" +
        "    <div class=\"att_border_bottom\">\n" +
        "        <label>사용자 : </label><input class=\"input_border\" id=\"user_input\" type=\"text\">\n" +
        "    </div>\n" +
        "    <div class=\"att_border_bottom\">\n" +
        "        <label>비밀번호 : </label><input class=\"input_border\" id=\"password_input\" type=\"text\">\n" +
        "        <div>\n" +
        "            <label class=\"notice_wrong_account\" id=\"wrong_account\">\n" +
        "                아이디 혹은 패스워드가 올바르지 않습니다.\n" +
        "            </label>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"att_border_bottom\">\n" +
        "        <input type=\"button\" value=\"로그인\" class=\"public_button\" id=\"login_button\"/>\n" +
        "    </div>\n" +
        "\n" +
        "\n" +
        "    <div class=\"att_border_bottom\">\n" +
        "        <input type=\"button\" value=\"새로 수첩 만들기\" class=\"public_button\" id=\"signup_button\"/>\n" +
        "    </div>\n" +
        "    <div class=\"att_border_bottom\">\n" +
        "        <input type=\"button\" value=\"수첩 찾기\" class=\"public_button\" id=\"findpass_button\"/>\n" +
        "    </div>"

    document.getElementById("main_html_div").innerHTML = str

    bindLoginEvent ()
}

function bindLoginEvent () {
    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    document.getElementById("login_button").addEventListener('click', loginClickEvent)
    document.getElementById("signup_button").addEventListener('click', signUpClickEvent)
    document.getElementById("findpass_button").addEventListener('click', findClickEvent)

    function closeClickEvent (event) {
        ipcRenderer.send('loginFrameButtonEvent',{value:"close"});
    }

    function loginClickEvent(event) {
        let id = document.getElementById("user_input").value;
        let pass = document.getElementById("password_input").value;

        ipcRenderer.send('loginButtonEvent',{value:"login",ID:id,PASSWORD:pass});
        ipcRenderer.on('errorLogin',(event, arg) => {
            document.getElementById("wrong_account").style.display="block"
        })
    }

    function signUpClickEvent(event) {
        loadSignupPage()
    }

    function findClickEvent(event) {
        loadFindIdPage()
    }
}

function loadSignupPage() {

    let str = "<h1>Sign up</h1>\n" +
        "<div class=\"div_vertical_term\">\n" +
        "    <label>ID : </label><input id=\"id_input\" class=\"input_border\" type=\"text\">\n" +
        "</div>\n" +
        "<div class=\"div_vertical_term\">\n" +
        "    <label>Email : </label><input id=\"email_input\" class=\"input_border\" type=\"text\">\n" +
        "</div>\n" +
        "<div class=\"div_vertical_term\">\n" +
        "    <label>PASSWORD : </label><input id=\"pwd_input\" class=\"input_border\"  type=\"text\">\n" +
        "</div>\n" +
        "<div class=\"div_vertical_term\">\n" +
        "    <label>PASSWORD CONFIRM : </label><input id=\"pwdcheck_input\" class=\"input_border\"  type=\"text\">\n" +
        "</div>\n" +
        "<div class=\"div_vertical_term\">\n<br>" +
        "    <label class='explain_label'>코드는 홈페이지에서 결재 후 발급 받을 수 있습니다.</label>" +
        "</div>\n" +
        "<div class=\"div_vertical_term\">\n" +
        "    <label>Pro code : </label><input id=\"procode_input\" class=\"input_border\"  type=\"text\">\n" +
        "</div>\n" +
        "<div class=\"div_vertical_term\">\n" +
        "    <input value=\"Accept\" class=\"public_button\" id=\"accept_button\" type=\"button\"><input  value=\"cancel\" class=\"public_button\" id=\"cancel_button\" type=\"button\">\n" +
        "</div>"
    document.getElementById("main_html_div").innerHTML = str
    bindSignupEvent()
}

function bindSignupEvent() {
    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    document.getElementById("accept_button").addEventListener('click', acceptClickEvent)
    document.getElementById("cancel_button").addEventListener('click', cancelClickEvent)


    function closeClickEvent (event) {

        ipcRenderer.send('signupFrameButtonEvent',{value:"close"});
    }

    function acceptClickEvent(event) {
        let idValue= document.getElementById("id_input");
        let passValue = document.getElementById("pwd_input")
        ipcRenderer.send('signupButtonEvent',{value:"accept",id:idValue.value,pass:passValue.value});
        ipcRenderer.on('singupDeclineButton',(event, arg) => {

        })
    }

    function cancelClickEvent(event) {
        loadLoginPage()
    }
}

function loadFindIdPage() {

    let str = "<h1>Find ID</h1>\n" +
        "<div class=\"div_vertical_term\">\n" +
        "    <label>프로 일잘러 등급 사용자만 가능합니다</label>"+
        "</div>\n" +
        "<div class=\"div_vertical_term\">\n" +
        "    <label>Email : </label><input id=\"email_input\" class=\"input_border\" type=\"text\">\n" +
        "</div>\n" +
        "<div class=\"div_vertical_term\">\n" +
        "    <input value=\"Send\" class=\"public_button\" id=\"accept_button\" type=\"button\"><input  value=\"cancel\" class=\"public_button\" id=\"cancel_button\" type=\"button\">\n" +
        "</div>"
    document.getElementById("main_html_div").innerHTML = str
    bindFindIdEvent()
}

function bindFindIdEvent() {
    document.getElementById("close_button").addEventListener('click', closeClickEvent)
    document.getElementById("accept_button").addEventListener('click', acceptClickEvent)
    document.getElementById("cancel_button").addEventListener('click', cancelClickEvent)

    function closeClickEvent (event) {

        ipcRenderer.send('signupFrameButtonEvent',{value:"close"});
    }

    function acceptClickEvent(event) {
        ipcRenderer.send('findIdButtonEvent',{value:"accept"});
        ipcRenderer.on('findIdResultButton',(event, arg) => {

        })
    }

    function cancelClickEvent(event) {
        loadLoginPage()
    }
}