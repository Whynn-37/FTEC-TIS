<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\LoginUser;
use App\TrialChecksheet;
use App\Mail\SendMail;

class MailController extends Controller
{
    public function forEvaluator(Request $request, TrialChecksheet $trial_checksheet)
    {
        $trial_checksheet_id = $request->trial_checksheet_id;
        
        $trial_checksheet_data = $trial_checksheet->getAllData($trial_checksheet_id);
        $LoginUser = new LoginUser();

        // return $receipient = $LoginUser->getMailToLeader();
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
            'id'                    =>  $trial_checksheet_data[0]['id'],
            'part_number'           =>  $trial_checksheet_data[0]['part_number'],
            'revision_number'       =>  $trial_checksheet_data[0]['revision_number'],
            'trial_number'          =>  $trial_checksheet_data[0]['trial_number'],
            'date_finished'         =>  $trial_checksheet_data[0]['date_finished'],
            'judgment'              =>  $trial_checksheet_data[0]['judgment'],
            'date_inspected'        =>  $trial_checksheet_data[0]['date_inspected'],
            'temperature'           =>  $trial_checksheet_data[0]['temperature'],
            'humidity'              =>  $trial_checksheet_data[0]['humidity'],
            'created_at'            =>  $trial_checksheet_data[0]['created_at'],
            'updated_at'            =>  $trial_checksheet_data[0]['updated_at'],
        ];

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

    public function forApproval(Request $request, TrialChecksheet $trial_checksheet)
    {
        $trial_checksheet_id = $request->trial_checksheet_id;
        
        $trial_checksheet_data = $trial_checksheet->getAllData($trial_checksheet_id);
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
            'id'                    =>  $trial_checksheet_data[0]['id'],
            'part_number'           =>  $trial_checksheet_data[0]['part_number'],
            'revision_number'       =>  $trial_checksheet_data[0]['revision_number'],
            'trial_number'          =>  $trial_checksheet_data[0]['trial_number'],
            'date_finished'         =>  $trial_checksheet_data[0]['date_finished'],
            'judgment'              =>  $trial_checksheet_data[0]['judgment'],
            'date_inspected'        =>  $trial_checksheet_data[0]['date_inspected'],
            'temperature'           =>  $trial_checksheet_data[0]['temperature'],
            'humidity'              =>  $trial_checksheet_data[0]['humidity'],
            'created_at'            =>  $trial_checksheet_data[0]['created_at'],
            'updated_at'            =>  $trial_checksheet_data[0]['updated_at'],
        ];

        $view = 'Mail.test';
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

    public function forDispproval(Request $request, TrialChecksheet $trial_checksheet)
    {
        $trial_checksheet_id = $request->trial_checksheet_id;
        $evaluator = $request->evaluator;

        $trial_checksheet_data = $trial_checksheet->getAllData($trial_checksheet_id);
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
            'id'                    =>  $trial_checksheet_data[0]['id'],
            'part_number'           =>  $trial_checksheet_data[0]['part_number'],
            'revision_number'       =>  $trial_checksheet_data[0]['revision_number'],
            'trial_number'          =>  $trial_checksheet_data[0]['trial_number'],
            'date_finished'         =>  $trial_checksheet_data[0]['date_finished'],
            'judgment'              =>  $trial_checksheet_data[0]['judgment'],
            'date_inspected'        =>  $trial_checksheet_data[0]['date_inspected'],
            'temperature'           =>  $trial_checksheet_data[0]['temperature'],
            'humidity'              =>  $trial_checksheet_data[0]['humidity'],
            'created_at'            =>  $trial_checksheet_data[0]['created_at'],
            'updated_at'            =>  $trial_checksheet_data[0]['updated_at'],
        ];

        $view = 'Mail.test';
        $subject = 'For Disapproval';

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

    public function backToApproval($trial_checksheet_id, Request $request, TrialChecksheet $trial_checksheet)
    {
        $trial_checksheet_id = $request->trial_checksheet_id;
        $approver = $equest->approver;

        $trial_checksheet_data = $trial_checksheet->getAllData($request->trial_checksheet_id);
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
            'id'                    =>  $trial_checksheet_data[0]['id'],
            'part_number'           =>  $trial_checksheet_data[0]['part_number'],
            'revision_number'       =>  $trial_checksheet_data[0]['revision_number'],
            'trial_number'          =>  $trial_checksheet_data[0]['trial_number'],
            'date_finished'         =>  $trial_checksheet_data[0]['date_finished'],
            'judgment'              =>  $trial_checksheet_data[0]['judgment'],
            'date_inspected'        =>  $trial_checksheet_data[0]['date_inspected'],
            'temperature'           =>  $trial_checksheet_data[0]['temperature'],
            'humidity'              =>  $trial_checksheet_data[0]['humidity'],
            'created_at'            =>  $trial_checksheet_data[0]['created_at'],
            'updated_at'            =>  $trial_checksheet_data[0]['updated_at'],
        ];

        $view = 'Mail.test';
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
