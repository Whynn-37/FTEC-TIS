<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TaktTime;
use App\TrialChecksheet;
class TaktTimeController extends Controller
{
    public function loadCycleTime(TaktTime $TaktTime, Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;

        $status = 'Error';
        $message = 'No data';
        $result = [];

        if ($trial_checksheet_id !== null) 
        {
            $result = $TaktTime->loadCycleTime($trial_checksheet_id);

            $status = 'Error';
            $message = 'Not Successfully Load';

            if (count($result) !== 0)
            {
                $status = 'Success';
                $message = 'Successfully Load';
            }
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

    public function startCycleTime(TrialChecksheet $TrialChecksheet,TaktTime $TaktTime, Request $Request)
    {
        //edited by jed
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $takt_times = $Request->takt_time;
        $part_number = $Request->part_number;
        $revision_number = $Request->revision_number;
        $trial_number = $Request->trial_number;

        if($trial_checksheet_id !== null)
        {
            $data = 
            [
                'trial_checksheet_id'   => $trial_checksheet_id,
                'start_date'            => date('Y/m/d'),
                'start_time'            => date('H:i:s'),
                'end_time'              => null,
                'actual_time'           => null,
                'total_takt_time'       => null,
                'takt_time'             => $takt_times,
            ];
        }
        else
        {
            $trial_checksheet = 
            [
                'part_number'           => $part_number,
                'revision_number'       => $revision_number,
                'trial_number'          => $trial_number
            ];
    
            $last_id =  $TrialChecksheet->storeTrialChecksheet($trial_checksheet);  
            
            $data = 
            [
                'trial_checksheet_id'   => $last_id['id'],
                'start_date'            => date('Y/m/d'),
                'start_time'            => date('H:i:s'),
                'end_time'              => null,
                'actual_time'           => null,
                'total_takt_time'       => null,
                'takt_time'             => $takt_times,
            ];
        }

        $result =  $TaktTime->updateOrCreateTaktTime($data);

        $status = "Error";
        $message = "Not Successfully Updated";

        if($result != null)
        {
            $status = "Success";
            $message = "Successfully Updated"; 
        }
        
        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

    public function StopCycleTime(TaktTime $TaktTime, Request $Request)
    {
        $trial_checksheet_id    = $Request->trial_checksheet_id;
        $actual_time            = $Request->actual_time;
        $total_takt_time        = $Request->total_takt_time;
        $takt_time              = $Request->takt_time;

        $status = "Error";
        $message = "No Data";
        $result = [];

        if ($trial_checksheet_id !== null) 
        {
            $start_date_time = $TaktTime->getStartDateTime($trial_checksheet_id);
            
            if (count($start_date_time) !== 0) 
            {
                $data = 
                [
                    'trial_checksheet_id'   => $trial_checksheet_id,
                    'start_date'            => $start_date_time['start_date'],
                    'start_time'            => $start_date_time['start_time'],
                    'end_time'              => date('H:i:s'),
                    'actual_time'           => $actual_time,
                    'total_takt_time'       => $total_takt_time,
                    'takt_time'             => $takt_time,
                ];
        
                $result =  $TaktTime->updateOrCreateTaktTime($data);
        
                $status = "Error";
                $message = "Not Successfully Updated";
        
                if($result != null)
                {
                    $status = "Success";
                    $message = "Successfully Updated";
                }
            }
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }
}
