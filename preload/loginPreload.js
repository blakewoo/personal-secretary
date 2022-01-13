

const remote = require('electron').remote;

// function window_close() {
//     currentWindow.close()
// }

document.getElementById("close_button").addEventListener("click",function (event){
    // window_close()
    let win = remote.getCurrentWindow();
    win.close()
})