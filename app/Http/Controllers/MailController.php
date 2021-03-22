<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use App\LoginUser;
use App\TrialChecksheet;
use App\Mail\SendMailQueue;

class MailController extends Controller
{
    public function sendEmail($trial_checksheet_id, $status, $attachment = [])
    {
        $LoginUser = new LoginUser();
        
        $data = TrialChecksheet::with('getApproval', 'getTrialLedger', 'getTrialLedger.getSupplier')->find($trial_checksheet_id);

        $to =  
        [
            'jed.relator@fujitsu.com',
            'markjohrel.manzano@fujitsu.com',
            'georgebien.almenanza@fujitsu.com',
            'terrymerwin.balahadia@fujitsu.com',
        ];

        $cc = [];
        $bcc = [];

        if($status == 're_inspect')
        {
            $to = $LoginUser->sendEmailTo($data['getApproval']['inspect_by']);
            $to = $to['EmailAdd'];

            $subject = 'For Re-inspection';
        }
        else if($status == 'for_evaluation')
        {
            // $to = [
            //     'EmailAdd' => 'hirosawa-t@jp.fujitsu.com',
            //     'EmailAdd' => 'sawazaki-koji@jp.fujitsu.com',
            //     'EmailAdd' => 'satou.yutaka@jp.fujitsu.com',
            // ];

            $subject = 'For Evaluation';
        }
        else if($status == 're_evaluation')
        {
            $to = $LoginUser->sendEmailTo($data['getApproval']['evaluated_by']);
            $to = $to['EmailAdd'];

            $subject = 'For Re-Evaluation';
        }
        else if($status == 're_evaluation_history')
        {
            $to = $LoginUser->sendEmailTo($data['getApproval']['evaluated_by']);
            $to = $to['EmailAdd'];

            $subject = 'For Re-Evaluation.';
        }
        else if($status == 're_evaluation_approver')
        {
            $to = $LoginUser->sendEmailTo($data['getApproval']['evaluated_by']);

            $to = $to['EmailAdd'];

            $subject = 'For Re-Evaluation - Approver';
        }
        else if($status == 'for_approval')
        {
            // $to = [
            //     'EmailAdd' => 'koike.tamotsu@jp.fujitsu.com',
            //     'EmailAdd' => 'saito.tomoyuki@fujitsu.com',
            // ];

            $subject = 'For Approval';
        }

        else if($status == 're_approval')
        {
            $to = $LoginUser->sendEmailTo($data['getApproval']['approved_by']);
            $to = $to['EmailAdd'];

            $subject = 'For Re-Approval';
        }
        else if($status == 'approved')
        {
            // $to = [
            //     'EmailAdd' => 'hirosawa-t@jp.fujitsu.com',
            //     'EmailAdd' => 'sawazaki-koji@jp.fujitsu.com',
            //     'EmailAdd' => 'satou.yutaka@jp.fujitsu.com',
            //     'EmailAdd' => 'koike.tamotsu@jp.fujitsu.com',
            //     'EmailAdd' => 'saito.tomoyuki@fujitsu.com',
            //     'EmailAdd' => 'satou.hideko@jp.fujitsu.com',
            // ];

            $subject = 'Approved';
        }

        $inspect_by = $LoginUser->getFullName($data['getApproval']['inspect_by']);
        $evaluated_by = $LoginUser->getFullName($data['getApproval']['evaluated_by']);
        $approved_by = $LoginUser->getFullName($data['getApproval']['approved_by']);
        $disapproved_by = $LoginUser->getFullName($data['getApproval']['disapproved_by']);
        
        $data['getApproval']['inspect_by'] = $inspect_by['fullname'];
        $data['getApproval']['evaluated_by'] = $evaluated_by['fullname'];
        $data['getApproval']['approved_by'] = $approved_by['fullname'];
        $data['getApproval']['disapproved_by'] = $disapproved_by['fullname'];

        Mail::to($to)
            ->cc($cc)
            ->bcc($bcc)
            ->queue(New SendMailQueue(
                $data->toArray(),
                $attachment,
                'Mail.email_notification',
                $subject,
            )
        );

        if (count(Mail::failures()) > 0) 
            return 'There was a problem sending the email, Please try again';
        else
            return 'Email Send';
    }
}