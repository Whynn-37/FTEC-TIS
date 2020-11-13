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

    public function evaluation_page ()
    {
        return view('Evaluator.evaluation');
    }

    public function approver_page ()
    {
        return view('Approver.approval');
    }
}
