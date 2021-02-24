<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('test', 'TestController@test');

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
Route::get('get-for-inspection', 'TrialChecksheetController@getForInspection');
Route::get('get-disapproved-inspection', 'TrialChecksheetController@getDisapprovedInspection');

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
Route::get('approved','ApprovalController@approved');
Route::post('edit-item','ApprovalController@editItem');



Route::post('pdf-test', 'FpdfController@pdfTest');

Route::get('send-email/{id}/{status}','MailController@sendEmail');
Route::get('for-evaluator','MailController@forEvaluator');
Route::get('for-approval','MailController@forApproval');
Route::get('for-disapproval','MailController@forDispproval');
Route::get('back-to-approval','MailController@backToApproval');

//history
Route::get('history-search/{status}', 'HistoryController@historySearch');
Route::get('get-inspection-history', 'HistoryController@getInspectionHistory');
Route::get('edit-data-inspection', 'HistoryController@editDataInspection');

//Activity Logs
Route::get('load-activity-logs', 'ActivityLogController@loadActivityLog');

