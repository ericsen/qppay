systemObject = {
    version : 39,
    UUID : "@UUID",
    Url : "@URL",
    Key : "@Key",
    Iv : "@Iv",
    Bank : "@Bank",
    sec : 0,
    
    /*設定檔位置*/
    sdcardPath : "/sdcard",
    basePath: "/sdcard/QuickOTP",
    transPath : "trans_config_otp",
    configPath: "/config.txt",
    filetext: "",
    filetextSplitString: "",
    /* log路徑 */
    logPath: "/log",
    logName: "",

    /* 存放頁面元件 */
    PageItemList : [],
    /* 取得OTP相關資料 */
    order : {
        transactionID : 0,
        code : "",
        passwordOtp : "",
        OTP : "",
    },
};

function otpPinCodeObject(_number, _numberItem){
    this.number = _number;
    this.numberItem = _numberItem;
}

/*檢查舊的設定資料夾是否存在*/
if(files.exists(systemObject.basePath + "/")){
    if(!files.exists(systemObject.sdcardPath + "/" + systemObject.transPath)){
        /*更改資料名稱*/
        files.rename(systemObject.basePath + "/", systemObject.transPath);
        
        /*變更指定位置*/
        systemObject.basePath = systemObject.sdcardPath + "/" + systemObject.transPath;
    }
}
else{
    /*變更指定位置*/
    systemObject.basePath = systemObject.sdcardPath + "/" + systemObject.transPath;
}

/*擷取設定檔資料*/
systemObject.filetext = files.read(systemObject.basePath + systemObject.configPath);
/*確認config版本*/
LoadConfig();

/* 每5秒呼叫1次getAppOtpCode的API */
setInterval(function(){
    /* 組合資料 */
    var sendData = {
        id : systemObject.UUID,
        rand : random(1111111111, 9999999999),
    };
    var jsonString = JSON.stringify(sendData);
    var encryptString = Encrypt(jsonString);
    var resultStatus = 0;

    /* 發送資料 */
    try{
        var result = HttpPost(encryptString, "getAppOtpCode");
    }
    catch(e){
        log("發送失敗：" + e.toString());
        resultStatus = 1;
    }

    if(resultStatus == 0){
        /* 判斷是否可以執行 */
        if(result["status"] != "10000"){
            return;
        }
        /*如果是TCB會因為code為空導致失敗 */
        if(systemObject.Bank == "2007"){
            if(result["code"] == null || result["code"] == ""){
                log("OTP代碼為空");
                return;
            }
        }
        if(result["passwordOtp"] == null || result["passwordOtp"] == ""){
            log("OTP密碼為空");
            return;
        }
        /* 判斷取得單號是不是同一筆與不是空白 */
        if(result["transactionID"] == systemObject.order.transactionID){        
            return;
        }else if(result["transactionID"] == ""){        
            return;
        }
        log("接到訂單 - " + "訂單編號：" + result["transactionID"]);
        writeLog("接到訂單 - " + "訂單編號：" + result["transactionID"]);

        /* 放置資料 */
        systemObject.order.transactionID = result["transactionID"];
        systemObject.order.passwordOtp = result["passwordOtp"];
        systemObject.order.code = result["code"];
        systemObject.order.OTP = "";

        /* 判斷銀行並執行腳本 */
        if(systemObject.Bank == "2007"){
            try {
                OpenAppToGetTCB_OTP();
            } catch (error) {
                writeLog("訂單號：" + String(systemObject.transactionID) + "TCB取OTP時執行發生錯誤：" + error);
            }
        }
        else if (systemObject.Bank == "1549"){
            try {
                OpenAppToGetVPB_OTP();    
            } catch (error) {
                writeLog("訂單號：" + String(systemObject.transactionID) + "VPB取OTP時執行發生錯誤：" + error);
            }
        }
        else{
            toastLog("銀行設定錯誤");
            return;
        }
        
        if(systemObject.order.OTP == ""){
            toast("OTP 取得失敗");
            closeRun();
        }

        writeLog("取得OTP - " + "訂單編號：" + systemObject.order.transactionID + ", OTP：" + systemObject.order.OTP);

        /* 回傳結果 */
        /* 組合資料 */
        sendData = {
            id : systemObject.UUID,
            rand : random(1111111111, 9999999999),
            transactionID : systemObject.order.transactionID,
            code : systemObject.order.OTP,
        };
        jsonString = JSON.stringify(sendData);
        encryptString = Encrypt(jsonString);

        /* 發送資料 */
        result = HttpPost(encryptString, "sendAppOtp");

        /* 等待結束訊號 */
        waitEnd();

        closeRun();
    }
    

}, 5000);

/* 開啟TCB的APP取OTP */
function OpenAppToGetTCB_OTP(){
    launch("com.fastacash.tcb");
    sleep(3000);

    /* 判定是否有廣告 */
    var itemString = "", loginList = null;
    for(var i = 0;i < 3;i++){
        loginList = text("LOGIN").find();
        if(!loginList.empty()){
            break;
        }
        loginList = text("ĐĂNG NHẬP").find();
        if(!loginList.empty()){
            break;
        }
        sleep(1000);
    }
    if(loginList == null){
        return;
    }

    if(loginList.length == 2){
        itemString = "LOGIN";
        if(text(itemString).exists()){
            text(itemString).click();
        }
        else if(text("ĐĂNG NHẬP").exists()){
            text("ĐĂNG NHẬP").click();
        }
        sleep(500);
    }

    /*抓取彈跳視窗*/
    WaitAppMsg();

    itemString = "Get OTP code";
    if (text(itemString).findOne(5000) == null) {
        itemString = "Lấy mã OTP";
        if (text(itemString).findOne(2000) != null) {
            text(itemString).click();
        }
        else {
            log("找不到OTP按鈕");
            return;
        }
    }
    else {
        text(itemString).click();
    }

    sleep(3000);

    var page = null, ButtonList = [], EditTextList = [];
    var findSwitch = false;
    for(var i = 0;i < 10;i++){
        systemObject.PageItemList = [], loginList = null;
        page = className("android.widget.FrameLayout").findOnce();
        if(page != null){
            getPageItemList(page, systemObject.PageItemList);
            if(systemObject.PageItemList.length > 14){
                findSwitch = true;
                break;
            }
        }
        sleep(1000);
    }
    if(!findSwitch){
        writeLog("空的");
        return;
    }
    
    systemObject.PageItemList.forEach(function(item){
        if(item.className() == "android.widget.EditText"){
            EditTextList.push(item);
        }
        else if(item.className() == "android.widget.Button"){
            if(item.text() == "Submit" || item.text() == "Xác nhận"){
                ButtonList.push(item);
            }
        }
    });

    /*輸入交易編號*/
    EditTextList[0].setText(systemObject.order.code);
    sleep(1000);
    ButtonList[0].click();
    sleep(1000);

    page = null, ButtonList = [], EditTextList = [], findSwitch = false;
    for(var i = 0;i < 10;i++){
        systemObject.PageItemList = [], loginList = null;
        page = className("android.widget.FrameLayout").findOnce();
        if(page != null){
            getPageItemList(page, systemObject.PageItemList);
            if(systemObject.PageItemList.length > 15){
                findSwitch = true;
                break;
            }
        }
        sleep(1000);
    }
    if(!findSwitch){
        writeLog("空的");
        return;
    }
    
    systemObject.PageItemList.forEach(function(item){
        if(item.className() == "android.widget.EditText"){
            EditTextList.push(item);
        }
        else if(item.className() == "android.widget.Button"){
            if(item.text() == "Get OTP code" || item.text() == "Lấy mã OTP"){
                ButtonList.push(item);
            }
        }
    });

    /*輸入OTP密碼*/
    EditTextList[0].setText(systemObject.order.passwordOtp);
    sleep(1000);
    ButtonList[0].click();
    sleep(1000);

    page = null, ButtonList = [], EditTextList = [], findSwitch = false;
    var ViewViewList = [];
    for(var i = 0;i < 10;i++){
        systemObject.PageItemList = [], loginList = null;
        page = className("android.widget.FrameLayout").findOnce();
        if (page != null && text("Your OTP code").exists()) {
            getPageItemList(page, systemObject.PageItemList);
            findSwitch = true;
            break;
        }
        sleep(1000);
    }
    if(!findSwitch){
        writeLog("空的");
        return;
    }
    
    systemObject.PageItemList.forEach(function(item){
        if(item.className() == "android.view.View" && item.text() != ""){
            if(TestNum(item.text())){
                if(item.text().length == 6){
                    ViewViewList.push(item);
                }
            }
        }
        else if(item.className() == "android.widget.Button"){
            ButtonList.push(item);
        }
    });

    /*取得OTP*/
    systemObject.order.OTP = ViewViewList[0].text();
    if (systemObject.order.OTP == "" && systemObject.order.OTP.length != 6) {
        ButtonList[3].click();
        sleep(500);
        systemObject.order.OTP = getClip().toString();
    }
    sleep(1000);

    log("此次OTP:" + systemObject.order.OTP);
}

/* 開啟VPB的APP取OTP */
function OpenAppToGetVPB_OTP(){
    launch("com.vnpay.vpbankonline");
    sleep(1000);

    /* 抓取頁面元件 */
    var page = null, findSwitch = false;
    for(var i = 0;i < 10;i++){
        systemObject.PageItemList = [], loginList = null;
        page = className("android.widget.FrameLayout").findOnce();
        if(page != null && text("Smart OTP").exists()){
            getPageItemList(page, systemObject.PageItemList);
            findSwitch = true;
            break;
        }
        sleep(1000);
    }
    if(!findSwitch){
        writeLog("空的");
        return;
    }
    var ButtonList = [], TextViewList = [], ViewViewList = [], EditTextList = [], c = 0;
    systemObject.PageItemList.some(function(item){
        if(c >= 1){
            return true;
        }
        if(item.text() == "Smart OTP"){
            TextViewList.push(item);
            c += 1;
        }
    });
    TextViewList[0].click();
    sleep(3000);
    
    /* 抓取頁面元件 */
    page = null, findSwitch = false;
    for(var i = 0;i < 10;i++){
        systemObject.PageItemList = [], loginList = null;
        page = className("android.widget.FrameLayout").findOnce();
        if(page != null && text("Input Smart OTP PIN code").exists()){
            getPageItemList(page, systemObject.PageItemList);
            if(systemObject.PageItemList.length > 35){
                findSwitch = true;
                break;
            }
        }
        sleep(1000);
    }
    if(!findSwitch){
        writeLog("空的");
        return;
    }

    /* 將OTP密碼拆分 */
    var passotp = systemObject.order.passwordOtp;
    var passotpSplit = passotp.split("");
    ButtonList = [], TextViewList = [], TextViewNumList = [], EditTextList = [], c = 0, numberList = [], number = ["1","2","3","4","5","6","7","8","9","0"];
    systemObject.PageItemList.forEach(function(item){
        if(number.indexOf(item.text()) > -1 && item.className() == "android.widget.TextView"){
            numberList.push(new otpPinCodeObject(item.text(), item.bounds()));
        }
        else if(item.className() == "android.widget.Button"){
            ButtonList.push(item);
        }
    });
    
    /* 點擊OTP密碼 */
    passotpSplit.forEach(function(item){
        for(var i = 0;i < numberList.length;i++){
            if(numberList[i].number == item){
                click(numberList[i].numberItem.centerX(), numberList[i].numberItem.centerY());
                sleep(500);
                break;
            }
        }
    });
    sleep(1000);
    
    /* 抓取頁面元件 */
    page = null, findSwitch = false;
    for(var i = 0;i < 10;i++){
        systemObject.PageItemList = [], loginList = null;
        page = className("android.widget.FrameLayout").findOnce();
        if(page != null && text("Basic").exists()){
            getPageItemList(page, systemObject.PageItemList);
            findSwitch = true;
            break;
        }
        sleep(1000);
    }
    if(!findSwitch){
        writeLog("空的");
        return;
    }

    ButtonList = [], TextViewList = [], TextViewNumList = [], EditTextList = [], c = 0, numberList = [], number = ["1","2","3","4","5","6","7","8","9","0"];
    systemObject.PageItemList.forEach(function(item){
        if(item.text() != ""){
            if(TestNum(item.text().replace(/ /g,""))){
                TextViewList.push(item);
            }
        }
        else if(item.className() == "android.widget.Button"){
            ButtonList.push(item);
        }
    });

    /* 抓取頁面元件 */
    page = null, findSwitch = false;
    for(var c = 0;c < 3;c++){
        for(var i = 0;i < 10;i++){
            systemObject.PageItemList = [], loginList = null;
            page = className("android.widget.FrameLayout").findOnce();
            if(page != null && text("Smart OTP").exists()){
                getPageItemList(page, systemObject.PageItemList);
                findSwitch = true;
                break;
            }
            sleep(1000);
        }
        if(!findSwitch){
            writeLog("空的");
            return;
        }
    
        TextViewList = [];
        var sleeptemp, sleepSwitch = false;
        systemObject.PageItemList.forEach(function(item){
            if(item.text() != ""){
                /* 抓取到秒數，如果小於5秒就等下一個OTP碼 */
                if(item.text().indexOf("OTP will be updated after") > -1){
                    var temp = item.text();
                    var tempArray = temp.split(" ");
                    sleeptemp = Number(tempArray[tempArray.length - 1 ].replace(/[^0-9]/g,""));                    
                    if(sleeptemp <= 5){
                        sleepSwitch = true;
                    }
                }
                if(TestNum(item.text().replace(/ /g,""))){
                    TextViewList.push(item);
                }
            }
        });
        if(!sleepSwitch){
            break;
        }
        if(sleepSwitch){
            sleep(1000 * (sleeptemp + 1));
            continue;
        }
    }
    
    ButtonList[0].click();
    
    systemObject.order.OTP = TextViewList[0].text().replace(/ /g,"");
    log("擷取的OTP为:" + systemObject.order.OTP);
}


/* 回到快付 APP */
function closeRun(){
    var itemString = "Button";
    var ButtonList = className(itemString).untilFind();
    var BackSwitch = false;

    if(systemObject.Bank == "2007"){
        if(!ButtonList.empty()){
            if(ButtonList.length >= 2){
                ButtonList[1].click();
                BackSwitch = true;
            }
        }
    
        if(!BackSwitch){
            for(let i = 0; i < 3; i++){
                back();
                sleep(2000);
            }
        }
        sleep(3000);
    }

    /*判斷是否成功開啟*/
    var quickSwitch = false;
    recents();
    sleep(1000);
    
    /*先嘗試開最新設定的包名*/
    try{
        if(launch("com.transpayget")){
            sleep(2000);
            quickSwitch = true;
        }
    }
    catch(e){
        writeLog("沒有這個app");
    }
    if(quickSwitch){
        itemString = "包名資訊";
        if(text(itemString).findOne(2000) == null){
            itemString = "開始監聽";
            if(text(itemString).findOne(2000) != null){
                click(itemString);
                sleep(1000);
            }
        }
    }
    else{
        /*沒有就嘗試開啟"舊版快付APP"*/
        try{
            quickSwitch = false;
            if(launch("com.quickpayv2")){
                sleep(2000);
                quickSwitch = true;
            }
            if(quickSwitch){
                itemString = "包名資訊";
                if(text(itemString).findOne(2000) == null){
                    itemString = "開始監聽";
                    if(text(itemString).findOne(2000) != null){
                        click(itemString);
                        sleep(1000);
                    }
                }       
            }
            else{
                quickSwitch = false;
                if(launch("com.example.myapplication")){
                    sleep(2000);
                    quickSwitch = true;
                }
                
                if(quickSwitch){
                    var startString = "开始执行";
                    if (text(startString).findOne(2000) != null) {
                        text(startString).click();
                        sleep(1000);
                    }
                }
                else{
                    if(systemObject.Bank == "2007"){
                        launch("com.fastacash.tcb");
                    }
                    else if(systemObject.Bank == "1549"){
                        launch("com.vnpay.vpbankonline");
                    }
                    sleep(2000);
                    writeLog("沒有安裝快付APP");
                }
            }
        }
        catch(e){
            writeLog("開啟舊版快付APP失敗" + e);
        }
    }
}

/*擷取彈跳視窗的文字*/
function getDialogText(_list){
    for(var i = 0;i < _list.childCount();i++){
        child = _list.child(i);
        var t = child.text();
        if(t != ""){
            return t;
        }
        return getDialogText(child);
    }
}

/*抓APP中的通知*/
function WaitAppMsg() {
    var tempString = "", tempList;
    for(var i = 0;i < 3;i++){
        var tempList = className("android.app.Dialog").findOnce(), dialogText = "";
        if(tempList != null){
            dialogText = getDialogText(tempList);
            if(dialogText.indexOf("Tk") > -1 || dialogText.indexOf("TK") > -1){
                tempString = dialogText;
            }
        }
        if(tempString != ""){
            reOrderSend(tempString);
            break;
        }
        sleep(1000);
    }
    if (text("Skip").exists()) {
        text("Skip").click();
        sleep(1000);
    }
    else if (text("Close").exists()){
        text("Close").click();
        sleep(1000);
    }
}

function waitEnd(){
    for(var overNum = 0; overNum < 30; overNum++){
        /* 組合資料 */
        var sendData = {
            id : systemObject.UUID, 
            rand : random(1111111111, 9999999999),
            transactionID : systemObject.order.transactionID,
        };
        var jsonString = JSON.stringify(sendData);
        var encryptString = Encrypt(jsonString);

        /* 發送資料 */
        var result = HttpPost(encryptString, "sendAppOtpEnd");

        if(result["status"] == 10000){
            return;
        }
        sleep(2000);
    }
}

/* 等待load結束(TCB用) */
function waitBlock(_time){
    for(var i = 1;i <= _time;i++){
        tempList = className("android.widget.Image").find();
        if(tempList.empty()){
            sleep(1000);
            return true;
        }
        sleep(1000);
    }
    return false;
}

/*發送通知內訂單訊息*/
function reOrderSend(_string){
    var appMsg = threads.start(function(){
        sendData = {
            id : systemObject.UUID,
            name : "F@st Mobile",
            txt : _string
        };
        var jsonString = JSON.stringify(sendData);
        var encryptString = Encrypt(jsonString);
        var result = HttpPost(encryptString, "sendMsgv2");
    });
}


/*共用函式*/
/*判斷數字*/
function TestNum(_num){
    if(isNaN(_num)){
        return false;
    }
    else{
        return true;
    }
}

/* 使用函数的方式進行定義 */
function dateFormat(fmt,date){
    var o = {
        "M+" : date.getMonth()+1,                 /*月份*/
        "d+" : date.getDate(),                    /*日*/
        "h+" : date.getHours(),                   /*小時*/
        "m+" : date.getMinutes(),                 /*分*/
        "s+" : date.getSeconds(),                 /*秒*/
        "q+" : Math.floor((date.getMonth()+3)/3), /*季度*/
        "S"  : date.getMilliseconds()             /*毫秒*/
    };
    if(/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

/* 寫log檔 */
function writeLog(_string){
    systemObject.logName = systemObject.basePath + systemObject.logPath + "/" + dateFormat("MM-dd hh", (new Date())) + ".txt";
        if(!files.exists(systemObject.logName)){
            files.create(systemObject.logName);
        }
        files.append(systemObject.logName, (dateFormat("dd hh:mm:ss", (new Date())) + " - " + _string + "\n"));
}

/* 擷取頁面的所有元件 */
function getPageItemList(_list, _saveList){
    for(var i = 0;i < _list.childCount();i++){
        if(_list.child(i).childCount() <= 0){
            _saveList.push(_list.child(i));
        }
        if(_list.child(i).childCount() > 0){
            getPageItemList(_list.child(i), _saveList);
        }
    }
}

/*讀取設定檔*/
function LoadConfig(){
    /*判斷讀取設定檔的關鍵字*/
    var configCheck = false;
    if(systemObject.filetext.indexOf("\r\n") <= 0){
        if(systemObject.filetext.indexOf("\n") > -1){
            configCheck = true;
        }
    }
    if(configCheck){
        systemObject.filetextSplitString = systemObject.filetext.split("\n");
    }
    else{
        systemObject.filetextSplitString = systemObject.filetext.split("\r\n");
    }
    systemObject.Bank = systemObject.filetextSplitString[4].replace("bank:","");
}

/* 發送 Http */
function HttpPost(_params, _path) {
    var result = http.postJson(systemObject.Url + _path, {
        params: _params
    });

    result = result.body.string();
    var resultJson = JSON.parse(result);
    return resultJson;
}

/* 加密 */
function Encrypt(_string){    
    var key = CryptoJS.enc.Utf8.parse(systemObject.Key); 
    var iv = CryptoJS.enc.Utf8.parse(systemObject.Iv); 
    srcs = CryptoJS.enc.Utf8.parse(_string);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}

/* 解密 */
function Decrypt(_string){ 
    var key = CryptoJS.enc.Utf8.parse(systemObject.Key); 
    var iv = CryptoJS.enc.Utf8.parse(systemObject.Iv); 
    var decrypt = CryptoJS.AES.decrypt(_string, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });    
    return decrypt.toString(CryptoJS.enc.Utf8); 
}

/* AES加解密函式 */
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();