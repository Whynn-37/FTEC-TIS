<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\LoginUser;
class PageController extends Controller
{
    public function __construct()
    {
        $this->middleware("checksession")->except(['get_credentials','login_page']);
        $this->middleware("preventback")->only(['login_page']);    
    }

    public function get_credentials($id)
    {
            $LoginUser = new LoginUser();

            $user = 
            [
                'name'   => $id ,
            ];

            $data = $LoginUser->selectUser($user);
        
            $result = $this->set_session($data);

            if ($result) 
                return redirect('trial-checksheet');
            else
                return redirect('login');
    }

    public function set_session($data)
    {
        if ($data != null) 
        {
            // set session
            // return $data;
            session(
            [
                'name'          => $data->name,
                'fullname'      => $data->fullname,
                'access_level'  => $data->access_level,
                'position'      => $data->position,
                'email'         => $data->emailadd,
            ]);
             $datax = request()->session()->all();
            //return session('name');
            // return $datax;
            return true;
        }
        else
            // wala na select
            // no found
            return false;
    }

    public function logout()
    {
        request()->session()->flush();
        return redirect('login');
    }

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

    public function history_page ()
    {
        return view('History.history');
    }

    public function supplier_page ()
    {
        return view('Management.supplier');
    }

    public function activity_log_page ()
    {
        return view('Management.activity_log');
    }
}