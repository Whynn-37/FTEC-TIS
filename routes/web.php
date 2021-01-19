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
Route::get('history', 'PageController@history_page');
Route::get('supplier', 'PageController@supplier_page');
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
Route::get('load-inspection-reason', 'TrialChecksheetController@loadInspectionReason');
Route::get('load-revision', 'TrialChecksheetController@loadRevision');
Route::get('load-trial-number', 'TrialChecksheetController@loadTrialNumber');
Route::get('load-application-date', 'TrialChecksheetController@loadApplicationDate');
Route::get('load-details', 'TrialChecksheetController@loadDetails');
Route::patch('update-judgment','TrialChecksheetController@updateJudgment');
Route::post('store-igm', 'TrialChecksheetController@storeIgm');
Route::get('load-igm', 'TrialChecksheetController@loadIgm');
Route::post('finished-checksheet', 'TrialChecksheetController@finishedChecksheet');
Route::get('load-igm-ng', 'TrialChecksheetController@loadIgmNg');

// CHecksheet Item
Route::post('store-items','ChecksheetItemController@storeItems');
Route::delete('delete-item','ChecksheetItemController@deleteItem');

// Checksheet Data
Route::post('store-datas','ChecksheetDataController@storeDatas');
Route::delete('delete-data','ChecksheetDataController@deleteDatas');

//Supplier
Route::post('store-supplier', 'SupplierController@storeSupplier');
Route::get('load-supplier', 'SupplierController@loadSupplier');
Route::post('update-supplier', 'SupplierController@updateSupplier');
Route::delete('delete-supplier', 'SupplierController@deleteSupplier');


//Cycle Time
Route::get('load-cycle-time', 'TaktTimeController@loadCycleTime');
Route::post('start-cycle-time','TaktTimeController@startCycleTime');
Route::post('stop-cycle-time', 'TaktTimeController@stopCycleTime');

//DownTime
Route::get('load-down-time', 'DownTimeController@loadDownTime');
Route::post('downtime', 'DownTimeController@startDownTime');

//approval
Route::get('load-inspection-data', 'ApprovalController@loadInspectionData');
Route::patch('edit-hinsei', 'ApprovalController@editHinsei');
Route::patch('edit-data', 'ApprovalController@editData');
Route::get('load-inspection-finished','ApprovalController@loadFinishedInspection');
Route::get('generate-trial-evaluation-result/{id}','ApprovalController@generateTrialEvaluationResult');
Route::get('generate-second-page/{id}','ApprovalController@generateSecondPage');
Route::post('approved','ApprovalController@approved');

Route::get('pdf-test', 'FpdfController@pdfTest');

Route::get('for-evaluator','MailController@forEvaluator');
Route::get('for-approval','MailController@forApproval');
Route::get('for-disapproval','MailController@forDispproval');
Route::get('back-to-approval','MailController@backToApproval');

//history
Route::get('history-search/{status}', 'HistoryController@historySearch');
Route::get('get-inspection-history', 'HistoryController@getInspectionHistory');