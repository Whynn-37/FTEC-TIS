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
        $trial_checksheet_id = $request->trial_checksheet_id;

        if($trial_checksheet_id !== null)
        {
            $result = [
                'trial_checksheet_id' => $trial_checksheet_id,
                'takt_time'            => $request->takt_time,
                'start_date'            => date('Y/m/d'),
                'start_time'            => date('H:i:s')
            ];
        }
        else
        {
            $data = [
                'part_number'       => $request->part_number,
                'revision_number'   => $request->revision_number,
                'trial_stage'       => $request->trial_number
            ];
    
            $last_id =  $trial_checksheet->storeTrialChecksheet($data);  
            
            $result = [
                'trial_checksheet_id' => $last_id['id'],
                'takt_time'            => $request->takt_time,
                'start_date'            => date('Y/m/d'),
                'start_time'            => date('H:i:s')
            ];
        }

        $result_takt_time =  $takt_time->storeTaktTime($result);

        $status = "error";
        $message = "no data";

        if($result_takt_time != null)
        {
            $status = "success";
            $message = "uhhm uhmm"; 
        }
        
        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result_takt_time
        ]);
    }
}
