<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
class LoginUser extends Model
{
    protected $connection = 'mydb';
    protected $table = 'tblUser';

    public function selectAll()
    {
        return LoginUser::all();
    }

    public function selectUser($where = null)
    {
        return LoginUser::select('name', 'fullname', 'access_level', 'position', 'emailadd')
        ->where($where)
        ->first();
    }

    public function sendEmailTo($incharge)
    {
        return LoginUser::where($incharge)
        ->get();
    }
}