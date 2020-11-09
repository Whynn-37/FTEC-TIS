<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaktTime extends Model
{
    public function getTaktTime($id)
    {
        return TaktTime::where('trial_checksheet_id', $id)
        ->get();
    }
}
