<?php

//沒有帶路徑的錯誤
Route::any('/', 'error@index');

//測試用
Route::any('/test', 'test@index');

//資訊校驗
Route::any('/check', 'check@index');


//支付
Route::any('/pay', 'pay@index');
//代收回覆
Route::any('/rePay', 'rePay@index');

//代付
Route::any('/applyfor', 'applyfor@index');
//代付回覆
Route::any('/reApplyfor', 'reApplyfor@index');

//取得訂單
Route::any('/orderquery', 'orderquery@index');

//取得存款
Route::any('/getpoints', 'getpoints@index');


//交易成功
Route::any('/home', 'home@index');

//---------------------------------- 金流回傳 ----------------------------------//


//豪杰 - 代收
Route::any('/sendHGBackApi', 'callBack\other\hager@index');

//豪杰 - 代付
Route::any('/sendHGABackApi', 'callBack\other\hagerApplyfor@index');

//印尼 - 代收
Route::any('/sendMidBackApi', 'callBack\other\mid@index');

//印尼 - 代付
Route::any('/sendMidABackApi', 'callBack\other\midApplyfor@index');


//QuickPay - 代收
// Route::any('/sendQPBackApi', 'callBack\quickPay@index');

//QuickPay - 代付
// Route::any('/sendQPABackApi', 'callBack\quickPayApplyfor@index');


//QuickPay - 三方 - 代收
Route::any('/sendQPOutBackApi', 'callBack\quickPayOut@index');

//QuickPay - 三方 - 代付
Route::any('/sendQPOutABackApi', 'callBack\quickPayOutApplyfor@index');


//QuickPay - 四方 - 代收
Route::any('/sendQPBuyBackApi', 'callBack\quickPayBuy@index');

//QuickPay - 四方 - 代付
Route::any('/sendQPBuyABackApi', 'callBack\quickPayBuyApplyfor@index');




