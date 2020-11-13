<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DownTime extends Model
{
    protected $fillable = ['trial_checksheet_id', 'type', 'start_time', 'down_time', 'total_down_time'];

    public function loadDownTime($trial_checksheet_id)
    {
        return DownTime::where('trial_checksheet_id', $trial_checksheet_id)
        ->get();
    }

    public function storeDownTime($data)
    {
        return DownTime::updateOrCreate([
            'trial_checksheet_id'   =>  $data['trial_checksheet_id'],
            'type'                  =>  $data['type'],
            'start_time'            =>  $data['start_time']
        ],
        [   
            'down_time'             =>  $data['down_time'],
            'total_down_time'       =>  $data['total_down_time']
        ]);
    }

    public function getLatestDownTime($id)
    {
        return DownTime::where('trial_checksheet_id', $id)
        ->select('start_time')
        ->latest()
        ->first();
    }
}
