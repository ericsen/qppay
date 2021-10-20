
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

    sendSwitch : true,

    upiAddress: [],
};


$(document).ready(function(){

    mainObject.upiAddress["amzpay"]     = "apl";
    mainObject.upiAddress["freecharge"] = "freecharge";
    mainObject.upiAddress["paytm"]      = "paytm";
    mainObject.upiAddress["phonepe"]    = "ybl";
    mainObject.upiAddress["googlepay"]  = "okaxis";
    mainObject.upiAddress["whatapppay"] = "what";

    $("#contentSuccessBox").hide();
    $(".lang").hide();
    $("." + mainObject.lang).show();

    mainObject.clipboardPoints  = new Clipboard('#copyPoints');
    mainObject.clipboardAccount = new Clipboard('#copyAccount');

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

    $(".bankImgBox").click(function(){
        $(".bankImgBox").removeClass("border-success");
        $(".okClass").hide();
        $(this).addClass("border-success");
        var checkDiv = $(this).next();
        checkDiv.show();

        if($(this).data("bank") != "upi"){
            $("#upiAddressInput").val(mainObject.upiAddress[$(this).data("bank")]).prop("disabled", true);
        }
        else{
            $("#upiAddressInput").val("").prop("disabled", false);
        }
    });

    mainObject.clockTime = time;
    if(mainObject.clockTime != 0){
        mainObject.clockLifeInterval = setInterval(clockOnce, 1000);
    }

    RaySys.Bootstrap.UseSpan();

    $("#sendLinkUpiID").click(function(){
        if(mainObject.sendSwitch){
            mainObject.sendSwitch = false;

            var data = {
                id: id,
                upiID: $("#upiIdInput").val().trim().trim("@") + "@" + $("#upiAddressInput").val().trim().trim("@"),
            };

            startLoading();
            RaySys.AJAX.Send(data, "/ajax/sendBuyUpiID", "sendUpiIDSu", "sendUpiIDEr");
        }
    });
});

function sendUpiIDSu(_data){
    mainObject.sendSwitch = true;
    $("#showSelectBank").fadeOut(mainObject.pageHideSpeed, function(){
        $(".showPayPage, .showPayMessagePage").fadeIn(mainObject.pageShowSpeed, function(){
            RaySys.Bootstrap.UseSpan();
            stopLoading();
        });
    });
}
function sendUpiIDEr(_data){
    mainObject.sendSwitch = true;
    stopLoading();
    switch(_data.ResultJSON.msg){
        case 201:
            showError(errorMsg[mainObject.lang]["noOrder"]);
            break;
        case 202:
            showError(errorMsg[mainObject.lang]["orderClose"]);
            break;
        case 203:
            showError(errorMsg[mainObject.lang]["timeOut"]);
            break;
        case 206:
            showError(errorMsg[mainObject.lang]["noOutTransID"]);
            break;
        case 301:
            showError(errorMsg[mainObject.lang]["noTempMoney"]);
            break;
        case 302:
            showError(errorMsg[mainObject.lang]["overTempMoney"]);
            break;
        case 303:
            showError(errorMsg[mainObject.lang]["errorPointsTempMoney"]);
            break;
        case 401:
            showError(errorMsg[mainObject.lang]["noOrder"]);
            break;
        case 501:
            showError(errorMsg[mainObject.lang]["upiNull"]);
            break;
        case 502:
            showError(errorMsg[mainObject.lang]["upiIdLong"]);
            break;
        case 503:
            showError(errorMsg[mainObject.lang]["upiError"]);
            break;
        default:
            showError(errorMsg[mainObject.lang]["networkError"]);
            break;
    }
}


function clockOnce(){
    if(mainObject.clockTime <= 0){
        clearInterval(mainObject.clockLifeInterval);

        $('#transactionID').tooltip('dispose');

        var overTimeMsg = '<div class="span12" align="center">';
        if(mainObject.lang == "en"){
            overTimeMsg = overTimeMsg + '<h2 class="lang en">This order is overdue</h2>';
        }
        else if(mainObject.lang == "in"){
            overTimeMsg = overTimeMsg + '<h2 class="lang in">यह आदेश समयबद्ध हैn</h2>';
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


function showSuccess(_msg){swal({title:"",type:"success",text:_msg,confirmButtonText:errorMsg[mainObject.lang]["okBtn"],});}
function showError(_msg){swal({title:errorMsg[mainObject.lang]["errorTitle"],type:"error",text:_msg,confirmButtonText:errorMsg[mainObject.lang]["okBtn"],});}

function startLoading(){$("body").loading({message:'<img src="./payAppy/images/loader.gif" style="width:80px;height:80px;">'});}
function stopLoading(){$("body").loading('stop');}

function copyOk(){swal({title: "",type: "success",timer: 800,showConfirmButton: false});}