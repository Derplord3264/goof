var conn;
var host = window['templateContext'].host;
var key = window['templateContext'].key;
// Add items to the chat
function appendLog(item) {
    var doScroll = log.scrollTop === log.scrollHeight - log.clientHeight;
    log.appendChild(item);
    if (doScroll) {
        log.scrollTop = log.scrollHeight - log.clientHeight;
    }
}
function Message(name, msg) {
    return JSON.stringify({
        name: name,
        msg: msg
    });
}
window.onload = function () {
    document.getElementById("form").onsubmit = function (evt) {
        var msg = document.getElementById("msg");
        var log = document.getElementById("log");
        if (!conn) {
            return false;
        }
        if (!msg.value) {
            return false;
        }
        conn.send(Message("djhrtmn: ", msg.value));
        msg.value = "";
        return false;
    };
    // Check for WebSocket support
    if (!window["WebSocket"]) {
        var item = document.createElement("div");
        item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
        appendLog(item);
    }
    // Set up the WebSocket connection
    conn = new WebSocket("ws://" + host + "/ws/" + key);
    conn.onclose = function (evt) {
        var item = document.createElement("div");
        item.innerHTML = "<b>Connection closed.</b>";
        appendLog(item);
    };
    conn.onmessage = function (evt) {
        console.log();
        var messages = evt.data.split('\n');
        for (var i = 0; i < messages.length; i++) {
            var item = document.createElement("div");
            item.innerText = messages[i];
            appendLog(item);
        }
    };
};
