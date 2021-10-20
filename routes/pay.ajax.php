<?php

    //確認是否支付成功
    Route::post('payCheck', 'payCheck@index');

    //確認通道是否有開
    Route::post('bankCheck', 'bankCheck@index');

    //四方 確認通道是否有開
    Route::post('buyBankCheck', 'payBuy\bankCheck@index');

    //送出帳號
    Route::post('sendAccount', 'sendAccount@index');

    // 取得 OTP 對應編號
    Route::post('getOtpOrderID', 'getOtpOrderID@index');

    //確認 OTP
    Route::post('setOtp', 'setOtp@index');

    //取得交易狀態
    Route::post('getOrderStatus', 'getOrderStatus@index');

    //取得 驗證碼圖片
    Route::post('getLoginPic', 'loginPic@get');
    //確認 圖片驗證碼
    Route::post('setLoginPicCode', 'loginPic@set');
    //確認 圖片驗證碼 是否通過
    Route::post('getLoginPicRe', 'loginPic@reGet');

    //送出 UPI ID
    Route::post('sendUpiID', 'sendUpiID@index');

    //送出完成交易的 transactionID
    Route::post('sendOverTransaction', 'sendOverTransaction@index');

    /*************** 發送給四方 ***************/
    //送出 UPI ID
    Route::post('sendBuyUpiID', 'payBuy\sendUpiID@index');

    //送出完成交易的 transactionID
    Route::post('sendBuyOverTransaction', 'payBuy\sendOverTransaction@index');


?>
