<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('Login.login');
});

Route::get('login', 'PageController@login_page');
Route::get('trial-checksheet', 'PageController@trial_checksheet_page');
Route::get('evaluation', 'PageController@evaluation_page');
Route::get('approval', 'PageController@approver_page');
Route::get('/trial-checksheet/{id}', function ($id) {
    return $id;
});

Route::get('test', 'TestController@test');
//login controller 
Route::get('select-all', 'LoginUserController@selectAll');
Route::get('select-user/{id}', 'LoginUserController@selectUser');
Route::post('login-authentication', 'LoginUserController@loginAuthentication');

Route::get('get-credentials/{id}', 'PageController@get_credentials');
Route::get('logout', 'PageController@logout');

//token
Route::get('token','LoginUserController@token');

//Trial Ledger
Route::post('store-trial-ledger', 'TrialLedgerController@storeTrialLedger');

//Trial Checksheet
Route::get('load-partnumber', 'TrialChecksheetController@loadPartnumber');
Route::get('load-revision', 'TrialChecksheetController@loadRevision');
Route::get('load-trial-number', 'TrialChecksheetController@loadTrialNumber');
Route::get('load-details', 'TrialChecksheetController@loadDetails');
Route::get('store-igm', 'TrialChecksheetController@storeIgm');

//CHecksheet Item
Route::post('store-items','ChecksheetItemController@storeItems');
Route::delete('delete-item','ChecksheetItemController@deleteItem');

//Checksheet Data
Route::post('store-datas','ChecksheetDataController@storeDatas');
Route::delete('delete-datas','ChecksheetDataController@deleteDatas');

//Supplier
Route::post('store-supplier', 'SupplierController@storeSupplier');

//Cycle Time
Route::get('load-cycle-time', 'TaktTimeController@loadCycleTime');
Route::post('start-cycle-time','TaktTimeController@startCycleTime');
Route::patch('stop-cycle-time', 'TaktTimeController@stopCycleTime');

//DownTime
Route::get('load-down-time', 'DownTimeController@loadDownTime');
Route::post('downtime', 'DownTimeController@startDownTime');

//approval
Route::post('load-inspection-data', 'ApprovalController@loadInspectionData');

