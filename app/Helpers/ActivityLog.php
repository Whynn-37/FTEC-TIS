<?php

namespace App\Helpers;
use Request;
use App\ActivityLog as ActivityLogModel;

class ActivityLog
{
    public static function activityLog($subject, $user)
    {
        $data = 
        [
            'subject' => $subject,
            'url' => Request::fullUrl(),
            'method' => Request::method(),
            'ip' => Request::ip(),
            'browser' => Request::header('user-agent'),
            'user_id' => $user,
        ];
        ActivityLogModel::create($data);
    }
}