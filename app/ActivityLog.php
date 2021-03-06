<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = ['subject', 'url', 'method', 'ip', 'browser', 'user_id'];

    public function loadActivityLog()
    {
        return ActivityLog::orderBy('id', 'desc')->get();
    }
}