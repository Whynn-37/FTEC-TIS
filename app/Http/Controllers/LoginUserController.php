<?php

namespace App\Http\Controllers;

use App\LoginUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LoginUserController extends Controller
{

    public function token()
    {
        //token
        return csrf_token();
    }
    public function selectAll(LoginUser $user)
    {
        return $user->selectAll();
    }
    public function selectUser($id)
    {
        $user = new LoginUser();

        $data = $user->selectUser($id);

        if ($data != null) {
            return $data;
        }
    }

    public function loginAuthentication(Request $request)
    {
        $validator = Validator::make(request()->all(), [
            'txt_employee_id' => 'required',
            'txt_employee_password' => 'required',
        ]);

        if ($validator->fails()) {
            return $data = [
                "response" => "warning",
                "value" => $validator->errors(),
            ];
        } else {

            $datas = request()->except('_token');
            $datas = [
                'name' => $request->txt_employee_id,
                'password' => $request->txt_employee_password,

            ];

            try
            {

                $user = new LoginUser();
                $data = $user->selectUser($datas);

                if ($data) {

                    session(['name' => $data->name,
                        'fullname' => $data->fullname,
                        'access_level' => $data->access_level,
                        'position' => $data->position,
                        'emailadd' => $data->emailadd,
                    ]);

                    $data = request()->session()->all();
                    // return redirect('trial-checksheet');
                    $data = [
                        "response" => "success",
                        "value" => ['access_level' => $data['access_level'], 'position' => $data['position']],
                    ];

                } else {
                    $data = [
                        "response" => "fail",
                        "value" => "Invalid Credentials",
                    ];
                }

            } catch (\Throwable $th) {
                $data = [
                    "response" => "error",
                    "value" => $th->getMessage(),
                ];
            }
        }
        return response()->json($data);
    }
}
