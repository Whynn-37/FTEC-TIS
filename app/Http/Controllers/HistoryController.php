<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TrialChecksheet;
use App\TrialLedger;

class HistoryController extends Controller
{
    public function historySearch(TrialChecksheet $TrialChecksheet, TrialLedger $TrialLedger,Request $Request)
    {
        $status = $Request->status;

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
                            $result = [];
                        }
                        else 
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
                            $match_application_date = false;
                        }
                    }
                }

                if($match_application_date !== false)
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
        }
        else 
        {
            $result = $TrialChecksheet->history($decision);
        }


        return $result;
    }
}
