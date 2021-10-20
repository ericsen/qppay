<?php

/**
 * 更改語言
 */
Route::any('/setLanguage', function(){
    session()->put('lang', Request()->get('languageInput', 'ch'));
    return Redirect::back();
});

//登入驗證 頁面
Route::get('/login', 'login\loginOut@login');
//登入驗證 功能
Route::post('/login', 'login\loginOut@check');

//登出
Route::get('/logout', 'login\loginOut@logout');

//選擇驗證方式
Route::get('/selectAuth', 'login\selectAuth@index');

//綁定手機
Route::get('/phone', 'login\phone@index');
Route::post('/phone', 'login\phone@set');

//綁定GA
Route::get('/ga', 'login\ga@index');
Route::post('/ga', 'login\ga@set');

//測試頁面
Route::get('/test', 'test@index');

/********************************** 主 頁 *************************************************/

//主頁面 - 儀表板
Route::get('/', 'dashboard@index');

//主頁面 - 儀表板
Route::get('/profile', 'profile@index');
Route::post('/profile', 'profile@set');
Route::put('/profile', 'profile@new');
Route::options('/profile', 'profile@del');

/********************************** 帳 務 *************************************************/

//帳務中心 - 新增商戶
Route::get('/accountAdd', 'account\accountAdd@index');
Route::post('/accountAdd', 'account\accountAdd@set');

//帳務中心 - 新增管理
Route::get('/accountAddAdmin', 'account\accountAddAdmin@index');
Route::post('/accountAddAdmin', 'account\accountAddAdmin@set');

//帳務中心 - 新增跑分
Route::get('/accountAddRun', 'account\accountAddRun@index');
Route::post('/accountAddRun', 'account\accountAddRun@set');

//帳務中心 - 帳號列表
Route::get('/accountList', 'account\accountList@index');
Route::post('/accountList', 'account\accountList@set');
Route::options('/accountList', 'account\accountList@reSet');
Route::put('/accountList', 'account\accountList@upPoints');

//帳務中心 - 提現
Route::get('/accountPickMoney', 'account\accountPickMoney@index');
Route::post('/accountPickMoney', 'account\accountPickMoney@set');
Route::put('/accountPickMoney', 'account\accountPickMoney@new');
Route::get('/accountPickMoneyDown', 'account\accountPickMoney@downMore');

//帳務中心 - 提現 - 審核
Route::get('/accountPickList', 'account\accountPickList@index');
Route::put('/accountPickList', 'account\accountPickList@diPass');
Route::options('/accountPickList', 'account\accountPickList@pass');

/********************************** 報 表 *************************************************/

//報表中心 - 總表
Route::get('/pointsReport', 'report\pointsReport@index');
Route::get('/pointsReportDown', 'report\pointsReport@downMore');

//報表中心 - 收款
Route::get('/pointsInReport', 'report\pointsInReport@index');
Route::get('/pointsInReportDown', 'report\pointsInReport@downMore');

//報表中心 - 出款
Route::get('/pointsOutReport', 'report\pointsOutReport@index');
Route::get('/pointsOutReportDown', 'report\pointsOutReport@downMore');

//報表中心 - 分紅
Route::get('/commReport', 'report\commReport@index');
Route::get('/commReportDown', 'report\commReport@downMore');

//報表中心 - 補扣點
Route::get('/addpointsReport', 'report\addpointsReport@index');

//報表中心 - 餘額變動
Route::get('/memberPointsReport', 'report\memberPointsReport@index');
Route::get('/memberPointsReportDown', 'report\memberPointsReport@downMore');

//報表中心 - 金流源
Route::get('/moneyReport', 'report\moneyReport@index');
//報表中心 - 金流源 - 手動上分
Route::post('/moneyReport', 'report\moneyReport@set');
//報表中心 - 金流源 - 手動 OTP
Route::put('/moneyReport', 'report\moneyReport@setOtp');
//報表中心 - 金流源 - 快速補單
Route::options('/moneyReport', 'report\moneyReport@newOrder');
//報表中心 - 金流源 - 轉換機器
Route::patch('/moneyReport', 'report\moneyReport@changeOrder');
//報表中心 - 金流源 - 轉手動
Route::delete('/moneyReport', 'report\moneyReport@stopOrder');


//報表中心 - 裝置收支報表
Route::get('/machineReport', 'report\machineReport@index');

//報表中心 - 銀行明細
Route::get('/bankReport', 'report\bankReport@index');


/********************************** 統 計 *************************************************/

//統計圖表 - 總計
Route::get('/transactionReport', 'charts\transactionReport@index');

//統計圖表 - 收款
Route::get('/transactionSumReport', 'charts\transactionSumReport@index');

//統計圖表 - 出款
Route::get('/transactionOutSumReport', 'charts\transactionOutSumReport@index');

//統計圖表 - 類型
Route::get('/transactionTypeReport', 'charts\transactionTypeReport@index');

//統計圖表 - 銀行
Route::get('/transactionBankReport', 'charts\transactionBankReport@index');


//統計圖表 - 商戶
Route::get('/transactionAccountReport', 'charts\transactionAccountReport@index');




/********************************** 設 定 *************************************************/


//系統設定 - 系統信息
Route::get('/systemApiInfo', 'system\systemApiInfo@index');

//系統設定 - 金流對應
Route::get('/systemApiLink', 'system\systemApiLink@index');

//系統設定 - 金流設定
Route::get('/systemMasterApi', 'system\systemMasterApi@index');
Route::post('/systemMasterApi', 'system\systemMasterApi@new');
Route::put('/systemMasterApi', 'system\systemMasterApi@set');

//系統設定 - 商戶通道設定
Route::get('/systemSlaveApi', 'system\systemSlaveApi@index');
Route::options('/systemSlaveApi', 'system\systemSlaveApi@options');
Route::post('/systemSlaveApi', 'system\systemSlaveApi@new');
Route::put('/systemSlaveApi', 'system\systemSlaveApi@set');


//系統設定 - 參數設定
Route::get('/systemSeting', 'system\systemSeting@index');
Route::post('/systemSeting', 'system\systemSeting@set');

//系統設定 - 綁定IP
Route::get('/systemSetingIp', 'system\systemSetingIp@index');
Route::post('/systemSetingIp', 'system\systemSetingIp@new');
Route::put('/systemSetingIp', 'system\systemSetingIp@set');
Route::options('/systemSetingIp', 'system\systemSetingIp@del');

//系統設定 - 綁定下發IP
Route::get('/systemPickIp', 'system\systemPickIp@index');
Route::post('/systemPickIp', 'system\systemPickIp@new');
Route::put('/systemPickIp', 'system\systemPickIp@set');
Route::options('/systemPickIp', 'system\systemPickIp@del');

//系統設定 - 綁定APIIP
Route::get('/systemApiIp', 'system\systemApiIp@index');
Route::post('/systemApiIp', 'system\systemApiIp@new');
Route::put('/systemApiIp', 'system\systemApiIp@set');
Route::options('/systemApiIp', 'system\systemApiIp@del');

//系統設定 - 綁定代付IP
Route::get('/systemApplyforIp', 'system\systemApplyforIp@index');
Route::post('/systemApplyforIp', 'system\systemApplyforIp@new');
Route::put('/systemApplyforIp', 'system\systemApplyforIp@set');
Route::options('/systemApplyforIp', 'system\systemApplyforIp@del');

//接口調試
Route::get('/systemTestApi', 'system\systemTestApi@index');

//系統設定 - 權限設定
Route::get('/systemLevel', 'system\systemLevel@index');
Route::post('/systemLevel', 'system\systemLevel@set');

//系統設定 - 銀行設定 - 帳務
Route::get('/systemBank', 'system\systemBank@index');
Route::post('/systemBank', 'system\systemBank@new');
Route::put('/systemBank', 'system\systemBank@set');

//系統設定 - 銀行設定 - 通道
Route::get('/systemBankStatus', 'system\systemBankStatus@index');
Route::put('/systemBankStatus', 'system\systemBankStatus@set');

/**********************************   帳務中心   *************************************************/

//帳務中心 - 上傳帳務
Route::get('/transUpExcel', 'trans\transUpExcel@index');

//帳務中心 - 總表
Route::get('/transReport', 'trans\transReport@index');
Route::post('/transReport', 'trans\transReport@new');
Route::put('/transReport', 'trans\transReport@set');

//帳務中心 - 帳表同步
Route::get('/transReportAsync', 'trans\transReportAsync@index');


/**********************************   LOG   *************************************************/

//LOG - 金流
Route::get('/logMasterApi', 'log\logMasterApi@index');

//LOG - 介接
Route::get('/logSlaveApi', 'log\logSlaveApi@index');

//LOG - 登入
Route::get('/logLogin', 'log\logLogin@index');

//LOG - 操作
Route::get('/logManager', 'log\logManager@index');

//LOG - 金流源
Route::get('/logMoney', 'log\logMoney@index');

//LOG - 收支幫手
Route::get('/logMoneyServer', 'log\logMoneyServer@index');

//LOG - 監控
Route::get('/logMoneyLook', 'log\logMoneyLook@index');

//LOG - 代付轉移
Route::get('/logApplyfor', 'log\logApplyfor@index');

//LOG - 暫收
Route::get('/logTempMoney', 'log\logTempMoney@index');
Route::post('/logTempMoney', 'log\logTempMoney@new');

//官網來訊息
Route::get('/logContact', 'log\logContact@index');

//直連帳號列表
Route::get('/logPayAccount', 'log\logPayAccount@index');

/**********************************   金流源   *************************************************/

//商戶設定
Route::get('/moneyAccount', 'money\moneyAccount@index');
Route::post('/moneyAccount', 'money\moneyAccount@new');
Route::put('/moneyAccount', 'money\moneyAccount@set');

//商戶通道
Route::get('/moneyLink', 'money\moneyLink@index');
Route::post('/moneyLink', 'money\moneyLink@new');
Route::put('/moneyLink', 'money\moneyLink@set');

//商戶狀態
Route::get('/moneyStatus', 'money\moneyStatus@index');

//伺服器綁定
Route::get('/moneyServerSeting', 'money\moneyServerSeting@index');
Route::post('/moneyServerSeting', 'money\moneyServerSeting@new');
Route::put('/moneyServerSeting', 'money\moneyServerSeting@set');
Route::patch('/moneyServerSeting', 'money\moneyServerSeting@update');
Route::options('/moneyServerSeting', 'money\moneyServerSeting@upImg');
Route::delete('/moneyServerSeting', 'money\moneyServerSeting@delete');

//伺服器連結
Route::get('/moneyServerLink', 'money\moneyServerLink@index');
Route::post('/moneyServerLink', 'money\moneyServerLink@new');
Route::put('/moneyServerLink', 'money\moneyServerLink@set');
Route::delete('/moneyServerLink', 'money\moneyServerLink@delete');

//伺服器狀態
Route::get('/moneyServerStatus', 'money\moneyServerStatus@index');

//伺服器連結狀態
Route::get('/moneyServerLinkStatus', 'money\moneyServerLinkStatus@index');

/********************************** 跑分系統 *************************************************/

//跑分設定
Route::get('/runAccount', 'run\runAccount@index');
Route::post('/runAccount', 'run\runAccount@set');

//跑分連結
Route::get('/runLink', 'run\runLink@index');
Route::post('/runLink', 'run\runLink@new');
Route::put('/runLink', 'run\runLink@set');

//跑分狀態
Route::get('/runStatus', 'run\runStatus@index');

//跑分報表
Route::get('/runReport', 'run\runReport@index');
Route::post('/runReport', 'run\runReport@set');

//跑分分紅
Route::get('/runComm', 'run\runComm@index');
Route::post('/runComm', 'run\runComm@new');


/********************************** 租版專區 *************************************************/

//報表中心 - 長榮 - 總表
Route::get('/pointsReportQpr', 'reportQ\pointsReport@qpr');

//報表中心 - JST - 總表
Route::get('/pointsReportJst', 'reportQ\pointsReport@jst');

//報表中心 - ASIA - 總表
Route::get('/pointsReportAsia', 'reportQ\pointsReport@asia');

//報表中心 - ROY - 總表
Route::get('/pointsReportRoy', 'reportQ\pointsReport@roy');

//報表中心 - VNPay - 總表
Route::get('/pointsReportVnpay', 'reportQ\pointsReport@vnpay');

//報表中心 - VNPay - 總表
Route::get('/pointsReportRm', 'reportQ\pointsReport@rm');



