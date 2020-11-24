<?php

namespace App\Http\Controllers;

use App\LoginUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class LoginUserController extends Controller
{

    public function token()
    {
        return csrf_token();
    }

    public function selectAll(LoginUser $loginUser)
    {
        return $loginUser->selectAll();
    }
    
    public function selectUser($id)
    {
        $user = new LoginUser();

        $data = $user->selectUser($id);

        if ($data != null) 
        {
            return $data;
        }
    }

    public function loginAuthentication(LoginUser $LoginUser, Request $Request)
    {
        $employee_id = $Request->txt_employee_id;
        $password = $Request->txt_employee_password;

        $validator = Validator::make($Request->all(), 
        [
            'txt_employee_id'       => 'required',
            'txt_employee_password' => 'required',
        ]);

        if ($validator->fails()) 
        {
            $data = 
            [
                'response'  => "warning",
                'value'     => $validator->errors(),
            ];
        } 
        else 
        {
            $data = $Request->except('_token');
            $data = 
            [
                'name'      => $employee_id,
                'password'  => $password,
            ];

            try
            {
                $user = $LoginUser->selectUser($data);

                $data = 
                [
                    'response' => 'fail',
                    'value' => 'Invalid Credentials',
                ];

                if ($user) 
                {
                    session(
                    [
                        'name'          => $user->name,
                        'fullname'      => $user->fullname,
                        'access_level'  => $user->access_level,
                        'position'      => $user->position,
                        'email'         => $user->emailadd,
                    ]);

                    $session = $Request->session()->all();

                    $data = 
                    [
                        'response'  => 'success',
                        'value'     => ['access_level' => $session['access_level'], 'position' => $session['position']],
                    ];
                } 
            } 
            catch (\Throwable $th) 
            {
                $data = 
                [
                    'response' => 'Error',
                    'value' => $th->getMessage(),
                ];
            }
        }

        return $data;
    }
}
