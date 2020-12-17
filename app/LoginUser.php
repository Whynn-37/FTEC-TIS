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

    public function getMailToLeader()
    {
        return LoginUser::where('Position', 'LEADER')
        ->select('emailadd')
        ->get();
    }

    public function getMailToDirector()
    {
        return LoginUser::where('Position', 'DIRECTOR')
        ->select('emailadd')
        ->get();
    }

    public function getMailToEvaluator($evaluator)
    {
        return LoginUser::where('Fullname', $evaluator)
        ->select('emailadd')
        ->get();
    }

    public function getMailToApprover($approver)
    {
        return LoginUser::where('Fullname', $approver)
        ->select('emailadd')
        ->get();
    }
}
