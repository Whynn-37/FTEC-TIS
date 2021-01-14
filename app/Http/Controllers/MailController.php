<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\LoginUser;
use App\TrialChecksheet;
use App\Mail\SendMail;

class MailController extends Controller
{
    public function sendEmail($trial_checksheet_id, $status, $attachment = [])
    {
        $TrialChecksheet = new TrialChecksheet();
        $LoginUser = new LoginUser();
        
        $data = $TrialChecksheet->getAllData($trial_checksheet_id);

        if($status == 'after_inspection')
        {
            $incharge = 
            [
                'Position' => 'Leader',
                // 'Fullname' => ,
            ];

            $subject = 'For Evaluation';
        }
        else if($status == 'after_evaluation')
        {
            // $incharge = 
            // [
            //     'Position' => 'Manager',
            //     'Fullname' => ,
            // ];

            $subject = 'For Approval';
        }
        else if($status == 'approved')
        {
            // $incharge = 
            // [
            //     'Position' => 'General Manager',
            //     'Fullname' => ,
            // ];

            $subject = 'Approved';
        }
        else if($status == 'disapproved')
        {
            // $incharge = 
            // [
            //     'Position' => 'Secret',
            //     'Fullname' => 'Inyida Ngoki',
            // ];

            $subject = 'Disapproved';
        }

        // $receipient = $LoginUser->sendEmailTo($incharge);
        $receipient =  
        [
            'jed.relator@fujitsu.com',
            // 'markjohrel.manzano@fujitsu.com',
            // 'georgebien.almenanza@fujitsu.com',
            // 'terrymerwin.balahadia@fujitsu.com',
            // 'markangelo.cantalejo@fujitsu.com',
        ];

        Mail::to($receipient)->send(new SendMail($data, $attachment, 'Mail.email_notification', $subject));
    }
}