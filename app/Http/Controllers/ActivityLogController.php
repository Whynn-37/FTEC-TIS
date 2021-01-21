<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ActivityLog;

class ActivityLogController extends Controller
{
    public function loadActivityLog(ActivityLog $ActivityLog)
    {
        $data = $ActivityLog->loadActivityLog();

        $status = 'Error';
        $message = 'No Activity Logs';

        if (count($data) !== 0) 
        {
            $status = 'Success';
            $message = 'Successfully load';
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $data
        ];
    }
}
