var mainObject = {
    /*語系*/
    lang: '@defaultLang',
    debug: @debug,
    /*目前執行階段*/
    stepNum : 0,
    /*選擇的銀行*/
    bankID   : null,
    bankName : null,
    /*頁面切換速度*/
    pageShowSpeed : 300,
    pageHideSpeed : 200,
    /*等待時間*/
    loadingTime     : -1,
    baseLoadingTime : 120,
    bidvLoadingTime : 180,
    vcbLoadingTime  : 180,

    /*使用 OTPID 的銀行*/
    useOtpID   : [2001, 2006, 2007, 2011, 2020],
    /*使用 OTPID 的類型*/
    useOtpIPType : [2, 3],

    /*讀取資料的共用開關*/
    switchAjax : true,
    /*讀取資料的進度條*/
    loadingBarNum : 0,

    /*登入 OTP 切換器*/
    loginOtpSwitch: true,

    /*如果幾次之後撈不到就跳掉*/
    otpOrderIDNum : 0,

    /*定時撈取訂單狀態*/
    switchDead : true,
    timeDead   : 0,
    /*訂單時間*/
    clockTime     : 0,
    clockInterval : null,

    /*OTP 交易代碼 快速複製*/
    clipboardOtpOrderID : null,

    /*OTP 類型*/
    otpType : 0,
};

$(document).ready(function(){

    /*是否已選定銀行*/
    mainObject.bank = bankID;

    /*切換語言*/
    $("#contentSuccessBox").hide();
    $(".lang").hide();
    $("." + mainObject.lang).show();

    /*選擇銀行*/
    $(".bankImgBox").click(function(){
        $(".bankImgBox").removeClass("bankImgBoxSelect");
        $(this).addClass("bankImgBoxSelect");
        mainObject.bank     = $(this).data("bank");
        mainObject.bankName = bank[mainObject.bank];
    });

    /*獨立計時器*/
    mainObject.clockTime = time;
    if(mainObject.clockTime >= 1){
        mainObject.clockInterval = setInterval(clockOnce, 1000);
    }

    stepBarNum();

    RaySys.Bootstrap.UseSpan();

    /*如果已經選過銀行*/
    if(mainObject.bank != "" && mainObject.bank != 0){
        var _data = { ResultJSON: { msg: 0 } };
        bankCheckSu(_data);
    }
});


/***************************** 選 擇 銀 行 *****************************/
function sendSelectBank(){
    if(mainObject.bank == null){
        showError(errorMsg[mainObject.lang]["noBank"]);
        return false;
    }
    /*啟動讀取遮罩*/
    startLoading();
    $("#loadingBar").hide();

    if(mainObject.switchAjax){
        mainObject.switchAjax = false;
        var data = {
            id    : id,
            bank  : mainObject.bank,
            match : 1
        };
        RaySys.AJAX.Send(data, "/ajax/bankCheck", "bankCheckSu", "ajaxNetworkError");
    }
}
function bankCheckSu(_data){
    ajaxReError(_data, function(){
        mainObject.stepNum = 2;
        $("#showBankBox").fadeOut(mainObject.pageHideSpeed, function(){
            /*切換 OTP 選項*/
            switch(parseInt(mainObject.bank)){
                case 1549:
                    $("#otpTypeSms, #otpTypeSmart").show();
                    $("#otpType").val(1);
                break;
                case 2001:
                    $("#otpTypeQr").show();
                    $("#otpType").val(3);
                break;
                case 2002:
                    $("#otpTypeSms").show();
                    $("#otpType").val(1);
                break;
                case 2006:
                    $("#otpTypeSms, #otpTypeSmart").show();
                    $("#otpType").val(1);
                break;
                case 2007:
                    $("#otpTypeQr").show();
                    $("#otpType").val(3);
                break;
                case 2008:
                    $("#otpTypeSms, #otpTypeSmart").show();
                    $("#otpType").val(1);
                break;
                case 2011:
                    $("#otpTypeSms, #otpTypeQr").show();
                    $("#otpType").val(1);
                break;
                case 2020:
                    $("#otpTypeSmart, #otpTypeApp").show();
                    $("#otpType").val(2);
                break;
            }
            $(".lang").hide();
            $("." + mainObject.lang).show();

            $(".showBank").hide();
            $("#bankLogoBox").html('<img src="./payAppy/images/' + mainObject.bank + '.png" id="img' + mainObject.bank + '" class="bankImgStyle my-2">');
            $(".showLogin").fadeIn(mainObject.pageShowSpeed, function(){
                stepBarNum();
                stopLoading();
                mainObject.switchAjax = true;

                /*VCB 提示訊息*/
                if(mainObject.bank == 2006){
                    $("#VCBMsgShow").show();
                }
            });
        });
        return;
    });
}


/***************************** 登 入 *****************************/
function sendLogin(){
    if($("#account").val().length <= 0){
        showError(errorMsg[mainObject.lang]["noAccount"]);
        return false;
    }
    if($("#password").val().length <= 0){
        showError(errorMsg[mainObject.lang]["noPassword"]);
        return false;
    }
    /*啟動讀取遮罩*/
    startLoading();

    if(mainObject.switchAjax){
        mainObject.switchAjax = false;
        mainObject.otpType = parseInt($("#otpType").val());
        var data = {
            id       : id,
            account  : $("#account").val(),
            password : $("#password").val(),
            otpType  : $("#otpType").val()
        };

        /*針對 VPB 多一個步驟的切換*/
        if(mainObject.loginOtpSwitch && mainObject.bank == 1549){
            RaySys.AJAX.Send(data, "/ajax/sendAccount", "openLoginOTP", "ajaxNetworkError");
        }
        else{
            RaySys.AJAX.Send(data, "/ajax/sendAccount", "sendAccountSu", "ajaxNetworkError");
        }
    }
}
/*登入 - 成功送出 - 持續撈取*/
function sendAccountSu(_data){
    ajaxReError(_data, function(){
        /*設定讀取時間*/
        mainObject.loadingTime = mainObject.baseLoadingTime;
        if(mainObject.bank == 2001){
            mainObject.loadingTime = mainObject.bidvLoadingTime;
        }
        else if(mainObject.bank == 2006){
            mainObject.loadingTime = mainObject.vcbLoadingTime;
        }
        mainObject.switchAjax = true;
    });
}
/*登入 - 等待取得回應 - 持續撈取*/
function accountReCheck(){
    if(mainObject.switchAjax){
        mainObject.switchAjax = false;

        RaySys.AJAX.Send({id :id}, "/ajax/getOrderStatus", "accountReCheckSu", "ajaxNullError");
    }
}
function accountReCheckSu(_data){
    loadingShowFun(_data, false, function(){
        mainObject.loadingTime = -1;

        /* 針對 CTG 多一個步驟*/
        if(mainObject.loginOtpSwitch && mainObject.bank == 2002){
            /*取得驗證碼圖片*/
            RaySys.AJAX.Send({id :id}, "/ajax/getLoginPic", "getLoginPicSu", "ajaxNullError");
        }
        else{
            mainObject.stepNum = 3;

            $(".showLogin, .showLoginOtp, .showLoginPic").fadeOut(mainObject.pageHideSpeed, function(){
                $(".showOtp").fadeIn(mainObject.pageShowSpeed, function(){
                    stepBarNum();
                    stopLoading();

                    /*是否使用 OTP 交易代碼*/
                    if(mainObject.useOtpID.indexOf(mainObject.bank) !== -1 && mainObject.useOtpIPType.indexOf(mainObject.otpType) !== -1){
                        otpOrderIDReCheck();
                    }
                    /*2020 STB 專屬*/
                    else if(mainObject.bank == 2020 && mainObject.otpType == 4){
                        $("#otpEnterCode").hide();
                        $("#otpSTB").show();
                        /*設定讀取時間*/
                        mainObject.loadingTime = mainObject.baseLoadingTime;
                    }
                    mainObject.switchAjax = true;
                });
            });
        }
    });
}

/***************************** 登 入 圖片驗證碼 *****************************/
/*取得圖片驗證碼*/
function getLoginPicSu(_data){
    /* 如果沒有驗證碼就離開 */
    if(_data.ResultJSON.data.images == ""){
        mainObject.loginOtpSwitch = false;
        sendAccountSu({ResultJSON:{msg:0}});
    }

    mainObject.stepNum = 2.5;
    $(".showLogin").fadeOut(mainObject.pageHideSpeed, function(){
        $(".showLoginPic").fadeIn(mainObject.pageShowSpeed, function(){
            stepBarNum();
            stopLoading();
            $("#loginPic").prop("src", _data.ResultJSON.data.images);
            mainObject.switchAjax = true;
        });
    });
}
/*刷新圖片驗證碼*/
function reLoginPic(){
    sendLoginPicFun("00000");
}
/*送出圖片驗證碼*/
function sendLoginPic(){
    if($("#loginPicCode").val().length <= 0){
        showError(errorMsg[mainObject.lang]["noPicCode"]);
        return false;
    }
    sendLoginPicFun($("#loginPicCode").val());
}
function sendLoginPicFun(_code){
    /*啟動讀取遮罩*/
    startLoading();
    setLoginPicCode(_code);
}
/*等待機器判斷正確*/
function setLoginPicCode(_code){
    if(mainObject.switchAjax){
        mainObject.switchAjax = false;
        var data = {
            id   : id,
            code : _code,
        };
        RaySys.AJAX.Send(data, "/ajax/setLoginPicCode", "setLoginPicCodeSu", "ajaxNetworkError");
    }
}
function reGetLoginPicCode(){
    if(mainObject.switchAjax){
        mainObject.switchAjax = false;
        RaySys.AJAX.Send({id:id}, "/ajax/getLoginPicRe", "setLoginPicCodeSu", "ajaxNetworkError");
    }
}
function setLoginPicCodeSu(_data){
    /* 0：等待、1：下一步、2：重來*/
    if(_data.ResultJSON.msg == 0){
        setTimeout(function(){
            reGetLoginPicCode();
        }, 2000);
    }
    else if(_data.ResultJSON.msg == 1){
        mainObject.loginOtpSwitch = false;
        sendAccountSu({ResultJSON:{msg:0}});
    }
    else if(_data.ResultJSON.msg == 2){
        getLoginPicSu(_data);
        if($("#loginPicCode").val() != ""){
            $("#loginPicError").show();
            showError(errorMsg[mainObject.lang]["errorCheckCode"]);
        }
        else{
            $("#loginPicError").hide();
        }
        $("#loginPicCode").val("");
    }
    mainObject.switchAjax = true;
}

/***************************** 登 入 OTP *****************************/
/*登入 OTP 啓動式*/
function openLoginOTP(_data){
    ajaxReError(_data, function(){
        mainObject.stepNum = 2.5;
        $(".showLogin").fadeOut(mainObject.pageHideSpeed, function(){
            $(".showLoginOtp").fadeIn(mainObject.pageShowSpeed, function(){
                stepBarNum();
                stopLoading();
            });
        });
        mainObject.switchAjax = true;
    });
}
/*送出登入 OTP*/
function sendLoginOTP(){
    if($("#loginOtp").val().length <= 0){
        showError(errorMsg[mainObject.lang]["noOtp"]);
        return false;
    }
    /*啟動讀取遮罩*/
    startLoading();

    if(mainObject.switchAjax){
        mainObject.switchAjax = false;
        var data = {
            id  : id,
            otp : $("#loginOtp").val(),
        };
        RaySys.AJAX.Send(data, "/ajax/setOtp", "setLoginOtpSu", "ajaxNetworkError");
    }
}
function setLoginOtpSu(_data){
    mainObject.loginOtpSwitch = false;
    sendAccountSu({ ResultJSON: { msg: _data.ResultJSON.msg } });
}


/***************************** OTP *****************************/
/*取得 OTP 交易代碼*/
function otpOrderIDReCheck(){
    if(mainObject.stepNum == 3){
        RaySys.AJAX.Send({id :id}, "/ajax/getOtpOrderID", "getOtpOrderIDSu", "ajaxNullError");
    }
}
function getOtpOrderIDSu(_data){
    if(_data.ResultJSON.data.orderID != ""){
        $("#copyBtn").attr("data-clipboard-text", _data.ResultJSON.data.orderID);
        mainObject.clipboardOtpOrderID = new Clipboard('#copyBtn');
        $("#otpOrderID").val(_data.ResultJSON.data.orderID);
        $(".otpOrderIDBox").show();

        if(mainObject.otpType == 3){
            var qrcodeSize = 200;
            if(mainObject.bank == 2020){
                qrcodeSize = 320;
            }
            $("#otpOrderIDQrcode").html("");
            $("#otpOrderIDQrcode").qrcode({
                width      : qrcodeSize,
                height     : qrcodeSize,
                render     : "canvas",
                typeNumber : -1,
                background : "#ffffff",
                foreground : "#000000",
                text       : _data.ResultJSON.data.orderID
            });
        }
        else{
            $("#otpOrderIDQrcode").hide();
            $("#copyQRCode").hide();
        }

        /*如果 2001 訂單改變表示成功*/
        if(mainObject.bank == 2001 && mainObject.otpType == 3){
            setOtpSu({ ResultJSON: { msg : 0}});
        }
    }
    else{
        mainObject.otpOrderIDNum++;
        if(mainObject.otpOrderIDNum >= 5){
            return;
        }
        setTimeout(function(){
            otpOrderIDReCheck();
        }, 2000);
    }
}

/*送出 OTP*/
function sendOTP(){
    if($("#otp").val().length <= 0){
        showError(errorMsg[mainObject.lang]["noOtp"]);
        return false;
    }
    /*啟動讀取遮罩*/
    startLoading();
    $("#loadingBar").hide();

    if(mainObject.switchAjax){
        mainObject.switchAjax = false;
        var data = {
            id  : id,
            otp : $("#otp").val(),
        };
        RaySys.AJAX.Send(data, "/ajax/setOtp", "setOtpSu", "ajaxNetworkError");
    }
}
/*OTP - 成功送出 - 持續撈取*/
function setOtpSu(_data){
    ajaxReError(_data, function(){
        /*設定讀取時間*/
        mainObject.loadingTime = mainObject.baseLoadingTime;
        /*if(mainObject.bank == 2001){
            mainObject.loadingTime = mainObject.bidvLoadingTime;
        }*/
        mainObject.switchAjax = true;
    });
}
/*OTP - 等待取得回應 - 持續撈取*/
function otpReCheck(){
    if(mainObject.switchAjax){
        mainObject.switchAjax = false;

        /*因為都送出OTP了，不用管訂單是否超時，所以強制停止計時器*/
        if(mainObject.clockTime <= 60 && mainObject.clockTime >= 0){
            mainObject.clockTime = -10;
        }

        RaySys.AJAX.Send({id :id}, "/ajax/getOrderStatus", "otpReCheckkSu", "ajaxNullError");
    }
}
function otpReCheckkSu(_data){
    loadingShowFun(_data, false, function(){
        mainObject.loadingTime = -1;

        mainObject.stepNum     = 4;

        /*強制停止計時器*/
        mainObject.clockTime   = -10;
        $(".showOtp").fadeOut(mainObject.pageHideSpeed, function(){
            $(".showOver").fadeIn(mainObject.pageShowSpeed, function(){
                mainObject.switchAjax = true;
                stepBarNum();
                stopLoading();
                setTimeout(function(){
                    checkOrder();
                }, 5000);
            });
        });
    });
}


/***************************** 訂 單 結 束 *****************************/
function checkOrder(){
    if(mainObject.switchAjax){
        mainObject.switchAjax = false;
        RaySys.AJAX.Send({id :id}, "/ajax/getOrderStatus", "checkOrderSu", "ajaxNullError");
    }
}
function checkOrderSu(_data){
    loadingShowFun(_data, false, function(){
        clearInterval(mainObject.clockInterval);
        $(".showOver").fadeOut(mainObject.pageHideSpeed, function(){
            $(".showSuccess").fadeIn(mainObject.pageShowSpeed, function(){
                if(linkUrl != ""){
                    setTimeout(function(){
                        window.location.href = linkUrl;
                    }, 5000);
                }
            });
        });
    });
}



/*持續撈取的回傳狀態*/
function loadingShowFun(_data, _switch, _fun){
    var resultData = _data.ResultJSON.data;
    switch(parseInt(resultData.status)){
        case 41:
            if(mainObject.stepNum != 2 && mainObject.stepNum != 2.5){
                /*切換輪詢訂單*/
                if(_switch){
                    mainObject.switchDead = true;
                }
                else{
                    mainObject.switchAjax = true;
                }
                break;
            }
            _fun();
            break;
        case 62:
            if(mainObject.stepNum != 3){
                /*切換輪詢訂單*/
                if(_switch){
                    mainObject.switchDead = true;
                }
                else{
                    mainObject.switchAjax = true;
                }
                break;
            }
            _fun();
            break;
        case 1:
            _fun();
            break;
        /*銀行無法開啟*/
        case 9:
        case 19:
            overError("errorWebBank");
            break;
        /*有可能是無法定位元件*/
        case 29:
        case 39:
        case 49:
        case 59:
            overError("errorWebBankLong");
            break;
        /*帳號密碼錯誤*/
        case 12:
            overError("errorLoginAccount");
            break;
        /*驗證錯誤*/
        case 13:
            overError("errorCheckCode");
            break;
        /*餘額不足*/
        case 22:
            overError("errorNoMorePoints");
            break;
        /*轉帳資料錯誤*/
        case 23:
            overError("errorTransData");
            break;
        /*登入 OTP 錯誤*/
        case 52:
            overError("errorLoginOTP");
            break;
        /*登入 OTP 驗證失敗*/
        case 53:
            overError("errorLoginOtpCheck");
            break;

        /*OTP 錯誤*/
        case 42:
            overError("errorOtp");
            break;
        /*OTP 驗證失敗*/
        case 43:
            overError("errorOtpCheck");
            break;
        /*沒有此 OTP 類型*/
        case 44:
            overError("errorOtpType");
            break;

        /*登入驗證碼*/
        case 51:
            _fun();
            break;

        /*無法開啟*/
        case 91:
            overError("errorWebBankCantOn");
            break;
        /*意外關閉*/
        case 97:
        case 98:
            overError("errorWebBankOff");
            break;
        /*訂單超時*/
        case 99:
        case 203:
            overError("timeOut");
            break;

        /*訂單強制關閉*/
        case 202:
            overError("orderClose");
            break;

        /*表示目前狀態*/
        case 10:
        case 11:
        case 21:
        case 31:
        case 61:
        default:
            /*目前狀態的進度條*/
            if(parseInt(resultData.status) == 10){
                $("#loadingBarBody").css("width", "25%").html("25%");
            }
            else if(parseInt(resultData.status) == 11){
                $("#loadingBarBody").css("width", "50%").html("50%");
            }
            else if(parseInt(resultData.status) == 21){
                $("#loadingBarBody").css("width", "80%").html("80%");
            }
            else if(parseInt(resultData.status) == 31){
                $("#loadingBarBody").css("width", "95%").html("95%");
            }

            /*$("#loadingText").html(errorMsg[mainObject.lang]["showStatus_" + resultData.status]);*/
            if(mainObject.stepNum == 4){
                setTimeout(function(){
                    checkOrder();
                }, 2000);
            }

            /*切換輪詢訂單*/
            if(_switch){
                mainObject.switchDead = true;
            }
            else{
                mainObject.switchAjax = true;
            }
            break;
    }
}
/*網路錯誤*/
function ajaxNetworkError(_data){
    ajaxReError(_data, function(){ return false; });
}
/*錯誤也無所謂*/
function ajaxNullError(_data){
    mainObject.switchAjax = true;
}
/*統一輸出錯誤*/
function ajaxReError(_data, _fun){
    switch(parseInt(_data.ResultJSON.msg)){
        case 0:
            _fun();
            return;
            break;
        case 1:
            showError(errorMsg[mainObject.lang]["noBank"]);
            break;
        case 4:
            showError(errorMsg[mainObject.lang]["noMoneyRowRepair"]);
            break;
        case 9:
            showError(errorMsg[mainObject.lang]["noOtp"]);
            break;
        case 129:
            showError(errorMsg[mainObject.lang]["noPicCode"]);
            break;
        case 201:
            showError(errorMsg[mainObject.lang]["noOrder"]);
            break;
        case 202:
            showError(errorMsg[mainObject.lang]["orderClose"]);
            break;
        case 203:
            showError(errorMsg[mainObject.lang]["timeOut"]);
            break;
        case 999001:
            showError(errorMsg[mainObject.lang]["noMoneyRow"]);
            break;
        case 999002:
            showError(errorMsg[mainObject.lang]["noMoneyBankRow"]);
            break;
        case 111053:
            showError(errorMsg[mainObject.lang]["noBalanceMoney"]);
            break;
        case 111054:
            showError(errorMsg[mainObject.lang]["noBalanceMoneyMachine"]);
            break;
        default:
            showError(errorMsg[mainObject.lang]["networkError"]);
            break;
    }

    stopLoading();
    mainObject.switchAjax = true;
}

/*執行步驟*/
function stepBarNum(){
    switch(mainObject.stepNum){
        case 1:
            $(".stepTitle .en").html("1. Please select bank.");
            $(".stepTitle .ch").html("1. 请选择银行");
            $(".stepTitle .vn").html("1. Vui lòng chọn một ngân hàng.");
        break;
        case 2:
            $(".stepTitle .en").html("2. Please login to your bank account");
            $(".stepTitle .ch").html("2. 請登錄銀行帳號");
            $(".stepTitle .vn").html("2. Vui lòng đăng nhập tài khoản ngân hàng");
        break;
        case 2.5:
            if(mainObject.bank == 1549){
                $(".stepTitle .en").html("2.5 Obtain login OTP number");
                $(".stepTitle .ch").html("2.5 獲取登入OTP");
                $(".stepTitle .vn").html("2.5 Lấy mã Đăng nhập OTP");
            }
            else{
                $(".stepTitle .en").html("2.5 Enter the check code");
                $(".stepTitle .ch").html("2.5 輸入驗證碼");
                $(".stepTitle .vn").html("2.5 Nhập mã kiểm tra");
            }
        break;
        case 3:
            $(".stepTitle .en").html("3. Obtain OTP number");
            $(".stepTitle .ch").html("3. 獲取OTP");
            $(".stepTitle .vn").html("3. Lấy mã OTP");
        break;
        case 4:
            $(".stepTitle .en").html("4. Transaction completed");
            $(".stepTitle .ch").html("4. 交易完成");
            $(".stepTitle .vn").html("4. Giao dịch hoàn thành ");
        break;
    }
    $("#stepBar").css("width", (25 * mainObject.stepNum) + "%").html(mainObject.stepNum + "／4");
}

/*定時撈取訂單*/
function clockDead(){
    if(mainObject.switchDead){
        mainObject.switchDead = false;
        RaySys.AJAX.Send({id :id}, "/ajax/getOrderStatus", "clockDeadSu", "clockDeadEr");
    }
}
function clockDeadSu(_data){
    if(!mainObject.switchDead){
        loadingShowFun(_data, true, function(){mainObject.switchDead = true;});
    }
}
function clockDeadEr(_data){
    if(!mainObject.switchDead){
        mainObject.switchDead = true;
    }
}

/*訂單主要計時器*/
function clockOnce(){
    /*定時撈取訂單*/
    if(mainObject.timeDead >= 10){
        clockDead();
        mainObject.timeDead = 0;
    }
    else{
        mainObject.timeDead++;
    }

    /*執行各步驟*/
    if(mainObject.loadingTime != -1){
        switch(mainObject.stepNum){
            case 2:
            case 2.5:
                setLoadingTime();
                if(mainObject.loadingTime % 2 == 0){
                    accountReCheck();
                }
            break;
            case 3:
                setLoadingTime();
                if(mainObject.loadingTime % 2 == 0){
                    otpReCheck();
                }
            break;
        }
    }
    else if(mainObject.loadingTime > 0){
        mainObject.loadingTime--;
    }
    /*專門用於結束撈訂單*/
    else if(mainObject.loadingTime == -1 && mainObject.stepNum == 4){
        checkOrder();
    }

    /*訂單倒數*/
    /* -10 等於強制暫停 */
    if(mainObject.clockTime != -10){
        if(mainObject.clockTime <= 0){
            clearInterval(mainObject.clockInterval);
            mainObject.clockTime = 0;
            overError("timeOut");
        }
        var min = parseInt(mainObject.clockTime/60);
        var sec = parseInt(mainObject.clockTime-(min*60));
        if(min<10){min="0"+min;}
        if(sec<10){sec="0"+sec;};
        $("#timeClock").html("："+min+":"+sec);
        mainObject.clockTime--;
    }
}


/***************************** 共 用 函 數 *****************************/

/*失敗在頁面顯示狀態*/
function overError(_langCode){
    clearInterval(mainObject.clockInterval);

    $("#stepBox").remove();
    $(".showPanel, .showErrorPanel").remove();
    $(".card-footer").remove();
    $("#cardBox").html($("#cardBox").html() +
        '<div class="card-body showErrorPanel">'+
            '<h3 class="lang">' + errorMsg[mainObject.lang][_langCode] + '</h3>'+
        '</div>');
    /*$(".lang").hide();*/
    /*$("." + mainObject.lang).show();*/

    stopLoading();
}

/*讀取頁面的轉圈圈*/
function setLoadingTime(){
    if(mainObject.loadingTime <= 0){
        clearInterval(mainObject.clockLodingTimeInterval);
        if(mainObject.stepNum == 2){
            overError("errorBusy");
        }
        else{
            overError("errorTransaction");
        }
    }
    if(mainObject.loadingTime > 0){
        mainObject.loadingTime--;
        $("#loadingTime").html(mainObject.loadingTime);
    }
}

function dd(_msg){if(mainObject.debug){console.log(_msg);}}

function downloadImage(src) {
    var $a = $("<a></a>").attr("href", src).attr("download", (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000) + ".jpg");
    $a[0].click();
}

/*彈跳錯誤*/
function showError(_msg){swal({title:errorMsg[mainObject.lang]["errorTitle"],type:"error",text:_msg,confirmButtonText:errorMsg[mainObject.lang]["okBtn"],});}

/*讀取中的遮擋*/
function startLoading(){$("body").loading({message:'<span class="ml-3" style="font-size:2rem;" id="loadingText"></span><br><img src="./payAppy/images/loader.gif" id="loadingGif"><br><span class="ml-3" style="font-size: 3.5rem;" id="loadingTime"></span><br><div class="progress" id="loadingBar"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width:0;" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" id="loadingBarBody"></div></div>'});}
function stopLoading(){$("#loadingText").html("");$("body").loading('stop');}

/*複製完成*/
function copyOk(){swal({title: "",type: "success",timer: 800,showConfirmButton: false});}