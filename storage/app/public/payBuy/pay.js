
var mainObject = {
    lang              : '@defaultLang',
    clockLifeInterval : null,
    clockTime         : 0,
    clipboardMark     : null,
    clipboardPoints   : null,
    clipboardCode     : null,
    clipboardAccount  : null,
    pageShowSpeed     : 300,
    pageHideSpeed     : 200,

    bankID   : null,
    bankName : null,
};


$(document).ready(function(){

    $("#contentSuccessBox").hide();
    $(".lang").hide();
    $("." + mainObject.lang).show();

    if(QRCodeStr == null || QRCodeStr == ""){
        $("#payQrcode").hide();
        $("#copyQRCode").hide();
    }

    mainObject.clipboardMark    = new Clipboard('#copyMark');
    mainObject.clipboardPoints  = new Clipboard('#copyPoints');
    mainObject.clipboardCode    = new Clipboard('#copyCode');
    mainObject.clipboardAccount = new Clipboard('#copyAccount');

    $("#langBtnVn").click(function(){
        $(".pure-menu-item").removeClass("pure-menu-selected");
        $(".lang").hide();$(".vn").show();
        mainObject.lang = "vn";
        $("html").attr("lang","vi");
    });
    $("#langBtnIn").click(function(){
        $(".pure-menu-item").removeClass("pure-menu-selected");
        $(".lang").hide();$(".in").show();
        mainObject.lang = "in";
        $("html").attr("lang","in");
    });
    $("#langBtnCh").click(function(){
        $(".pure-menu-item").removeClass("pure-menu-selected");
        $(".lang").hide();$(".ch").show();
        mainObject.lang = "ch";
        $("html").attr("lang","zh");
    });
    $("#langBtnEn").click(function(){
        $(".pure-menu-item").removeClass("pure-menu-selected");
        $(".lang").hide();$(".en").show();
        mainObject.lang = "en";
        $("html").attr("lang","en");
    });

    mainObject.clockTime = time;
    if(mainObject.clockTime != 0){
        mainObject.clockLifeInterval = setInterval(clockOnce, 1000);
    }

    $(".bankImgBox").click(function(){
        $(".bankImgBox").removeClass("border-success");
        $(".okClass").hide();
        $(this).addClass("border-success");
        var checkDiv = $(this).next();
        checkDiv.show();
        mainObject.bank     = $(this).data("bank");
        mainObject.bankName = bank[mainObject.bank];
    });

    $("#bankNoMatchBtn, #bankMatchBtn").click(function(){
        if(mainObject.bank == null){
            showError(errorMsg[mainObject.lang]["noBank"]);
            return false;
        }

        startLoading();
        RaySys.AJAX.Send({ id : id, bank : mainObject.bank, match : $(this).data("match") }, "/ajax/buyBankCheck", "bankCheckSu", "bankCheckEr");
    });

    RaySys.Bootstrap.UseSpan();
});

function bankCheckSu(_data){
    if(_data.ResultJSON != undefined){
        _data = _data.ResultJSON.data;
        $("#payBankNameEn").html($("#payBankNameEn").html().replace("view.bankUse.", mainObject.bankName));
        $("#payBankNameCh").html($("#payBankNameCh").html().replace("view.bankUse.", mainObject.bankName));
        $("#payBankNameVn").html($("#payBankNameVn").html().replace("view.bankUse.", mainObject.bankName));
        $("#payBankNameIn").html($("#payBankNameIn").html().replace("view.bankUse.", mainObject.bankName));

        if(_data.match == 1 && (_data.qrUrl != "" && _data.qrUrl != null)){
            $("#payQrcode img").attr("src", _data.qrUrl);
            $("#copyQRCode").attr("onclick", 'downloadImage(' + "'" + _data.qrUrl + "'" + ');');
            $("#payQrcode").show();
            $("#copyQRCode").show();
        }
        else{
            $("#payQrcode").hide();
            $("#copyQRCode").hide();
        }

        $(".payPointsSpan").html(_data.points + " đ");
        $("#copyPoints").attr("data-clipboard-text", _data.points);

        $(".payMarkSpan").html(_data.matchTransactionID);
        $("#copyMark").attr("data-clipboard-text", _data.matchTransactionID);

        if(_data.code != "" || _data.code != null){
            $(".payCodeSpan").html(_data.code);
            $("#copyCode").attr("data-clipboard-text", _data.code);
        }

        if(_data.account != "" || _data.account != null){
            $(".payAccountSpan").html(_data.account);
            $("#copyAccount").attr("data-clipboard-text", _data.account);
        }

        $("#showSelectBank").fadeOut(mainObject.pageHideSpeed, function(){
            $(".showPayPage").fadeIn(mainObject.pageShowSpeed, function(){
                mainObject.clipboardAccount = new Clipboard('#copyMark');
                mainObject.clipboardPoints  = new Clipboard('#copyPoints');
                mainObject.clipboardCode    = new Clipboard('#copyCode');
                mainObject.clipboardAccount = new Clipboard('#copyAccount');
                $(".lang").hide();
                $("." + mainObject.lang).show();
                RaySys.Bootstrap.UseSpan();
                stopLoading();
            });
        });
        return;
    }
    stopLoading();
}
function bankCheckEr(_data){
    if(_data.ResultJSON != undefined){
        switch(_data.ResultJSON.msg){
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
            case 999001:
                showError(errorMsg[mainObject.lang]["noMoneyRow"]);
                break;
            case 999002:
                showError(errorMsg[mainObject.lang]["noMoneyBankRow"]);
                break;
            case 111053:
            case 111054:
                showError(errorMsg[mainObject.lang]["noBalanceMoney"]);
                break;
            default:
                showError(errorMsg[mainObject.lang]["networkError"]);
                break;
        }
    }
    else{
        showError(errorMsg[mainObject.lang]["networkError"]);
    }
    stopLoading();
}


function clockOnce(){
    if(mainObject.clockTime <= 0){
        clearInterval(mainObject.clockLifeInterval);

        var overTimeMsg = '<div class="span12" align="center">';
        if(mainObject.lang == "en"){
            overTimeMsg = overTimeMsg + '<h2 class="lang en">This order is overdue</h2>';
        }
        else if(mainObject.lang == "vn"){
            overTimeMsg = overTimeMsg + '<h2 class="lang vn">Đơn hàng này đã quá hạn</h2>';
        }
        else if(mainObject.lang == "in"){
            overTimeMsg = overTimeMsg + '<h2 class="lang in">यह आदेश समयबद्ध हैn</h2>';
        }
        else if(mainObject.lang == "ch"){
            overTimeMsg = overTimeMsg + '<h2 class="lang in">此订单逾时</h2>';
        }
        overTimeMsg = overTimeMsg + '</div>';

        $("#contentBox").html(overTimeMsg);
        $(".lang").hide();
        $("." + mainObject.lang).show();
        RaySys.Bootstrap.UseSpan();
    }
    var min = parseInt(mainObject.clockTime/60);
    var sec = parseInt(mainObject.clockTime-(min*60));
    if(min<10){min="0"+min;}
    if(sec<10){sec="0"+sec;};
    $("#timeClock").html(min+":"+sec);
    mainObject.clockTime--;

    if(id != ''){
        if(mainObject.clockTime % 5 == 0){
            $.ajax({
                type: 'POST',
                url:  "/ajax/payCheck",
                data: { id : id },
                dataType: 'json',
                error: function(xhr, ajaxOptions, thrownError) {

                },
                success: function(ResultJSON){
                    if(ResultJSON.data == 1){
                        $("#contentBox").hide();
                        $("#contentSuccessBox").show();
                        if(linkUrl != ""){
                            setTimeout(function(){
                                window.location.href = linkUrl;
                            }, 5000);
                        }
                    }
                }
            });
        }
    }
}

function downloadImage(src) {
    var $a = $("<a></a>").attr("href", src).attr("download", (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000) + ".jpg");
    $a[0].click();
}

function showError(_msg){swal({title:errorMsg[mainObject.lang]["errorTitle"],type:"error",text:_msg,confirmButtonText:errorMsg[mainObject.lang]["okBtn"],});}

function startLoading(){$("body").loading({message:'<img src="./payAppy/images/loader.gif" style="width:80px;height:80px;">'});}
function stopLoading(){$("body").loading('stop');}

function copyOk(){swal({title: "",type: "success",timer: 800,showConfirmButton: false});}