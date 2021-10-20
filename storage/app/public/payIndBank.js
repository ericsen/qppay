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

    /*讀取資料的共用開關*/
    switchAjax : true,
    /*讀取資料的進度條*/
    loadingBarNum : 0,

    /*登入 OTP 切換器*/
    loginOtpSwitch: true,

    /*定時撈取訂單狀態*/
    switchDead : true,
    timeDead   : 0,
    /*訂單時間*/
    clockTime     : 0,
    clockInterval : null,

    /*OTP 交易代碼 快速複製*/
    clipboardOtpOrderID : null,
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
            $(".showBank").hide();
            $("#bankLogoBox").html('<img src="./payAppy/images/' + mainObject.bank + '.png" id="img' + mainObject.bank + '" class="bankImgStyle my-2">');
            $(".showLogin").fadeIn(mainObject.pageShowSpeed, function(){
                stepBarNum();
                stopLoading();
                mainObject.switchAjax = true;
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
        var data = {
            id       : id,
            account  : $("#account").val(),
            password : $("#password").val()
        };

        RaySys.AJAX.Send(data, "/ajax/sendAccount", "sendAccountSu", "ajaxNetworkError");
    }
}
/*登入 - 成功送出 - 持續撈取*/
function sendAccountSu(_data){
    ajaxReError(_data, function(){
        /*設定讀取時間*/
        mainObject.loadingTime = mainObject.baseLoadingTime;
        mainObject.switchAjax = true;
    });
}

/***************************** 確認到底該給誰 *****************************/
/*等待取得回應 - 持續撈取*/
function checkRunStatus(){
    if(mainObject.switchAjax){
        mainObject.switchAjax = false;

        RaySys.AJAX.Send({id :id}, "/ajax/getOrderStatus", "checkRunStatusSu", "ajaxNullError");
    }
}
function checkRunStatusSu(_data){
    if(parseInt(_data.ResultJSON.data.status) == 41){
        loadingShowFun(_data, false, function(){
            mainObject.loadingTime = -1;

            mainObject.stepNum = 5;
            $(".showLogin, .showLoginOtp").fadeOut(mainObject.pageHideSpeed, function(){
                $(".showOtp").fadeIn(mainObject.pageShowSpeed, function(){
                    stepBarNum();
                    stopLoading();
                    mainObject.switchAjax = true;
                });
            });
        });
    }
    else{
        loadingShowFun(_data, false, function(){
            mainObject.loadingTime = -1;

            mainObject.stepNum = 3;
            $(".showLogin").fadeOut(mainObject.pageHideSpeed, function(){
                $(".showLoginOtp").fadeIn(mainObject.pageShowSpeed, function(){
                    stepBarNum();
                    stopLoading();
                    mainObject.switchAjax = true;
                });
            });
        });
    }
}

/***************************** 加入收款人 OTP *****************************/
/*送出加入收款人 OTP*/
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
    }
    else{
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

        mainObject.stepNum     = 6;

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
            if(mainObject.stepNum != 2){
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
            if(mainObject.stepNum != 5){
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
        /*加入收款人的OTP*/
        case 51:
            if(mainObject.stepNum != 2){
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
        /*加入收款人 OTP 錯誤*/
        case 52:
            overError("errorAddPayeeOTP");
            break;
        /*加入收款人 OTP 驗證失敗*/
        case 53:
            overError("errorAddPayeeOtpCheck");
            break;

        /*OTP 錯誤*/
        case 42:
            overError("errorOtp");
            break;
        /*OTP 驗證失敗*/
        case 43:
            overError("errorOtpCheck");
            break;

        /*添加收款人中*/
        case 95:
            mainObject.stepNum = 4;
            stepBarNum();
            overError("waitAddPayee");
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
        case 201:
            showError(errorMsg[mainObject.lang]["noOrder"]);
            break;
        case 202:
            showError(errorMsg[mainObject.lang]["orderClose"]);
            break;
        case 203:
            showError(errorMsg[mainObject.lang]["timeOut"]);
            break;
        case 9595:
            overError("waitAddPayee");
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
            $(".stepTitle .in").html("1. कृपया एक बैंक चुनें");
        break;
        case 2:
            $(".stepTitle .en").html("2. Please login to your bank account");
            $(".stepTitle .ch").html("2. 請登錄銀行帳號");
            $(".stepTitle .in").html("2. कृपया अपने बैंक खाते में प्रवेश करें");
        break;
        case 3:
            $(".stepTitle .en").html("3. Obtain and add payee OTP");
            $(".stepTitle .ch").html("3. 獲取添加收款人OTP");
            $(".stepTitle .in").html("3. प्राप्त करें और आदाता ओटीपी जोड़ें");
        break;
        case 4:
            $(".stepTitle .en").html("4. Successfully joined the payee");
            $(".stepTitle .ch").html("4. 成功加入收款人");
            $(".stepTitle .in").html("4. सफलतापूर्वक भुगतानकर्ता में शामिल हो गया");
        break;
        case 5:
            $(".stepTitle .en").html("5. Obtain OTP number");
            $(".stepTitle .ch").html("5. 獲取OTP");
            $(".stepTitle .in").html("5. OTP प्राप्त करें");
        break;
        case 6:
            $(".stepTitle .en").html("6. Transaction completed");
            $(".stepTitle .ch").html("6. 交易完成");
            $(".stepTitle .in").html("6. लेन-देन पूरा");
        break;
    }
    $("#stepBar").css("width", (16.66 * mainObject.stepNum) + "%").html(mainObject.stepNum + "／6");
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
            case 3:
                setLoadingTime();
                if(mainObject.loadingTime % 2 == 0){
                    checkRunStatus();
                }
            break;
            case 5:
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
            '<h2 class="lang">' + errorMsg[mainObject.lang][_langCode] + '</h2>'+
        '</div>');
    $(".lang").hide();
    $("." + mainObject.lang).show();

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

/*彈跳錯誤*/
function showError(_msg){swal({title:errorMsg[mainObject.lang]["errorTitle"],type:"error",text:_msg,confirmButtonText:errorMsg[mainObject.lang]["okBtn"],});}

/*讀取中的遮擋*/
function startLoading(){$("body").loading({message:'<span class="ml-3" style="font-size:2rem;" id="loadingText"></span><br><img src="./payAppy/images/loader.gif" id="loadingGif"><br><span class="ml-3" style="font-size: 3.5rem;" id="loadingTime"></span><br><div class="progress" id="loadingBar"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width:0;" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" id="loadingBarBody"></div></div>'});}
function stopLoading(){$("#loadingText").html("");$("body").loading('stop');}

/*複製完成*/
function copyOk(){swal({title: "",type: "success",timer: 800,showConfirmButton: false});}