<?php

    //取得其標狀態
    Route::post('getFlags', 'getFlags@index');

    //快速搜尋帳號
    Route::post('searchAccount', 'account\searchAccount@index');

    //送出認證信
    Route::post('sendSNS', 'senSns@index');

    //取得特定通道的佔成
    Route::post('getPerc', 'system\getPerc@index');

    //重新取得金流源報表_1
    Route::post('/reMoneyReport', 'report\reMoneyReport@index');

    //上傳帳務
    Route::post('/upTransExcel', 'trans\upTransExcel@index');

    //帳務同步 - 取得
    Route::post('/getTransAsync', 'trans\upTransAsync@get');

    //帳務同步 - 送出
    Route::post('/upTransAsync', 'trans\upTransAsync@index');


    //重新取得伺服器狀態
    Route::post('/reMoneyStatus', 'money\moneyServerStatus@index');

    //重新取得伺服器 連結 狀態
    Route::post('/reMoneyLinkStatus', 'money\reMoneyLinkStatus@index');

    //重新取得跑分 狀態
    Route::post('/reRunStatus', 'run\reRunStatus@index');

    //測試API
    Route::post('sendApi', 'sendApi@index');

    //測試API - 代付
    Route::post('sendApiP', 'sendApi@indexP');

?>
