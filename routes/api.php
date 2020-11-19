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
Route::get('load-trial-stage', 'TrialChecksheetController@loadTrialStage');
Route::get('load-details', 'TrialChecksheetController@loadDetails');
Route::post('store-igm', 'TrialChecksheetController@storeIgm');
Route::get('load-igm', 'TrialChecksheetController@loadIgm');
<<<<<<< HEAD
Route::post('store-items','TrialChecksheetController@storeItems');
Route::delete('delete-item','TrialChecksheetController@deleteItem');
Route::post('store-datas','TrialChecksheetController@storeDatas');
Route::delete('delete-datas','TrialChecksheetController@deleteDatas');
Route::get('load-inspection-finished','TrialChecksheetController@loadFinishedInspection');
=======
>>>>>>> local

// CHecksheet Item
Route::post('store-items','ChecksheetItemController@storeItems');
Route::delete('delete-item','ChecksheetItemController@deleteItem');

// Checksheet Data
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
