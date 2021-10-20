<?php

//支付收銀台
Route::get('/pay', 'pay@index');

//外部支付收銀台
Route::get('/payinr', 'payinr@index');


//四方支付收銀台
Route::get('/payBuy', 'payBuy@index');

