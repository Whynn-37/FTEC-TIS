<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    public function login_page ()
    {
        return view('Login.login');
    }

    public function trial_checksheet_page ()
    {
        return view('Checksheet.trial_checksheet');
    }

    public function finished_evaluation_page ()
    {
        return view('Evaluator.finished_evaluation');
    }
    
    public function disapproved_evaluation_page ()
    {
        return view('Evaluator.disapproved_evaluation');
    }

    public function approver_page ()
    {
        return view('Approver.approval');
    }
}
