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
    return view('Template.template');
});

Route::get('login', 'PageController@login_page');
Route::get('trial-checksheet', 'PageController@trial_checksheet_page');
Route::get('finished-inspection', 'PageController@finished_evaluation_page');
Route::get('disapproved-inspection', 'PageController@disapproved_evaluation_page');
Route::get('approval', 'PageController@approver_page');
Route::get('/trial-checksheet/{id}', function ($id) {
    return $id;
});

Route::get('test', 'TestController@test');
