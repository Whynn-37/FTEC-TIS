<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaktTime extends Model
{
    protected $fillable = ['trial_checksheet_id','start_date','start_time','takt_time', 'end_time', 'actual_time', 'total_takt_time', 'date_finished'];

    public function loadCycleTime($trial_checksheet_id)
    {
        return TaktTime::where('trial_checksheet_id', $trial_checksheet_id)
        ->get();
    }

    public function updateOrCreateTaktTime($data)
    {
        // edited by jed
        return TaktTime::updateOrCreate(
            [
                'trial_checksheet_id'   => $data['trial_checksheet_id'],
                'start_date'            => $data['start_date'],
                'start_time'            => $data['start_time'],
            ],
            [
                'end_time'              => $data['end_time'],
                'actual_time'           => $data['actual_time'],
                'total_takt_time'       => $data['total_takt_time'],
                'takt_time'             => $data['takt_time'],
            ]
        );
    }

    public function getStartDateTime($id)
    {
        return TaktTime::where('trial_checksheet_id', $id)
        ->where('end_time', null)
        ->select('start_time', 'start_date')
        ->latest()
        ->first();
    }

    public function updateTaktTime($id,$data)
    {
        return TaktTime::where('id',$id['id'])
        ->update($data);
    }
}
