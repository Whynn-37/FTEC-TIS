<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\LoginUser;
use App\TrialChecksheet;
use App\Mail\SendMail;

class MailController extends Controller
{
    public function forEvaluator(Request $Request, TrialChecksheet $TrialChecksheet)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        
        $trial_checksheet_data = $TrialChecksheet->getAllData($trial_checksheet_id);
        $LoginUser = new LoginUser();

        // return $receipient = $LoginUser->getMailToLeader();
        $receipient =  
        [
            'jed.relator@fujitsu.com',
            // 'markjohrel.manzano@fujitsu.com',
            // 'georgebien.almenanza@fujitsu.com',
            // 'terrymerwin.balahadia@fujitsu.com',
            // 'markangelo.cantalejo@fujitsu.com',
        ];

        $data = 
        [
            'id'                    =>  $trial_checksheet_data['id'],
            'part_number'           =>  $trial_checksheet_data['part_number'],
            'revision_number'       =>  $trial_checksheet_data['revision_number'],
            'trial_number'          =>  $trial_checksheet_data['trial_number'],
            'date_finished'         =>  $trial_checksheet_data['date_finished'],
            'judgment'              =>  $trial_checksheet_data['judgment'],
            'date_inspected'        =>  $trial_checksheet_data['date_inspected'],
            'temperature'           =>  $trial_checksheet_data['temperature'],
            'humidity'              =>  $trial_checksheet_data['humidity'],
            'created_at'            =>  $trial_checksheet_data['created_at'],
            'updated_at'            =>  $trial_checksheet_data['updated_at'],
        ];

        $view = 'Mail.for_evaluation';
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

    public function forApproval(Request $Request, TrialChecksheet $TrialChecksheet)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        
        $trial_checksheet_data = $TrialChecksheet->getAllData($trial_checksheet_id);
        $LoginUser = new LoginUser();

        // return $receipient = $LoginUser->getMailToDirector();
        $receipient =  
        [
            // 'jed.relator@fujitsu.com',
            // 'markjohrel.manzano@fujitsu.com',
            // 'georgebien.almenanza@fujitsu.com',
            // 'terrymerwin.balahadia@fujitsu.com',
            'markangelo.cantalejo@fujitsu.com',
        ];

        $data = 
        [
            'id'                    =>  $trial_checksheet_data['id'],
            'part_number'           =>  $trial_checksheet_data['part_number'],
            'revision_number'       =>  $trial_checksheet_data['revision_number'],
            'trial_number'          =>  $trial_checksheet_data['trial_number'],
            'date_finished'         =>  $trial_checksheet_data['date_finished'],
            'judgment'              =>  $trial_checksheet_data['judgment'],
            'date_inspected'        =>  $trial_checksheet_data['date_inspected'],
            'temperature'           =>  $trial_checksheet_data['temperature'],
            'humidity'              =>  $trial_checksheet_data['humidity'],
            'created_at'            =>  $trial_checksheet_data['created_at'],
            'updated_at'            =>  $trial_checksheet_data['updated_at'],
        ];

        $view = 'Mail.for_approval';
        $subject = 'For Approval';

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

    public function forDispproval(Request $Request, TrialChecksheet $TrialChecksheet)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $evaluator = $Request->evaluator;

        $trial_checksheet_data = $TrialChecksheet->getAllData($trial_checksheet_id);
        $LoginUser = new LoginUser();

        // return $receipient = $LoginUser->getMailToEvaluator($evaluator);
        $receipient =  
        [
            // 'jed.relator@fujitsu.com',
            // 'markjohrel.manzano@fujitsu.com',
            // 'georgebien.almenanza@fujitsu.com',
            // 'terrymerwin.balahadia@fujitsu.com',
            'markangelo.cantalejo@fujitsu.com',
        ];

        $data = 
        [
            'id'                    =>  $trial_checksheet_data['id'],
            'part_number'           =>  $trial_checksheet_data['part_number'],
            'revision_number'       =>  $trial_checksheet_data['revision_number'],
            'trial_number'          =>  $trial_checksheet_data['trial_number'],
            'date_finished'         =>  $trial_checksheet_data['date_finished'],
            'judgment'              =>  $trial_checksheet_data['judgment'],
            'date_inspected'        =>  $trial_checksheet_data['date_inspected'],
            'temperature'           =>  $trial_checksheet_data['temperature'],
            'humidity'              =>  $trial_checksheet_data['humidity'],
            'created_at'            =>  $trial_checksheet_data['created_at'],
            'updated_at'            =>  $trial_checksheet_data['updated_at'],
        ];

        $view = 'Mail.for_disapproval';
        $subject = 'Disapproved';

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

    public function backToApproval(Request $Request, TrialChecksheet $TrialChecksheet)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $approver = $Request->approver;

        $trial_checksheet_data = $TrialChecksheet->getAllData($trial_checksheet_id);
        $LoginUser = new LoginUser();

        // return $receipient = $LoginUser->getMailToApprover($approver);
        $receipient =  
        [
            // 'jed.relator@fujitsu.com',
            // 'markjohrel.manzano@fujitsu.com',
            // 'georgebien.almenanza@fujitsu.com',
            // 'terrymerwin.balahadia@fujitsu.com',
            'markangelo.cantalejo@fujitsu.com',
        ];

        $data = 
        [
            'id'                    =>  $trial_checksheet_data['id'],
            'part_number'           =>  $trial_checksheet_data['part_number'],
            'revision_number'       =>  $trial_checksheet_data['revision_number'],
            'trial_number'          =>  $trial_checksheet_data['trial_number'],
            'date_finished'         =>  $trial_checksheet_data['date_finished'],
            'judgment'              =>  $trial_checksheet_data['judgment'],
            'date_inspected'        =>  $trial_checksheet_data['date_inspected'],
            'temperature'           =>  $trial_checksheet_data['temperature'],
            'humidity'              =>  $trial_checksheet_data['humidity'],
            'created_at'            =>  $trial_checksheet_data['created_at'],
            'updated_at'            =>  $trial_checksheet_data['updated_at'],
        ];

        $view = 'Mail.back_to_approval';
        $subject = 'For Approval';

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
