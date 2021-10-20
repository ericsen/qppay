
var mainObject = {
    lang                     : 'vn',
    stepNum                  : 0,
    clockLodingInterval      : null,
    clockLodingSwitch        : false,
    clockLifeInterval        : null,
    clockLoadingTimeInterval : null,
    clockDeadTimeInterval    : null,
    loadingTime              : 90,
    clockTime                : 0,
    pageShowSpeed            : 300,
    pageHideSpeed            : 200,
    switchBank               : true,
    switchLogin              : true,
    switchOtp                : true,
    switchDead               : false,
    clipboardOtpOrderID      : null,

    bankID   : null,
    bankName : null,
};


$(document).ready(function(){

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

    /*選擇銀行 - 送出*/
    $("#bankSelectBtn").click(function(){
        if(mainObject.bank == null){
            showError(errorMsg[mainObject.lang]["noBank"]);
            return false;
        }

        startLoading();

        if(mainObject.switchBank){
            mainObject.switchBank = false;
            var data = {
                id    : id,
                bank  : mainObject.bank,
                match : 1
            };
            RaySys.AJAX.Send(data, "/ajax/bankCheck", "bankCheckSu", "ajaxNetworkError");
            setTimeout(function(){
                mainObject.switchBank = true;
            }, 1000);
        }
    });

    /*登入按鈕*/
    $("#loginBtn").click(function(){
        if($("#account").val().length <= 0){
            showError(errorMsg[mainObject.lang]["noAccount"]);
            return false;
        }
        if($("#password").val().length <= 0){
            showError(errorMsg[mainObject.lang]["noPassword"]);
            return false;
        }

        startLoading();

        if(mainObject.switchLogin){
            mainObject.switchLogin = false;
            var data = {
                id       : id,
                account  : $("#account").val(),
                password : $("#password").val()
            };
            RaySys.AJAX.Send(data, "/ajax/sendAccount", "sendAccountSu", "ajaxNetworkError");
            setTimeout(function(){
                mainObject.switchLogin = true;
            }, 1000);
        }
    });

    $("#otpBtn").click(function(){
        if($("#otp").val().length <= 0){
            showError(errorMsg[mainObject.lang]["noOtp"]);
            return false;
        }

        startLoading();

        if(mainObject.switchOtp){
            mainObject.switchOtp = false;
            clearInterval(mainObject.clockDeadTimeInterval);
            var data = {
                id  : id,
                otp : $("#otp").val(),
            };
            RaySys.AJAX.Send(data, "/ajax/setOtp", "setOtpSu", "ajaxNetworkError");
            setTimeout(function(){
                mainObject.switchOtp = true;
            }, 1000);
        }
    });

    mainObject.clockTime = time;
    if(mainObject.clockTime != 0){
        mainObject.clockLifeInterval     = setInterval(clockOnce, 1000);
        mainObject.clockDeadTimeInterval = setInterval(clockDead, 10000);
    }

    stepBarNum();

    RaySys.Bootstrap.UseSpan();
});

function bankCheckSu(_data){
    ajaxReError(_data, function(){
        mainObject.stepNum = 2;
        $("#showBankBox").fadeOut(mainObject.pageHideSpeed, function(){
            $(".showBank").hide();
            $("#showPoints").html(_data.ResultJSON.data.points);
            $("#bankLogoBox").html('<img src="./payAppy/images/' + mainObject.bank + '.png" id="img' + mainObject.bank + '" class="bankImgStyle my-2">');
            $(".showLogin").fadeIn(mainObject.pageShowSpeed, function(){
                stepBarNum();
                stopLoading();
            });
        });
        return;
    });

    stopLoading();
}

function sendAccountSu(_data){
    ajaxReError(_data, function(){
        mainObject.loadingTime              = 90;
        mainObject.clockLoadingTimeInterval = setInterval(setLoadingTime, 1000);

        mainObject.clockLodingInterval = setInterval(accountReCheck, 2000);
        mainObject.clockLodingSwitch   = false;
    });
}

function setOtpSu(_data){
    ajaxReError(_data, function(){
        mainObject.loadingTime              = 90;
        mainObject.clockLoadingTimeInterval = setInterval(setLoadingTime, 1000);

        mainObject.clockLodingInterval = setInterval(otpReCheck, 2000);
        mainObject.clockLodingSwitch   = false;
    });
}

function accountReCheck(){
    if(!mainObject.clockLodingSwitch){
        mainObject.clockLodingSwitch = true;

        RaySys.AJAX.Send({id :id}, "/ajax/getOrderStatus", "accountReCheckSu", "ajaxNullError");
    }
}
function accountReCheckSu(_data){
    if(_data.ResultJSON.data.status == 5){
        clearInterval(mainObject.clockLodingInterval);
        clearInterval(mainObject.clockLoadingTimeInterval);
        mainObject.stepNum = 3;
        $(".showLogin").fadeOut(mainObject.pageHideSpeed, function(){
            $(".showOtp").fadeIn(mainObject.pageShowSpeed, function(){
                stepBarNum();
                stopLoading();

                otpOrderIDReCheck();
            });
        });
    }
    else if(_data.ResultJSON.data.status == 6){
        overError("errorLogin");
    }
    else if(_data.ResultJSON.data.status == 8){
        overError("errorTransaction");
    }
    else{
        mainObject.clockLodingSwitch = false;
    }
}

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

function otpReCheck(){
    if(!mainObject.clockLodingSwitch){
        mainObject.clockLodingSwitch = true;

        if(mainObject.clockTime <= 60 && mainObject.clockTime >= 0){
            clearInterval(mainObject.clockLifeInterval);
            mainObject.clockTime = -1;
        }


        RaySys.AJAX.Send({id :id}, "/ajax/getOrderStatus", "otpReCheckkSu", "ajaxNullError");
    }
}
function otpReCheckkSu(_data){
    if(_data.ResultJSON.data.status == 2){
        clearInterval(mainObject.clockLodingInterval);
        clearInterval(mainObject.clockLoadingTimeInterval);
        mainObject.stepNum = 4;
        $(".showOtp").fadeOut(mainObject.pageHideSpeed, function(){
            $(".showOver").fadeIn(mainObject.pageShowSpeed, function(){
                stepBarNum();
                stopLoading();

                mainObject.clockLodingInterval = setInterval(checkOrder, 2000);
                mainObject.clockLodingSwitch   = false;
            });
        });
    }
    else if(_data.ResultJSON.data.status == 7){
        overError("errorOtp");
    }
    else if(_data.ResultJSON.data.status == 8){
        overError("errorTransaction");
    }
    else{
        mainObject.clockLodingSwitch = false;
    }
}

function checkOrder(){
    RaySys.AJAX.Send({id :id}, "/ajax/getOrderStatus", "checkOrderSu", "ajaxNullError");
}
function checkOrderSu(_data){
    if(_data.ResultJSON.data.status == 1){
        clearInterval(mainObject.clockLodingInterval);
        $(".showOver").fadeOut(mainObject.pageHideSpeed, function(){
            $(".showSuccess").fadeIn(mainObject.pageShowSpeed, function(){
                clearInterval(mainObject.clockLifeInterval);
                if(linkUrl != ""){
                    setTimeout(function(){
                        window.location.href = linkUrl;
                    }, 5000);
                }
            });
        });
    }
    else if(_data.ResultJSON.data.status == 3 || _data.ResultJSON.data.status == 8){
        overError("errorTransaction");
    }
    mainObject.clockLodingSwitch = false;
}

function ajaxNetworkError(_data){
    ajaxReError(_data, function(){ return false; });
}
function ajaxNullError(_data){
    mainObject.clockLodingSwitch = false;
}

function ajaxReError(_data, _fun){
    if(_data.ResultJSON.msg == 1){
        showError(errorMsg[mainObject.lang]["noBank"]);
    }
    else if(_data.ResultJSON.msg == 2){
        showError(errorMsg[mainObject.lang]["noOrder"]);
    }
    else if(_data.ResultJSON.msg == 3){
        showError(errorMsg[mainObject.lang]["orderClose"]);
    }
    else if(_data.ResultJSON.msg == 4){
        showError(errorMsg[mainObject.lang]["noMoneyRowRepair"]);
    }
    else if(_data.ResultJSON.msg == 9){
        showError(errorMsg[mainObject.lang]["noOtp"]);
    }
    else if(_data.ResultJSON.msg == 999001){
        showError(errorMsg[mainObject.lang]["noMoneyRow"]);
    }
    else if(_data.ResultJSON.msg == 999002){
        showError(errorMsg[mainObject.lang]["noMoneyBankRow"]);
    }
    else if(_data.ResultJSON.msg == 111053 || _data.ResultJSON.msg == 111054){
        showError(errorMsg[mainObject.lang]["noBalanceMoney"]);
    }
    else if(_data.ResultJSON.msg == 0){
        _fun();
        return;
    }
    else{
        showError(errorMsg[mainObject.lang]["networkError"]);
    }
    stopLoading();
}

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
        case 3:
            $(".stepTitle .en").html("3. Obtain OTP number");
            $(".stepTitle .ch").html("3. 獲取OTP");
            $(".stepTitle .vn").html("3. Lấy mã OTP");
        break;
        case 4:
            $(".stepTitle .en").html("4.  Transaction completed");
            $(".stepTitle .ch").html("4. 交易完成");
            $(".stepTitle .vn").html("4. Giao dịch hoàn thành ");
        break;
    }
    $("#stepBar").css("width", (25 * mainObject.stepNum) + "%").html(mainObject.stepNum + "／4");
}

function clockOnce(){
    if(mainObject.clockTime == 0){
        overError("timeOut");
    }
    if(mainObject.clockTime == -1){
        return;
    }
    var min = parseInt(mainObject.clockTime/60);
    var sec = parseInt(mainObject.clockTime-(min*60));
    if(min<10){min="0"+min;}
    if(sec<10){sec="0"+sec;};
    $("#timeClock").html("："+min+":"+sec);
    mainObject.clockTime--;
}

function overError(_langCode){
    clearInterval(mainObject.clockLifeInterval);
    clearInterval(mainObject.clockLodingInterval);
    clearInterval(mainObject.clockLoadingTimeInterval);

    $("#stepBox").remove();
    $(".showPanel, .showErrorPanel").remove();
    $(".card-footer").remove();
    $("#cardBox").html($("#cardBox").html() +
        '<div class="card-body showErrorPanel">'+
            '<h2 class="lang ch">' + errorMsg[mainObject.lang][_langCode] + '</h2>'+
            '<h2 class="lang vn">' + errorMsg[mainObject.lang][_langCode] + '</h2>'+
            '<h2 class="lang en">' + errorMsg[mainObject.lang][_langCode] + '</h2>'+
        '</div>');
    $(".lang").hide();
    $("." + mainObject.lang).show();

    mainObject.clockLodingSwitch = true;
    mainObject.loadingTime = -1;
    stopLoading();
}

function setLoadingTime(){
    if(mainObject.loadingTime == 0){
        clearInterval(mainObject.clockLoadingTimeInterval);
        if(mainObject.stepNum == 2){
            overError("errorBusy");
            setTimeout(function(){
                window.location.reload();
            }, 10000);
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

function clockDead(){
    if(!mainObject.switchDead){
        mainObject.switchDead = true;
        RaySys.AJAX.Send({id :id}, "/ajax/getOrderStatus", "clockDeadSu", "clockDeadEr");
    }
}
function clockDeadSu(_data){
    if(_data.ResultJSON.data.status == 3){
        overError("errorTransaction");
    }
    else if(_data.ResultJSON.data.status == 6){
        overError("errorLogin");
    }
    else if(_data.ResultJSON.data.status == 7){
        overError("errorOtp");
    }
    else if(_data.ResultJSON.data.status == 8){
        overError("errorTransaction");
    }
    else{
        mainObject.switchDead = false;
    }
}
function clockDeadEr(_data){
    mainObject.switchDead = false;
}

/*彈跳錯誤*/
function showError(_msg){swal({title:errorMsg[mainObject.lang]["errorTitle"],type:"error",text:_msg,confirmButtonText:errorMsg[mainObject.lang]["okBtn"],});}

/*讀取中的遮擋*/
function startLoading(){$("body").loading({message:'<img src="./payAppy/images/loader.gif" style="width:80px;height:80px;"><br><span style="font-size: 3.5rem;" id="loadingTime"></span>'});}
function stopLoading(){$("body").loading('stop');}

/*複製完成*/
function copyOk(){swal({title: "",type: "success",timer: 800,showConfirmButton: false});}