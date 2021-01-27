<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DownTime;
use App\Helpers\ActivityLog;
use Session;
class DownTimeController extends Controller
{
    public function loadDownTime(DownTime $DownTime, Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;

        $status = 'Error';
        $message = 'No data';

        if ($trial_checksheet_id !== null) 
        {
            $result = $DownTime->loadDownTime($trial_checksheet_id);

            $status = 'Success';
            $message = 'Not Successfully Load';

            if (count($result) !== 0)
            {
                $status = 'Success';
                $message = 'Successfully Load';
            }
    
            return
            [
                'status'    =>  $status,
                'message'   =>  $message,
                'data'      =>  $result
            ];
        }
    }

    public function startDownTime(DownTime $DownTime, Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $type = $Request->type;
        $total_down_time = $Request->total_down_time;

        $status = 'Error';
        $message = 'No data';

        if ($trial_checksheet_id !== null) 
        {
            if ($total_down_time === null) 
            {
                $data = [
                    'trial_checksheet_id'   =>  $trial_checksheet_id,
                    'type'                  =>  $type,
                    'start_time'            =>  date('H:i:s'),
                    'down_time'             =>  '',
                    'total_down_time'       =>  '',
                ];

                $type_of = 'start';
            }
            else
            {
                $start_time_data = $DownTime->getLatestDownTime($trial_checksheet_id);
    
                $data = [
                    'trial_checksheet_id'   =>  $trial_checksheet_id,
                    'type'                  =>  $type,
                    'start_time'            =>  $start_time_data['start_time'],
                    'down_time'             =>  date('H:i:s'),
                    'total_down_time'       =>  $total_down_time,
                ];

                $type_of = 'stop';
            }

            $result = $DownTime->storeDownTime($data);

            $status = 'Error';
            $message = 'Not Successfully Update';

            if ($result) 
            {
                $status = 'Success';
                $message = 'downtime stopped';

                if ($type_of === 'start') 
                {
                    $message = 'downtime has begun';
                }
            }
        }

        ActivityLog::activityLog($message . ' - Id : ' . $trial_checksheet_id . ' - Type : ' . $type . ' - Total Down Time : ' . $total_down_time, Session::get('name'));

        return
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }
}
