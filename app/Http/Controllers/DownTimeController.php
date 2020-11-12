<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DownTime;

class DownTimeController extends Controller
{
    public function startDownTime(request $request, DownTime $down_time)
    {
        $trial_checksheet_id = $request->trial_checksheet_id;
        $type = $request->type;
        $total_down_time = $request->total_down_time;

        if ($total_down_time === null) 
        {
            $data = [
                'trial_checksheet_id'   =>  $trial_checksheet_id,
                'type'                  =>  $type,
                'start_time'            =>  date('H:i:s'),
                'down_time'             =>  '',
                'total_down_time'       =>  '',
            ];
        }
        else
        {
            $start_time = $down_time->stopDownTime($trial_checksheet_id);

            $data = [
                'trial_checksheet_id'   =>  $trial_checksheet_id,
                'type'                  =>  $type,
                'start_time'            =>  $start_time['start_time'],
                'down_time'             =>  date('H:i:s'),
                'total_down_time'       =>  $total_down_time,
            ];
        }

        return $down_time->storeDownTime($data);
    }

}
