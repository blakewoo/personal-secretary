
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

    }

    function findClickEvent(event) {

    }
}

function loadSignupPage() {


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
        ipcRenderer.send('signupButtonEvent',{value:"accept"});
        ipcRenderer.on('singupDeclineButton',(event, arg) => {

        })
    }

    function cancelClickEvent(event) {
        ipcRenderer.send('signupButtonEvent',{value:"cancel"});
    }
}