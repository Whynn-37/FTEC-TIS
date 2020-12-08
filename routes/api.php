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
Route::get('load-revision', 'TrialChecksheetController@loadRevision');
Route::get('load-trial-number', 'TrialChecksheetController@loadTrialNumber');
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
Route::get('load-finished-inspection','ApprovalController@loadFinishedInspection');
Route::get('generate-trial-evaluation-result','ApprovalController@generateTrialEvaluationResult');
Route::get('generate-second-page','ApprovalController@generateSecondPage');
Route::post('load-approval', 'ApprovalController@loadApproval');
Route::get('load-disapproved','ApprovalController@loadDisapproved');
Route::post('approved','ApprovalController@approved');

Route::get('pdf-test', 'FpdfController@pdfTest');