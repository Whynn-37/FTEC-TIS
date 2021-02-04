<?php

namespace App\Http\Controllers;

use App\Approval;
use Illuminate\Http\Request;
use App\TrialChecksheet;
use App\TrialLedger;
use App\Helpers\ActivityLog;
use Session;

class HistoryController extends Controller
{
    public function unique_multidim_array($array, $key) { 
        $temp_array = array(); 
        $i = 0; 
        $key_array = array(); 
        
        foreach($array as $val) { 
            if (!in_array($val[$key], $key_array)) { 
                $key_array[$i] = $val[$key]; 
                $temp_array[] = $val; 
            } 
            $i++; 
        } 

        return $temp_array; 
    }

    public function historySearch(TrialChecksheet $TrialChecksheet, TrialLedger $TrialLedger, Request $Request)
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

            if (count($data['checksheet']) !== 0) 
            {
                foreach ($data['ledger'] as $ledger_value) 
                {
                    $application_date[] = $ledger_value->application_date;
                    foreach ($data['checksheet'] as $checksheet_value) 
                    {
                        if ($checksheet_value->application_date === $ledger_value->application_date)
                        {
                            $match_application_date[] =  $ledger_value->application_date;
                            // $result = [];
                        }
                        // else 
                        // {
                        //     $result[] = 
                        //     [   
                        //         'id' => $ledger_value->application_date,
                        //         'judgment' => '',
                        //         'part_number' => $ledger_value->part_number,
                        //         'revision_number' => $ledger_value->revision_number,
                        //         'trial_number' => $ledger_value->trial_number,
                        //         'inspection_reason' => $ledger_value->inspection_reason,
                        //         'inspect_by' => $ledger_value->inspector_id,
                        //         'inspect_datetime' => '',
                        //         'evaluated_by' => '',
                        //         'evaluated_datetime' => '',
                        //         'approved_by' => '',
                        //         'approved_datetime' => '',
                        //         'disapproved_by' => '',
                        //         'disapproved_datetime' => '',
                        //         'file' => '',
                        //     ];
                        //     $match_application_date = false;
                        // }
                    }
                }

                if($match_application_date)
                {
                    for($x=0; $x<count($match_application_date);$x++)
                    {
                        $key = array_search($match_application_date[$x], $application_date); 
                        unset($data['ledger'][$key]); 
                    }

                    foreach ($data['ledger'] as $ledger_value) 
                    { 
                        $result[] = 
                        [
                            'id' => $ledger_value->application_date,
                            'judgment' => '',
                            'part_number' => $ledger_value->part_number,
                            'revision_number' => $ledger_value->revision_number,
                            'trial_number' => $ledger_value->trial_number,
                            'inspection_reason' => $ledger_value->inspection_reason,
                            'inspect_by' => $ledger_value->inspector_id,
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
                }
            }
            else 
            {
                foreach ($data['ledger'] as $ledger_value) 
                {
                    $result[] = [
                        'id' => $ledger_value->application_date,
                        'judgment' => '',
                        'part_number' => $ledger_value->part_number,
                        'revision_number' => $ledger_value->revision_number,
                        'trial_number' => $ledger_value->trial_number,
                        'inspection_reason' => $ledger_value->inspection_reason,
                        'inspect_by' => $ledger_value->inspector_id,
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
            }
            
            $data = $this->unique_multidim_array($result, 'id');
        }
        else 
        {
            $data = $TrialChecksheet->history($decision);
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

    public function EditDataInspection(Approval $Approval, Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $decision = $Request->decision;

        $result = $Approval->approved($trial_checksheet_id, ['decision' => $decision]);

        $status = 'Error';
        $message = 'Not Successfuly update';

        if ($result) 
        {
            $status = 'Success';
            $message = 'Edit By Evaluator';

            if ($decision === 5) 
            {
                $message = 'Edit By Inspector';
            }
        }

        ActivityLog::activityLog($message, Session::get('name'));

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => $result
        ];
    }
}
