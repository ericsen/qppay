<?php

//沒有帶路徑的錯誤
Route::any('/', 'error@index');

//取得 APP版本
Route::post('/version', 'version@index');

//登入
Route::post('/login', 'login@index');
Route::post('/logout', 'login@out');

//維持登入狀態
Route::post('/line', 'line@index');

//取得訂單
Route::post('/order', 'order@index');

//取得分紅
Route::post('/comm', 'comm@index');

//完成訂單
Route::post('/send', 'send@index');