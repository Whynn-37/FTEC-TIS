<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DownTime extends Model
{
    public function getDownTime($id)
    {
        return DownTime::where('trial_checksheet_id', $id)
        ->get();
    }
}
