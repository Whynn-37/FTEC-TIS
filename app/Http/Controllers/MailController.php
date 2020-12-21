<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\LoginUser;
use App\TrialChecksheet;
use App\Mail\SendMail;

class MailController extends Controller
{
    public function sendEmail(Request $Request, TrialChecksheet $TrialChecksheet, LoginUser $LoginUser)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $status = $Request->status;
        
        $data = $TrialChecksheet->getAllData($trial_checksheet_id);

        if($status == 'after_inspection')
        {
            // $incharge = 
            // [
            //     'Position' => 'Leader',
            //     'Fullname' => ,
            // ];

            $view = 'Mail.for_evaluation';
            $subject = 'For Evaluator';
        }
        else if($status == 'after_evaluation')
        {
            // $incharge = 
            // [
            //     'Position' => 'Manager',
            //     'Fullname' => ,
            // ];

            $view = 'Mail.for_approval';
            $subject = 'For Approver';
        }
        else if($status == 'approved')
        {
            // $incharge = 
            // [
            //     'Position' => 'General Manager',
            //     'Fullname' => ,
            // ];

            $view = 'Mail.for_GM';
            $subject = 'For GM';
        }
        else if($status == 'disapproved')
        {
            // $incharge = 
            // [
            //     'Position' => 'Secret',
            //     'Fullname' => 'Inyida Ngoki',
            // ];

            $view = 'Mail.for_disapproval';
            $subject = 'For Disapproval';
        }

        // $receipient = $LoginUser->sendEmailTo($incharge);
        $receipient =  
        [
            // 'jed.relator@fujitsu.com',
            // 'markjohrel.manzano@fujitsu.com',
            // 'georgebien.almenanza@fujitsu.com',
            // 'terrymerwin.balahadia@fujitsu.com',
            'markangelo.cantalejo@fujitsu.com',
        ];

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
}