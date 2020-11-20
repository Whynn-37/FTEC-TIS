<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TaktTime;
use App\TrialChecksheet;

class TaktTimeController extends Controller
{
    public function loadCycleTime(request $request, TaktTime $takt_time)
    {
        $message = 'No data';
        $status = 'Error';

        $result = $takt_time->loadCycleTime($request->trial_checksheet_id);

        if (count($result) !== 0)
        {
            $message = 'Takt Time table loaded successfully';
            $status = 'Success';
        }

        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ]);
    }

    public function startCycleTime(TrialChecksheet $trial_checksheet,TaktTime $takt_time, Request $request)
    {
        //edited by jed
        
        $trial_checksheet_id = $request->trial_checksheet_id;
        $takt_times = $request->takt_time;
        $part_number = $request->part_number;
        $revision_number = $request->revision_number;
        $trial_number = $request->trial_number;


        if($trial_checksheet_id !== null)
        {
            $result = [
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
            $data = [
                'part_number'           => $part_number,
                'revision_number'       => $revision_number,
                'trial_number'          => $trial_number
            ];
    
            $last_id =  $trial_checksheet->storeTrialChecksheet($data);  
            
            $result = [
                'trial_checksheet_id'   => $last_id['id'],
                'start_date'            => date('Y/m/d'),
                'start_time'            => date('H:i:s'),
                'end_time'              => null,
                'actual_time'           => null,
                'total_takt_time'       => null,
                'takt_time'             => $takt_times,
            ];
        }

        $result_takt_time =  $takt_time->updateOrCreateTaktTime($result);

        $status = "Error";
        $message = "no data";

        if($result_takt_time != null)
        {
            $status = "Success";
            $message = "Successfully"; 
        }
        
        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result_takt_time
        ]);
    }

    public function StopCycleTime(TaktTime $load_takt_time,Request $request)
    {
        $trial_checksheet_id    = $request->trial_checksheet_id;
        $actual_time            = $request->actual_time;
        $total_takt_time        = $request->total_takt_time;
        $takt_time              = $request->takt_time;

        $start_date_time = $load_takt_time->getStartDateTime($trial_checksheet_id);
         
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

        $takt_time_result =  $load_takt_time->updateOrCreateTaktTime($data);

        $status = "Error";
        $message = "no data";

        if($takt_time_result != null)
        {
            $status = "Success";
            $message = "Successfully"; 
        }
        
        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $takt_time_result
        ]);
    }
}
