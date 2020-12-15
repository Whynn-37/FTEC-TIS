<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\LoginUser;
use App\Mail\SendMail;

class MailController extends Controller
{
    public function forEvaluator()
    {
        $LoginUser = new LoginUser();

        // return $receipient = $LoginUser->getMailToLeader();
        $receipient =  
        [
            'jed.relator@fujitsu.com',
            'markjohrel.manzano@fujitsu.com',
            'georgebien.almenanza@fujitsu.com',
            'terrymerwin.balahadia@fujitsu.com',
            'markangelo.cantalejo@fujitsu.com',
        ];

        $data = [];

        $view = 'Mail.test';
        $subject = 'For Evaluation';

        Mail::to($receipient)->send(new SendMail($data, $view, $subject));

        if (count(Mail::failures()) > 0) 
        {
            $result = false;
            $message = 'There was a problem sending the email, Please try again';
        }
        else
        {
            $result = true;
            $message = 'Successfully Send';
        }

        return 
        [
            'status'    => $result,
            'message'   => $message
        ];
    }

    public function forApproval()
    {

    }

    public function forDispproval()
    {

    }

    public function backToApproval()
    {

    }
}
