<?php

/**********************************   金流源   *************************************************/

//接收訊息 - 收款
// Route::post('/pay', 'money\pay@index');

//接收訊息 - 付款
// Route::post('/applyfor', 'money\applyfor@index');


/**********************************   監控工具   *************************************************/
//取得腳本 TCB OTP
Route::post('/getVersion', 'tools\getVersion@otpV');

//取得腳本 QuickPay
Route::post('/getVersionApp', 'tools\getVersion@appV');

//取得腳本 TCB
Route::post('/getVersionTcb', 'tools\getVersion@tcbV');

//取得腳本 MOMO
Route::post('/getVersionMomo', 'tools\getVersion@momoV');

//接收訊息
Route::post('/sendMsg', 'tools\sendMsg@index_v1');
Route::post('/sendMsgv2', 'tools\sendMsg@index_v2');

//接收聯繫
Route::post('/line', 'tools\line@index');
Route::post('/linev2', 'tools\line@index_v2');

//接收 Smart OTP 訊號
Route::post('/getAppOtpCode', 'tools\getCode@index');

//送出取得的 OTP
Route::post('/sendAppOtp', 'tools\sendAppOtp@index');

//接收 Smart OTP 訊號 - 結束
Route::post('/sendAppOtpEnd', 'tools\sendAppOtpEnd@index');

/**********************************   收支小幫手   *************************************************/

//檢查代號
Route::post('/checkCode', 'server\checkCode@index');
//檢查代號 - 手機版
Route::post('/checkCodeMoblie', 'server\checkCode@indexMoblie');

//取得銀行總表
Route::post('/getBank', 'server\getBank@index');

//取得訂單
Route::post('/getOrder', 'server\getOrder@index');

//刷新訂單
Route::post('/reOrder', 'server\reOrder@index');
//刷新訂單 - 手機版
Route::post('/reOrderMoblie', 'server\reOrder@index');

//取得訂單狀態


//取得銀行明細
Route::post('/setBankInfo', 'server\setBankInfo@index');

//設定 OTP 識別碼
Route::post('/setOtpID', 'server\setOtpID@index');

//取得 OTP
Route::post('/getOtp', 'server\getOtp@index');

//取得 登入 OTP
Route::post('/getLoginOtp', 'server\getOtp@login');


//設定 登入 驗證圖片
Route::post('/setLoginPic', 'server\loginPic@update');
//取得 登入 驗證碼
Route::post('/getLoginPicCode', 'server\loginPic@get');

//回送訂單狀態
Route::post('/setOrder', 'server\setOrder@index');

//維持連線
Route::post('/holdLine', 'server\holdLine@index');

//銀行下架
Route::post('/setUseinfo', 'server\setUseinfo@index');

//設定連線狀態
Route::post('/setLine', 'server\setLine@index');

//發送餘額
Route::post('/setPoints', 'server\setPoints@index');

//發送手續費


//發送銀行端交易編號
Route::post('/setOutTransactionID', 'server\setOutTransactionID@index');

//儲存支付完成頁面
Route::post('/savePayPage', 'server\savePayPage@index');


