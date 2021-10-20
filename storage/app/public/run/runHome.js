var systemProject = {
    apiUrl                  : "@apiUrl",
    apiKey                  : "@key",
    apiIv                   : "@key",
    lang                    : "@land",
    /*檢測生命週期*/
    clockLifeInterval       : null,
    lifeError               : 0,
    orderPageSwitch         : false,
    orderTimeSwitch         : false,
    commPageSwitch          : false,
    /*送出資料單次阻擋*/
    orderSendSwitch         : false,
    /*換頁速度*/
    pageShowSpeed           : 300,
    pageHideSpeed           : 200,
    /*換頁讀取*/
    pageLoadSwitch          : false,
    /*目前所在頁面*/
    nowPath                 : "homePage",
    /*訂單的位置*/
    nowOrderPath            : "orderPageBox",
    mesageBoxShowStatus     : true,
    mesageLoadBoxShowStatus : true,
    mesageErrorBoxShowStatus: true,
    /*剪貼*/
    clipboardAccount        : null,
    clipboardCode           : null,
    clipboardNo             : null,
    /*頁數*/
    page                    : 1,
    row                     : 20,
    /*錯誤一定要離開*/
    errorStatus             : [20062,20063,20072],
    /*搜尋暫放*/
    search                  : {
        transactionID : null,
        points : null,
        sDate :  null,
        eDate :  null,
        page  :  null,
    },
},
member = {},
comm = {},
order = {};

var gurgur = '<div class="loadingBox text-center"><div class="spinner-border text-danger text-b15" role="status"><span class="sr-only">Loading...</span></div></div>',
    gurgurShort = '<div class="loadingBoxShort text-center mt-3"><div class="spinner-border text-danger text-b15" role="status"><span class="sr-only">Loading...</span></div></div>',
    baseCopy = '<button type="button" id="@idBtn" class="btn btn-link copyBtn" data-clipboard-text="@data"><i class="far fa-copy fa-lg text-warning"></i></button>',
    dataOrderNull = '',
    loadMoreBtn = '';

$(document).ready(function(){

    dataOrderNull = '<div class="alert alert-dismissible alert-warning m-2"><h4 class="alert-heading">' + lang[systemProject.lang]["dataNullTitle"] + '</h4><p class="mb-0">' + lang[systemProject.lang]["dataNullOrder"] + '</p></div>';

    loadMoreBtn = '<div class="mb-4"><button type="button" class="btn btn-outline-warning btn-block col-10 col-sm-10 m-auto loadMoreBtn">' + lang[systemProject.lang]["loadMore"] + '</button></div>';

    /*---------事件宣告區---------*/
    $("#upTop").click(function(){
        if(systemProject.nowPath == "orderPage"){
            $("#" + systemProject.nowOrderPath).scrollTo(0, 500);
        }
        else if(systemProject.nowPath == "commPage"){
            $("#commPageBox").scrollTo(0, 500);
        }
    });
    $("#autoLoginCheck").change(function(){
        if($(this).prop("checked")){
            var loginAccountIn = $("#loginAccountIn").val(), loginPasswordIn = $("#loginPasswordIn").val();
            if(loginAccountIn != "" && loginPasswordIn != ""){
                setCookie("a", loginAccountIn);
                setCookie("p", loginPasswordIn);
            }
        }
        else{
            clearCookie("a");
            clearCookie("p");
        }
    });
    $("#loginBtn").click(function(){
        login({account:$("#loginAccountIn").val(),password:$("#loginPasswordIn").val(),rand:Rand()});
    });
    $("#logoutBtn").click(function(){
        logoutFun();
    });

    /* 頁面切換 */
    $("#homeBtn").click(function(){
        if(!systemProject.pageLoadSwitch){
            systemProject.pageLoadSwitch = true;
            $(".menuBtnClass").removeClass("btn-success").addClass("btn-info");
            $(this).removeClass("btn-info").addClass("btn-success");

            systemProject.orderPageSwitch = false;
            systemProject.commPageSwitch  = false;

            $("#orderPageBoxTab").click();

            $("#fixedBox").hide();
            $("#" + systemProject.nowPath).fadeOut(systemProject.pageHideSpeed, function(){
                $("#homePage").fadeIn(systemProject.pageShowSpeed, function(){
                    systemProject.pageLoadSwitch = false;
                    systemProject.nowPath = "homePage";
                });
            });
        }
    });

    $("#orderBtn").click(function(){
        if(!systemProject.pageLoadSwitch){
            systemProject.pageLoadSwitch = true;
            $(".menuBtnClass").removeClass("btn-success").addClass("btn-info");
            $(this).removeClass("btn-info").addClass("btn-success");

            systemProject.orderPageSwitch = false;
            systemProject.commPageSwitch  = false;

            getOrder(false);
            if(JSON.stringify(order) == "{}"){
                $("#orderPageBox").html(gurgur);
            }

            $("#" + systemProject.nowPath).fadeOut(systemProject.pageHideSpeed, function(){
                $("#orderPage").fadeIn(systemProject.pageShowSpeed, function(){
                    $("#fixedBox").show();
                    systemProject.page = 1;
                    systemProject.search.page = null;
                    $("#searchTransactionID, #searchTransactionIDLabel").show();
                    $("#searchClear").click();
                    systemProject.nowPath = "orderPage";
                });
            });
        }
    });
    /* 子頁面切換 */
    $("#orderPageBoxTab").click(function(){
        systemProject.nowOrderPath = "orderPageBox";
    });
    $("#orderPageSuccessBoxTab").click(function(){
        systemProject.nowOrderPath = "orderPageSuccessBox";
    });

    $("#commBtn").click(function(){
        if(!systemProject.pageLoadSwitch){
            systemProject.pageLoadSwitch = true;
            $(".menuBtnClass").removeClass("btn-success").addClass("btn-info");
            $(this).removeClass("btn-info").addClass("btn-success");

            systemProject.orderPageSwitch = false;
            systemProject.commPageSwitch  = false;

            sendData = { params: Encrypt(JSON.stringify({memberID:member.memberID,token:member.token,rand:Rand()})) };
            send("comm", sendData, "commSu", "commEr");
            $("#commPageBox").html(gurgur);

            $("#" + systemProject.nowPath).fadeOut(systemProject.pageHideSpeed, function(){
                $("#commPage").fadeIn(systemProject.pageShowSpeed, function(){
                    $("#fixedBox").show();
                    systemProject.page = 1;
                    systemProject.search.page = null;
                    $("#searchTransactionID, #searchTransactionIDLabel").hide();
                    $("#searchClear").click();
                    systemProject.nowPath = "commPage";
                });
            });
        }
    });

    $("#logoutBtn").click(function(){
        swal({
            title             : lang[systemProject.lang]["logoutNow"],
            text              : "",
            showConfirmButton : false,
            allowEscapeKey    : false,
            allowOutsideClick : false,
        });
        function logoutClose(){
            setTimeout(function(){
                if(JSON.stringify(member) == "{}"){
                    swal.close();
                }
                else{
                    logoutClose();
                }
            }, 1000);
        }
        logoutClose();
    });

    /*重整頁面*/
    $("#reGetBtn").click(function(){
        systemProject.page = 1;
        systemProject.search.page = null;
        reLoadPage();
    });

    /*搜尋*/
    $("#searchRun").click(function(){
        systemProject.page = 1;
        systemProject.search.page = null;
        systemProject.search.transactionID = $("#searchTransactionID").val();
        systemProject.search.points        = $("#searchPoints").val();
        systemProject.search.sDate         = $(".selectSMonth").val() + "-" + $(".selectSDay").val();
        systemProject.search.eDate         = $(".selectEMonth").val() + "-" + $(".selectEDay").val();
        reLoadPage();
    });

    /*清除搜尋頁*/
    $("#searchClear").click(function(){
        var toNow = new Date();
        $('.selectSMonth')[0].selectedIndex = toNow.getMonth();
        $('.selectSDay')[0].selectedIndex = toNow.getDate() - 1;
        toNow.setDate(toNow.getDate() + 1);
        $('.selectEMonth')[0].selectedIndex = toNow.getMonth();
        $('.selectEDay')[0].selectedIndex = toNow.getDate() - 1;
        $("#searchTransactionID").val("");
        $("#searchPoints").val("");
    });

    /*---------事件宣告區---------*/

    /*---------語言替代---------*/
    $(".langClass").each(function(i){
        $(this).html(lang[systemProject.lang][$(this).html().trim().replace("@", "")]);
    });
});
/*固定事件*/
$(document).on("click", ".copyBtn", function(){
    mesageBoxShow(lang[systemProject.lang]["copyOver"]);
});

/*載入更多*/
$(document).on("click", ".loadMoreBtn", function(){
    systemProject.page++;
    systemProject.search.page = systemProject.page;
    loadMoreFun();
});
/*固定事件*/

/*進入點*/
function doFirst(){
    autoLogin();

    UseSpan();
    /*遮罩*/
    $("#firstBlack").hide();

    /*日期選擇*/
    var toNow = new Date();
    $('.selectSMonth')[0].selectedIndex = toNow.getMonth();
    $('.selectSDay')[0].selectedIndex = toNow.getDate() - 1;
    toNow.setDate(toNow.getDate() + 1);
    $('.selectEMonth')[0].selectedIndex = toNow.getMonth();
    $('.selectEDay')[0].selectedIndex = toNow.getDate() - 1;

    systemProject.search.transactionID = $("#searchTransactionID").val();
    systemProject.search.points        = $("#searchPoints").val();
    systemProject.search.sDate         = $(".selectSMonth").val() + "-" + $(".selectSDay").val();
    systemProject.search.eDate         = $(".selectEMonth").val() + "-" + $(".selectEDay").val();
}

/*重新載入*/
function reLoadPage(){
    if(!systemProject.pageLoadSwitch){
        systemProject.pageLoadSwitch = true;
        systemProject.orderPageSwitch = false;
        systemProject.commPageSwitch  = false;

        if(systemProject.nowPath == "orderPage"){
            order = {};
            getOrder(false);
            if(JSON.stringify(order) == "{}"){
                $("#orderPageBox").html(gurgur);
                $("#orderPageSuccessBox").html(gurgur);
            }
        }
        else if(systemProject.nowPath == "commPage"){
            sendData = { params: Encrypt(JSON.stringify({
                memberID : member.memberID,
                token    : member.token,
                points   : systemProject.search.points,
                start    : systemProject.search.sDate,
                end      : systemProject.search.eDate,
                rand     : Rand(),
            })) };
            send("comm", sendData, "commSu", "commEr");
            $("#commPageBox").html(gurgur);
        }
    }
}

/*載入更多的發送*/
function loadMoreFun(){
    if(!systemProject.pageLoadSwitch){
        systemProject.pageLoadSwitch = true;
        systemProject.orderPageSwitch = false;
        systemProject.commPageSwitch  = false;

        if(systemProject.nowPath == "orderPage"){
            $("#orderPage .loadMoreBtn").remove();
            $("#orderPageBox, #orderPageSuccessBox").append(gurgurShort);
            sendData = { params: Encrypt(JSON.stringify({
                memberID      : member.memberID,
                token         : member.token,
                transactionID : systemProject.search.transactionID,
                points        : systemProject.search.points,
                start         : systemProject.search.sDate,
                end           : systemProject.search.eDate,
                page          : systemProject.search.page,
                rand          : Rand()
            })) };
            send("order", sendData, "orderMoreSu", "orderEr");
        }
        else if(systemProject.nowPath == "commPage"){
            $("#commPage .loadMoreBtn").remove();
            $("#commPageBox").append(gurgurShort);
            sendData = { params: Encrypt(JSON.stringify({
                memberID : member.memberID,
                token    : member.token,
                points   : systemProject.search.points,
                start    : systemProject.search.sDate,
                end      : systemProject.search.eDate,
                page     : systemProject.search.page,
                rand     : Rand(),
            })) };
            send("comm", sendData, "commMoreSu", "commEr");
        }
    }
}

/*餅乾自動登入*/
function autoLogin(){
    var accountIn = getCookie("a"), passwordIn = getCookie("p");
    if(accountIn != "" && passwordIn != ""){
        accountIn  = Decrypt(accountIn);
        passwordIn = Decrypt(passwordIn);
        if(accountIn != "" && passwordIn != ""){
            $("#loginAccountIn").val(accountIn);
            $("#loginPasswordIn").val(passwordIn);
            $("#autoLoginCheck").prop("checked", true);
            login({account:accountIn,password:passwordIn,rand:Rand()});
            return true;
        }
    }
    clearCookie("a");
    clearCookie("p");
}
/*---------登入---------*/
function login(_paramsData){
    _paramsData = Encrypt(JSON.stringify(_paramsData));
    var sendData = { params: _paramsData };
    send("login", sendData, "loginSu", "loginEr");
    memberLoadAlert();
}
function loginSu(_data){
    if($("#autoLoginCheck").prop("checked")){
        setCookie("a", Encrypt($("#loginAccountIn").val()));
        setCookie("p", Encrypt($("#loginPasswordIn").val()));
    }
    else{
        clearCookie("a");
        clearCookie("p");
    }

    /*寄放資料*/
    setAccountInfo(_data.ResultJSON);

    $("#loginPage").fadeOut(systemProject.pageHideSpeed, function(){
        $("#mainPage").fadeIn(systemProject.pageHideSpeed, function(){
            systemProject.clockLifeInterval = setInterval(holdLine, 10000);
            $("#homeBtn").click();
            cancelLoadAlert();
        });
    });
}
function loginEr(_data){
    mesageBoxJumpError(lang[systemProject.lang]["error"], lang[systemProject.lang][_data.ResultJSON.status]);
    clearCookie("a");
    clearCookie("p");
}
/*---------登入---------*/

/*---------訂單---------*/
function getOrder(_timeSwitch){
    sendData = { params: Encrypt(JSON.stringify({
        memberID      : member.memberID,
        token         : member.token,
        transactionID : systemProject.search.transactionID,
        points        : systemProject.search.points,
        start         : systemProject.search.sDate,
        end           : systemProject.search.eDate,
        page          : systemProject.search.page,
        rand          : Rand()
    })) };
    if(!_timeSwitch){
        send("order", sendData, "orderSu", "orderEr");
    }
    else{
        send("order", sendData, "orderTimeSu", "orderEr");
    }
}
function orderSu(_data){
    var pageArray = orderToHtml(false, _data);

    if(pageArray[0] != ""){
        $("#orderPageBox").html(pageArray[0] + loadMoreBtn);
    }
    if(pageArray[1] != ""){
        $("#orderPageSuccessBox").html(pageArray[1] + loadMoreBtn);
    }

    if($("#orderPageBox").html() == "" || $("#orderPageBox").html() == gurgur){
        $("#orderPageBox").html(dataOrderNull);
    }
    if($("#orderPageSuccessBox").html() == "" || $("#orderPageSuccessBox").html() == gurgur){
        $("#orderPageSuccessBox").html(dataOrderNull);
    }

    systemProject.orderPageSwitch = true;
    systemProject.pageLoadSwitch = false;
}
function orderTimeSu(_data){
    if(!systemProject.pageLoadSwitch){
        var pageArray = orderToHtml(true, _data);
        if(pageArray[0] != ""){
            /*發出聲音*/
            playSound();

            $("#orderPageBox").prepend(pageArray[0]);

            setTimeout(function(){
                $(".animate__animated").removeClass("animate__backInRight");
            }, 5000);
        }
        if(pageArray[1] != ""){
            $("#orderPageSuccessBox").prepend(pageArray[1]);
        }

        if($("#orderPageBox").html() == ""){
            $("#orderPageBox").html(dataOrderNull);
        }
        if($("#orderPageSuccessBox").html() == ""){
            $("#orderPageSuccessBox").html(dataOrderNull);
        }
    }

    systemProject.orderTimeSwitch = false;
}
function orderMoreSu(_data){
    var pageArray = orderToHtml(false, _data), haveMoreData = false;

    $("#orderPage .loadingBoxShort").remove();

    if(pageArray[0] != ""){
        haveMoreData = true;
        $("#orderPageBox").append(pageArray[0]);
    }
    if(pageArray[1] != ""){
        haveMoreData = true;
        $("#orderPageSuccessBox").append(pageArray[1]);
    }

    if(haveMoreData){
        $("#orderPageBox").append(loadMoreBtn);
        $("#orderPageSuccessBox").append(loadMoreBtn);
    }

    systemProject.orderPageSwitch = true;
    systemProject.pageLoadSwitch = false;
}
function orderEr(_data){
    mesageBoxJumpError(lang[systemProject.lang]["error"], lang[systemProject.lang][_data.ResultJSON.status]);
    if(JSON.stringify(order) == "{}"){
        $("#homeBtn").click();
    }
}
function orderToHtml(_timeSwitch, _data){
    var pageArray = [], result = _data.ResultJSON.data;
    pageArray[0] = "";
    pageArray[1] = "";
    for(var key in result){
        var transID = result[key]["transactionID"];

        if(order[transID] != undefined){
            continue;
        }
        order[transID] = result[key];

        /**********組裝**********/
        var orderColor = "", orderAnimate = "";
        if(result[key]["status"] == 1){
            orderColor = "success";
        }
        else if(result[key]["status"] == 0){
            orderColor = "info";
        }
        else{
            result[key]["status"] = 2;
            orderColor = "danger";
        }

        if(_timeSwitch){
            orderAnimate = " animate__animated animate__backInRight";
        }

        var pageHtml = "";

        pageHtml += '<div class="card border-' + orderColor + ' m-1 mb-3' + orderAnimate + '" id="order_' + result[key]["transactionID"] + '">';
        pageHtml += '<div class="card-header text-b10 p-2">';
        pageHtml += '<span>' + lang[systemProject.lang]["transactionID"] + ": " + result[key]["transactionID"] + '</span>';
        pageHtml += '<span class="float-right">' + lang[systemProject.lang]["type" + result[key]["type"]] + ": " + FormatNumber(result[key]["points"]) + '</span></div>';
        pageHtml += '<div class="card-body p-2">';

        /*印度獨有的 UTR, UPIID*/
        if(result[key]["utr"] != ""){
            pageHtml += '<h4 class="card-title mb-2 text-b12">' + lang[systemProject.lang]["utr"] + ": " + result[key]["utr"] + '</h4>';
        }
        if(result[key]["uid"] != ""){
            pageHtml += '<h4 class="card-title mb-2 text-b12">' + lang[systemProject.lang]["uid"] + ": " + result[key]["uid"] + '</h4>';
        }

        pageHtml += '<p class="card-text mb-1">' + result[key]["mineBank"] + ": " + result[key]["mineAccount"] + '(' + result[key]["mineGetAccount"] + ')<br>';

        if(result[key]["cdate"] == null){
            result[key]["cdate"] = "";
        }
        pageHtml += lang[systemProject.lang]["bDate"] + ": " + result[key]["bdate"] + '<br>';
        pageHtml += lang[systemProject.lang]["cDate"] + ': <span class="orderDate">' + result[key]["cdate"] + '</span>';

        /*標記*/
        pageHtml += '</p><p class="card-text" align="right">';
        if(result[key]["type"] == 1){
            pageHtml += '<button type="button" class="btn btn-warning text-b08 p-1 mr-1" data-toggle="modal" data-target="#orderModal_' + result[key]["transactionID"] + '">';
            pageHtml += '<i class="fas fa-info-circle mr-1"></i>' + lang[systemProject.lang]["type" + result[key]["type"]] + lang[systemProject.lang]["data"] + '</button>';
        }
        pageHtml += '<span class="badge badge-primary text-b08 p-2 mr-1">' + lang[systemProject.lang]["match" + result[key]["match"]] + '</span>';
        pageHtml += '<span class="badge badge-' + orderColor + ' orderStatus text-b08 p-2">' + lang[systemProject.lang]["status" + result[key]["status"]] + '</span>';

        pageHtml += '</p></div>';

        /*是否加按鈕*/
        if(result[key]["status"] == 0){
            pageHtml += '<div class="card-footer text-muted orderFooter p-0"><div class="btn-group col-12 col-sm-12 p-0" role="group">';
            pageHtml += '<button type="button" class="btn btn-danger" onclick="sendOrder(2,' + result[key]["transactionID"] + ');"><i class="fas fa-times mr-2"></i>' + lang[systemProject.lang]["transNoPass"] + '</button>';
            pageHtml += '<button type="button" class="btn btn-success" onclick="sendOrder(1,' + result[key]["transactionID"] + ');"><i class="fas fa-check mr-2"></i>' + lang[systemProject.lang]["transPass"] + '</button>';
            pageHtml += '</div></div>';
        }

        pageHtml += '<div class="modal fade" id="orderModal_' + result[key]["transactionID"] + '" tabindex="-1" role="dialog" aria-labelledby="orderModalTitle_' + result[key]["transactionID"] + '" aria-hidden="true">';
        pageHtml += '<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header">';
        pageHtml += '<h5 class="modal-title" id="exampleModalLabel">' + lang[systemProject.lang]["transactionID"] + ": " + result[key]["transactionID"] + '</h5>';
        pageHtml += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

        pageHtml += '<div class="modal-body">';
        pageHtml += '<h4>' + lang[systemProject.lang]["transPoints"] + ": " + FormatNumber(result[key]["points"]) + '</h4>';
        pageHtml += '<p><strong>' + lang[systemProject.lang]["type1"] + lang[systemProject.lang]["transAccount"] + ':</strong><br>';
        pageHtml += result[key]["mineBank"] + ": " + result[key]["mineAccount"] + '(' + result[key]["mineGetAccount"] + ')<p>';

        pageHtml += '<h4>' + lang[systemProject.lang]["transApplyfor"] + '</h4>';
        pageHtml += '<p>' + lang[systemProject.lang]["transBank"] + ': ' + result[key]["bankUseBank"] + '</p>';

        if(result[key]["tno"] != null && result[key]["tno"] != ""){
            pageHtml += '<p>' + lang[systemProject.lang]["transNo"] + ': ' + result[key]["tno"] + '</p>';
        }

        pageHtml += '<p>' + lang[systemProject.lang]["transAccount"] + ': ' + result[key]["bankAccount"] + '</p>';
        pageHtml += '<p>' + lang[systemProject.lang]["transCode"] + ': ' + result[key]["bankCode"] + '</p>';

        pageHtml += '</div><div class="modal-footer">';
        pageHtml += '<button type="button" class="btn btn-secondary" data-dismiss="modal">' + lang[systemProject.lang]["close"] + '</button>';
        pageHtml += '</div></div></div></div>';

        pageHtml += '</div>';

        if(result[key]["status"] == 0){
            pageArray[0] += pageHtml;
        }
        else{
            pageArray[1] += pageHtml;
        }
    }

    return pageArray;
}
/*---------訂單---------*/

/*---------手續費---------*/
function commSu(_data){
    var pageHtml = commToHtml(_data), addMoreBtn = true;

    if(pageHtml == ""){
        addMoreBtn = false;
        pageHtml = '<div class="alert alert-dismissible alert-warning m-2">';
        pageHtml +=     '<h4 class="alert-heading">' + lang[systemProject.lang]["dataNullTitle"] + '</h4>';
        pageHtml +=     '<p class="mb-0">' + lang[systemProject.lang]["dataNullComm"] + '</p>';
        pageHtml += '</div>';
    }

    $("#commPageBox").html(pageHtml);

    if(addMoreBtn){
        $("#commPageBox").append(loadMoreBtn);
    }

    systemProject.commPageSwitch = true;
    systemProject.pageLoadSwitch = false;
}
function commMoreSu(_data){
    var pageHtml = commToHtml(_data), addMoreBtn = true;

    $("#commPageBox .loadingBoxShort").remove();

    if(pageHtml == ""){
        addMoreBtn = false;
    }

    $("#commPageBox").append(pageHtml);
    if(addMoreBtn){
        $("#commPageBox").append(loadMoreBtn);
    }

    systemProject.commPageSwitch = true;
    systemProject.pageLoadSwitch = false;
}
function commEr(_data){
    mesageBoxJumpError(lang[systemProject.lang]["error"], lang[systemProject.lang][_data.ResultJSON.status]);
    $("#homeBtn").click();
}
function commToHtml(_data){
    var pageHtml = "", result = _data.ResultJSON.data, groupID = 0;
    for(var key in result){
        if(groupID != result[key]["groupID"]){
            if(groupID != 0){
                pageHtml += '</div>';
                pageHtml += '</div>';
            }
            groupID = result[key]["groupID"];

            pageHtml += '<div class="card border-info m-1 mb-3">';
            pageHtml += '<div class="card-header text-b10 p-2">' + lang[systemProject.lang]["commissionID"] + ": " + result[key]["groupID"] + '</div>';
            pageHtml += '<div class="card-body p-3">';
            pageHtml += '<h5 class="card-title">';
            pageHtml += lang[systemProject.lang]["type" + result[key]["type"]];
            pageHtml += '</h5>';
        }

        pageHtml += '<ul class="list-group">';
        pageHtml += '<li class="list-group-item d-flex justify-content-between align-items-center p-2">';
        pageHtml += lang[systemProject.lang]["commAccount"] + ": " + result[key]["mineAccount"];
        pageHtml += '<span class="badge badge-dark text-b10 p-1">' + result[key]["perc"] + '%</span>';
        pageHtml += '</li>';
        pageHtml += '<li class="list-group-item d-flex justify-content-between align-items-center p-2">';
        pageHtml += lang[systemProject.lang]["commAccountDown"] + ": " + result[key]["downAccount"];
        pageHtml += '<span class="badge badge-dark text-b10 p-1">' + result[key]["downPerc"] + '%</span>';
        pageHtml += '</li>';

        pageHtml += '<li class="list-group-item d-flex justify-content-between align-items-center p-2">';
        pageHtml += lang[systemProject.lang]["points"] + ": " + FormatNumber(result[key]["points"]);
        pageHtml += '</li>';
        pageHtml += '<li class="list-group-item d-flex justify-content-between align-items-center p-2">';
        pageHtml += lang[systemProject.lang]["perc"] + ": " + FormatNumber(result[key]["pointsReal"]);
        pageHtml += '</li>';
        pageHtml += '<li class="list-group-item d-flex justify-content-between align-items-center p-2">';
        pageHtml += lang[systemProject.lang]["total"] + ": " + FormatNumber(parseFloat(result[key]["points"]) + parseFloat(result[key]["pointsReal"]));
        pageHtml += '</li>';

        pageHtml += '<li class="list-group-item d-flex justify-content-between align-items-center p-2">';
        pageHtml += lang[systemProject.lang]["bDate"] + ": " + result[key]["bdate"];
        pageHtml += '</li>';
        pageHtml += '</ul>';
    }

    if(pageHtml != ""){
        pageHtml += '</ul>';
        pageHtml += '</div>';
        pageHtml += '</div>';
    }
    return pageHtml;
}
/*---------手續費---------*/

/*---------登出---------*/
function logoutFun(){
    clearTimeout(systemProject.clockLifeInterval);
    var sendData = { params: Encrypt(JSON.stringify({memberID:member.memberID,token:member.token,rand:Rand()})) };
    send("logout", sendData, "logoutOver", "logoutOver");
    clearCookie("a");
    clearCookie("p");
}
function logoutOver(){
    $("#mainPage").fadeOut(systemProject.pageHideSpeed, function(){
        $("#loginPage").fadeIn(systemProject.pageHideSpeed, function(){
            member = {};
            comm = {};
            order = {};
            systemProject.pageLoadSwitch = false;
        });
    });
}
/*---------登出---------*/

/*---------送出狀態---------*/
function sendOrder(_type, _transID){
    var showSwalMsg = "", showSwalIcon = "";
    if(_type == 1){
        showSwalIcon = "success";
        showSwalMsg = lang[systemProject.lang]["orderSendPass"];
    }
    else{
        showSwalIcon = "warning";
        showSwalMsg = lang[systemProject.lang]["orderSendNoPass"];
    }
    /*確認視窗*/
    swal({
        title: "",
        text: showSwalMsg + _transID,
        type: showSwalIcon,
        showCancelButton: true,
        confirmButtonColor: "#18bc9c",
        confirmButtonText:  lang[systemProject.lang]["ok"],
        cancelButtonText:  lang[systemProject.lang]["cancel"],
        closeOnConfirm: false
    }, function(){
        if(systemProject.orderPageSwitch){
            if(!systemProject.orderSendSwitch){
                systemProject.orderSendSwitch = true;
                memberLoadAlert();
                var sendData = { params: Encrypt(JSON.stringify({memberID:member.memberID,token:member.token,transactionID:_transID,type:_type,rand:Rand()})) };
                send("send", sendData, "sendSu", "sendEr");
            }
        }
    });
}
function sendSu(_data){
    var result = _data.ResultJSON.data;
    for(var key in result){
        var transID = result[key]["transactionID"];
        if(result[key]["useinfo"] == 1){
            $("#order_" + transID).removeClass("border-info").addClass("border-success");
            $("#order_" + transID + " .orderStatus").removeClass("badge-info").addClass("badge-success").html(lang[systemProject.lang]["status1"]);
            $("#order_" + transID + " .orderFooter").remove();
        }
        else{
            $("#order_" + transID).removeClass("border-info").addClass("border-danger");
            $("#order_" + transID + " .orderStatus").removeClass("badge-info").addClass("badge-danger").html(lang[systemProject.lang]["status2"]);
            $("#order_" + transID + " .orderFooter").remove();
        }

        $("#order_" + transID + " .orderDate").html(result[key]["cDate"]);

        /*移動位置*/
        var orderColor = "";
        if(result[key]["useinfo"] == 1){
            orderColor = "success";
        }
        else if(result[key]["useinfo"] == 0){
            orderColor = "info";
        }
        else{
            orderColor = "danger";
        }
        var copyHtml = '<div class="card border-' + orderColor + ' m-1 mb-3" id="order_' + result[key]["transactionID"] + '">';
        copyHtml += $("#order_" + transID).html() + "</div>";
        $("#orderPageSuccessBox").prepend(copyHtml);
        $("#orderPageBox #order_" + transID).remove();
    }
    systemProject.orderSendSwitch = false;
    mesageBoxJumpError(lang[systemProject.lang]["orderOver"], lang[systemProject.lang]["transactionID"] + ": " + transID);
}
function sendEr(_data){
    mesageBoxJumpError(lang[systemProject.lang]["error"], lang[systemProject.lang][_data.ResultJSON.status]);
    systemProject.orderSendSwitch = false;
    cancelLoadAlert();
}
/*---------送出狀態---------*/

/*---------維持連線---------*/
function holdLine(){
    var sendData = { params: Encrypt(JSON.stringify({memberID:member.memberID,token:member.token,rand:Rand()})) };
    send("line", sendData, "holdLineSu", "holdLineEr");

    if(systemProject.orderPageSwitch){
        if(!systemProject.orderTimeSwitch){
            systemProject.orderTimeSwitch = true;
            getOrder(true);
        }
    }
}
function holdLineSu(_data){
    systemProject.lifeError = 0;

    /*寄放資料*/
    setAccountInfo(_data.ResultJSON);
}
function holdLineEr(_data){
    mesageLoadBoxShow(lang[systemProject.lang]["99998"]);
    systemProject.lifeError++;

    if(systemProject.lifeError >= 6 || systemProject.errorStatus.indexOf(_data.ResultJSON.status)){
        if(systemProject.errorStatus.indexOf(_data.ResultJSON.status)){
            mesageBoxJumpError(lang[systemProject.lang]["error"], lang[systemProject.lang][_data.ResultJSON.status]);
        }
        else{
            mesageBoxJumpError(lang[systemProject.lang]["error"], lang[systemProject.lang]["errorLogout"]);
        }
        logoutFun();
    }
}
/*---------維持連線---------*/

/*寫入基本資料*/
function setAccountInfo(_data){
    /*寄放資料*/
    if(JSON.stringify(member) == "{}"){
        member = _data.info;
    }
    else{
        member.useinfo       = _data.info.useinfo;
        member.accountMember = _data.info.accountMember;
        member.nameMember    = _data.info.nameMember;
        member.points        = _data.info.points;
        member.perc          = _data.info.perc;
        member.percApply     = _data.info.percApply;
        member.bankPay       = _data.info.bankPay;
        member.noPay         = _data.info.noPay;
        member.codePay       = _data.info.codePay;
        member.accountPay    = _data.info.accountPay;
    }

    member.totalSuccessCommPoints = _data.pointsCommSum;
    member.totalSuccessGetCount = _data.successInCount;
    member.totalSuccessGetPoints = _data.pointsInSum;
    member.totalSuccessSendCount = _data.successOutCount;
    member.totalSuccessSendPoints = _data.pointsOutSum;

    member.pay = [];
    for(var key in _data.pay){
        member.pay[key] = _data.pay[key];
    }

    /*填入資料*/
    for(var key in member){
        if(key == "perc" || key == "percApply"){
            var rowHtml = '<span class="mr-1">' + lang[systemProject.lang]["type0"] + ': ' + FormatNumber(member["perc"]) + " %</span>";
            rowHtml += '<span class="ml-2">' + lang[systemProject.lang]["type1"] + ': ' + FormatNumber(member["percApply"]) + " %</span>";
            $("#" + key).html(rowHtml);
        }
        else if(key == "accountPay"){
            $("#" + key).html(member[key] + baseCopy.replace("@id", key).replace("@data", member[key]));
        }
        else if(key == "codePay"){
            $("#" + key).html(member[key] + baseCopy.replace("@id", key).replace("@data", member[key]));
        }
        else if(key == "noPay"){
            $("#" + key).html(member[key] + baseCopy.replace("@id", key).replace("@data", member[key]));
        }
        else{
            $("#" + key).html(member[key]);
        }
    }
    /*填入擁有的資料*/
    var minePayPage = "";
    for(var key in member["pay"]){
        minePayPage += '<h4 class="card-title">' + member["pay"][key]["bankBank"] + '</h4>';
        minePayPage += '<p class="card-text">' + member["pay"][key]["accountBank"];

        /*持有銀行是否啟用：0、禁用，1、啟用，2、維護*/
        /*維護註記*/
        if(member["pay"][key]["useinfoBank"] == 0){
            minePayPage += '<span class="badge badge-danger mx-2">';
        }
        else if(member["pay"][key]["useinfoBank"] == 1){
            minePayPage += '<span class="badge badge-success mx-2">';
        }
        else{
            minePayPage += '<span class="badge badge-warning mx-2">';
        }
        minePayPage += lang[systemProject.lang]["repair" + member["pay"][key]["useinfoBank"]] + '</span>';

        /*開放註記*/
        if(member["pay"][key]["useinfoRoad"] == 1){
            minePayPage += '<span class="badge badge-success mr-2">';
        }
        else{
            minePayPage += '<span class="badge badge-danger mr-2">';
        }
        minePayPage += lang[systemProject.lang]["useinfo" + member["pay"][key]["useinfoRoad"]] + '</span>';

        minePayPage += '</p>';
    }
    $("#memberMineBody").html(minePayPage);

    /*塞入額度*/
    var pointsItem = "";
    if(member.useinfo == 1){
        pointsItem += '<span class="badge badge-success mx-2">';
        mesageErrorBoxClose();
    }
    else{
        pointsItem += '<span class="badge badge-danger mx-2">';
        mesageErrorBoxShow(lang[systemProject.lang]["roadClose"]);
    }
    pointsItem += lang[systemProject.lang]["useinfo" + member.useinfo] + '</span>';
    $(".points").html(FormatNumber(member.points) + pointsItem);

    /*去除 IFSC*/
    if(member["noPay"] == ""){
        $(".noPayClass").hide();
    }

    /*複製資料*/
    systemProject.clipboardAccount = new Clipboard('#accountPayBtn');
    systemProject.clipboardCode    = new Clipboard('#codePayBtn');
    systemProject.clipboardNo      = new Clipboard('#noPayBtn');
}

/*Bootstrap 正規*/
function UseSpan(){
    $(".span1").addClass("col-1 col-sm-1 col-md-1 col-lg-1").removeClass("span1");
    $(".span2").addClass("col-2 col-sm-2 col-md-2 col-lg-2").removeClass("span2");
    $(".span3").addClass("col-3 col-sm-3 col-md-3 col-lg-3").removeClass("span3");
    $(".span4").addClass("col-4 col-sm-4 col-md-4 col-lg-4").removeClass("span4");
    $(".span5").addClass("col-5 col-sm-5 col-md-5 col-lg-5").removeClass("span5");
    $(".span6").addClass("col-6 col-sm-6 col-md-6 col-lg-6").removeClass("span6");
    $(".span7").addClass("col-7 col-sm-7 col-md-7 col-lg-7").removeClass("span7");
    $(".span8").addClass("col-8 col-sm-8 col-md-8 col-lg-8").removeClass("span8");
    $(".span9").addClass("col-9 col-sm-9 col-md-9 col-lg-9").removeClass("span9");
    $(".span10").addClass("col-10 col-sm-10 col-md-10 col-lg-10").removeClass("span10");
    $(".span11").addClass("col-11 col-sm-11 col-md-11 col-lg-11").removeClass("span11");
    $(".span12").addClass("col-12 col-sm-12 col-md-12 col-lg-12").removeClass("span12");
}
/*傳送 API*/
function send(_path, _data, _suFunName, _erFunName){
    $.ajax({
        type: 'POST',
        url:  systemProject.apiUrl + "/" + _path,
        data: _data,

        error: function(xhr, ajaxOptions, thrownError) {
            var fun;
            fun = window[_erFunName];
            _data.ResultJSON = {};
            _data.ResultJSON.status = "9999";
            _data.ResultJSON.error = thrownError;
            if(typeof fun == "function"){
                fun.apply(window, [_data]);
            }
        },
        success: function(ResultJSON){
            ResultJSON = Decrypt(ResultJSON);
            if(TestJson(ResultJSON)){
                ResultJSON = JSON.parse(ResultJSON);
            }
            else{
                ResultJSON = { status: 99999 };
            }
            var fun;
            if(ResultJSON.status != "10000"){
                fun = window[_erFunName];
            }else{
                fun = window[_suFunName];
            }
            _data.ResultJSON = ResultJSON;
            if(typeof fun == "function"){
                fun.apply(window, [_data]);
            }
        }
    });
}


/*判斷Json*/
function TestJson(_json){
    try{
        JSON.parse(_json);
        return true;
    }
    catch(e){
        return false;
    }
}
/*開網頁*/
function openWebSide(_linkUrl){
    window.open(_linkUrl, "", config='');
}

/*取出餅乾*/
function getCookie(_id){
    var cookie = document.cookie;
    if(cookie != ""){
        cookie = cookie.split(";");
        for(var key in cookie){
            var cookieKey = cookie[key].split("=");
            if(cookieKey[0].trim() == _id){
                var resultStr = cookieKey[1];
                if(resultStr == "NON"){
                    resultStr = "";
                }
                resultStr = resultStr.replace(/<br>/g, "\n");
                return resultStr;
            }
        }
    }
    return false;
}
/*存入餅乾*/
function setCookie(_id, _data){
    if(_data == ""){
        _data = "NON";
    }
    _data = _data.replace(/\r\n/g,"<br>").replace(/\n/g,"<br>");
    var d = new Date();
    d.setTime(d.getTime() + (9999 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = _id + "=" + _data + "; " + expires;
}
/*殺餅乾*/
function clearCookie(_id){
    var d = new Date();
    d.setTime(d.getTime() -1);
    var expires = "expires=" + d.toGMTString();
    document.cookie = _id + "=; " + expires;
}
function c(_data){
    if(systemProject.debug){
        console.log(_data);
    }
}
/*千位數補小數點*/
function FormatNumber(n){
    n += "";
    var arr = n.split(".");
    var re = /(\d{1,3})(?=(\d{3})+$)/g;
    return arr[0].replace(re, "$1,") + (arr.length == 2 ? (arr[1] <= 0 ? "" : "." + arr[1]) : "");
}
function mesageBoxJumpError(_title, _msg){
    swal({
        title             : _title,
        text              : _msg,
        confirmButtonText : lang[systemProject.lang]["ok"],
        confirmButtonColor: "#18bc9c",
    });
}

/*读取共用式*/
function memberLoadAlert(){
    $("#swalCancel").hide();
    swal({
        title             : lang[systemProject.lang]["wait"],
        text              : lang[systemProject.lang]["loadServer"] + "<br><a href='javascript:void(0);' id='swalCancel' class='btn waves-effect waves-light mt-3' style='display: none;' onclick='cancelLoadAlert();'>" + lang[systemProject.lang]["cancel"] + "</a>",
        showConfirmButton : false,
        allowEscapeKey    : false,
        allowOutsideClick : false,
        html              : true,
    });
    setTimeout(function(){
        $("#swalCancel").show();
    }, 60000);
}
function cancelLoadAlert(){
    swal.close();
}
function mesageBoxShow(_msg){
    if(systemProject.mesageBoxShowStatus){
        systemProject.mesageBoxShowStatus = false;
        $("#messageBoxMsg").html(_msg);
        $("#messageBox").fadeIn(500, function(){
            setTimeout(function(){
                $("#messageBox").fadeOut(400, function(){
                    $("#messageBoxMsg").html("");
                    systemProject.mesageBoxShowStatus = true;
                });
            }, 3000);
        });
    }
}
function mesageLoadBoxShow(_msg){
    if(systemProject.mesageLoadBoxShowStatus){
        systemProject.mesageLoadBoxShowStatus = false;
        $("#messageLoadBoxMsg").html(_msg);
        $("#messageLoadBox").fadeIn(500, function(){
            setTimeout(function(){
                $("#messageLoadBox").fadeOut(400, function(){
                    $("#messageLoadBoxMsg").html("");
                    systemProject.mesageLoadBoxShowStatus = true;
                });
            }, 3000);
        });
    }
}
function mesageErrorBoxShow(_msg){
    if(systemProject.mesageErrorBoxShowStatus){
        systemProject.mesageErrorBoxShowStatus = false;
        $("#messageErrorBoxMsg").html(_msg);
        $("#messageErrorBox").fadeIn(500, function(){
        });
    }
}
function mesageErrorBoxClose(){
    $("#messageErrorBox").fadeOut(400, function(){
        $("#messageErrorBoxMsg").html("");
        systemProject.mesageErrorBoxShowStatus = true;
    });
}
/*播放聲音*/
function playSound() {
    $('#audioDiv').html('<audio autoplay="autoplay"><source src="./media/ding.mp3" type="audio/wav"/><source src="./media/ding.mp3" type="audio/mpeg"/></audio>');
}

/*重啟頁面*/
function reloadPage(){
    location.reload();
}
