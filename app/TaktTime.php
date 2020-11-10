<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaktTime extends Model
{
    protected $fillable = ['trial_checksheet_id','start_date','start_time','takt_time'];

    public function getTaktTime($id)
    {
        return TaktTime::where('trial_checksheet_id', $id)
        ->get();
    }

    public function storeTaktTime($data)
    {
        return TaktTime::create($data);
    }
}
