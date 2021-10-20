/*確認是否為第一次執行*/
function getFirst(){
    return 0;
}

var result = getFirst();
sendLog(result);

function sendLog(_log){
    events.broadcast.emit("log", _log);
    sleep(500);
}
