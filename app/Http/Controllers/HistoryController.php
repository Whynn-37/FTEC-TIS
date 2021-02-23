<?php

namespace App\Http\Controllers;

use App\Approval;
use Illuminate\Http\Request;
use App\TrialChecksheet;
use App\TrialLedger;
use App\Helpers\ActivityLog;
use App\LoginUser;
use Session;
use App\Helpers\Unique;
use App\Http\Controllers\MailController;

class HistoryController extends Controller
{
    public function historySearch(TrialChecksheet $TrialChecksheet, 
                                    TrialLedger $TrialLedger, 
                                    LoginUser $LoginUser,
                                    Unique $Unique,
                                    Request $Request)
    {
        $status = $Request->status;
        $result = [];

        if ($status === 'ON-GOING INSPECTION') 
        {
            $decision = 4;
        }
        else if ($status === 'FOR EVALUATION') 
        {
            $decision = 1;
        }
        else if ($status === 'FOR APPROVAL') 
        {
            $decision = 2;
        }
        else if ($status === 'APPROVED') 
        {
            $decision = 0;
        }
        else if ($status === 'DISAPPROVED') 
        {
            $decision = 3;
        }
        else if ($status === 'REINSPECTION') 
        {
            $decision = 5;
        }

        if ($status === 'FOR INSPECTION') 
        {
            $data = $TrialLedger->history();

            foreach ($data['ledger'] as $ledger_value) 
            {
                $application_date[] = $ledger_value->application_date;
                foreach ($data['checksheet'] as $checksheet_value) 
                {
                    if ($checksheet_value->application_date === $ledger_value->application_date)
                        $match_application_date[] =  $ledger_value->application_date;
                }
            }

            if($match_application_date)
            {
                for($x=0; $x<count($match_application_date);$x++)
                {
                    $key = array_search($match_application_date[$x], $application_date); 
                    unset($data['ledger'][$key]); 
                }
            }

            foreach ($data['ledger'] as $ledger_value) 
            { 
                $fullname = $LoginUser->getFullName($ledger_value->inspector_id);

                $result[] = 
                [
                    'id' => $ledger_value->application_date,
                    'judgment' => '',
                    'part_number' => $ledger_value->part_number,
                    'revision_number' => $ledger_value->revision_number,
                    'trial_number' => $ledger_value->trial_number,
                    'inspection_reason' => $ledger_value->inspection_reason,
                    'inspect_by' => $fullname['fullname'],
                    'inspect_datetime' => '',
                    'evaluated_by' => '',
                    'evaluated_datetime' => '',
                    'approved_by' => '',
                    'approved_datetime' => '',
                    'disapproved_by' => '',
                    'disapproved_datetime' => '',
                    'file' => '',
                ];
            }
            
            $data = $Unique->unique_multidim_array($result, 'id');
        }
        else 
        {
            $data = $TrialChecksheet->history($decision);

            foreach ($data as $key => $value) 
            {
                $inspect_by = $LoginUser->getFullName($value['inspect_by']);
                $evaluated_by = $LoginUser->getFullName($value['evaluated_by']);
                $approved_by = $LoginUser->getFullName($value['approved_by']);
                $disapproved_by = $LoginUser->getFullName($value['disapproved_by']);
    
                $data[$key]['inspect_by'] = $inspect_by['fullname'];
                $data[$key]['evaluated_by'] = $evaluated_by['fullname'];
                $data[$key]['approved_by'] = $approved_by['fullname'];
                $data[$key]['disapproved_by'] = $disapproved_by['fullname'];
            }
        }

        $status = 'Error';
        $message = 'No history search';

        if ($data) 
        {
            $status = 'Success';
            $message = 'Successfully history search';
        }

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => $data
        ];
    }

    public function getInspectionHistory(TrialLedger $TrialLedger, Request $Request)
    {
        $application_date = $Request->id;

        $data = $TrialLedger->getInspectionHistory($application_date);

        $status = 'Error';
        $message = 'No history';

        if ($data) 
        {
            $status = 'Success';
            $message = 'Successfully load history';
        }

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => $data
        ];
    }

                                    
    public function EditDataInspection(Approval $Approval, MailController $MailController,  Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $decision = $Request->decision;
        $reason = $Request->reason;

        $mail_send = '';

        $data = 
        [
            'decision' => $decision,
            'disapproved_by' => Session::get('name'),
            'disapproved_datetime' => now(),
            'reason' => $reason
        ];

        $result = $Approval->approved($trial_checksheet_id, $data);

        if ($decision == 5) 
            $mail_send = $MailController->sendEmail($trial_checksheet_id, 're_inspect');
        else
            $mail_send = $MailController->sendEmail($trial_checksheet_id, 're_evaluation_history');

        $status = 'Error';
        $message = 'Not Successfuly update';

        if ($result) 
        {
            $status = 'Success';
            $message = 'Return to Evaluator';

            if ($decision == 5) 
            {
                $message = 'Return to Inspector';
            }
        }

        ActivityLog::activityLog($message, Session::get('name'));

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'mail'      => $mail_send,
            'data'      => $result
        ];
    }
}