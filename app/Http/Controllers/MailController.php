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

        $inspect_by = $LoginUser->getFullName($data['inspect_by']);
        $evaluated_by = $LoginUser->getFullName($data['evaluated_by']);
        $approved_by = $LoginUser->getFullName($data['approved_by']);
        $disapproved_by = $LoginUser->getFullName($data['disapproved_by']);

        $data['name_inspect_by'] = $inspect_by['fullname'];
        $data['name_evaluated_by'] = $evaluated_by['fullname'];
        $data['name_approved_by'] = $approved_by['fullname'];
        $data['name_disapproved_by'] = $disapproved_by['fullname'];

        $receipient =  
        [
            'jed.relator@fujitsu.com',
            'markjohrel.manzano@fujitsu.com',
            'georgebien.almenanza@fujitsu.com',
            'terrymerwin.balahadia@fujitsu.com',
        ];

        if($status == 're_inspect')
        {
            $receipient = $LoginUser->sendEmailTo($data['inspect_by']);
            $receipient = $receipient['EmailAdd'];

            $subject = 'For Re-inspection';
        }
        else if($status == 'for_evaluation')
        {
            // $receipient = [
            //     'EmailAdd' => 'hirosawa-t@jp.fujitsu.com',
            //     'EmailAdd' => 'sawazaki-koji@jp.fujitsu.com',
            //     'EmailAdd' => 'satou.yutaka@jp.fujitsu.com',
            // ];

            $subject = 'For Evaluation';
        }
        else if($status == 're_evaluation')
        {
            $receipient = $LoginUser->sendEmailTo($data['evaluated_by']);
            $receipient = $receipient['EmailAdd'];

            $subject = 'For Re-Evaluation';
        }
        else if($status == 're_evaluation_history')
        {
            $receipient = $LoginUser->sendEmailTo($data['evaluated_by']);
            $receipient = $receipient['EmailAdd'];

            $subject = 'For Re-Evaluation.';
        }
        else if($status == 're_evaluation_approver')
        {
            $receipient = $LoginUser->sendEmailTo($data['evaluated_by']);

            $receipient = $receipient['EmailAdd'];

            $subject = 'For Re-Evaluation - Approver';
        }
        else if($status == 'for_approval')
        {
            // $receipient = [
            //     'EmailAdd' => 'koike.tamotsu@jp.fujitsu.com',
            //     'EmailAdd' => 'saito.tomoyuki@fujitsu.com',
            // ];

            $subject = 'For Approval';
        }

        else if($status == 're_approval')
        {
            $receipient = $LoginUser->sendEmailTo($data['approved_by']);
            $receipient = $receipient['EmailAdd'];

            $subject = 'For Re-Approval';
        }
        else if($status == 'approved')
        {
            // $receipient = [
            //     'EmailAdd' => 'hirosawa-t@jp.fujitsu.com',
            //     'EmailAdd' => 'sawazaki-koji@jp.fujitsu.com',
            //     'EmailAdd' => 'satou.yutaka@jp.fujitsu.com',
            //     'EmailAdd' => 'koike.tamotsu@jp.fujitsu.com',
            //     'EmailAdd' => 'saito.tomoyuki@fujitsu.com',
            //     'EmailAdd' => 'satou.hideko@jp.fujitsu.com',
            // ];

            $subject = 'Approved';
        }
        // else if($status == 'disapproved')
        // {
        //     $receipient = $LoginUser->sendEmailTo($data['evaluated_by']);

        //     $subject = 'Disapproved';
        // }

        Mail::to($receipient)->bcc('jed.relator@fujitsu.com')->send(new SendMail($data, $attachment, 'Mail.email_notification', $subject));

        if (count(Mail::failures()) > 0) 
            return 'There was a problem sending the email, Please try again';
        else
        {
            return 'Email Send';
        }
    }
}