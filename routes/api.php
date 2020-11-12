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

//Supplier
<<<<<<< HEAD
Route::post('store-supplier', 'SupplierController@storeSupplier');

//Cycle Time
Route::post('start-cycle-time','TaktTimeController@startCycleTime');
=======
Route::get('store-supplier', 'SupplierController@storeSupplier');

//DownTime
Route::post('start-down-time', 'DownTimeController@startDownTime');
>>>>>>> local
