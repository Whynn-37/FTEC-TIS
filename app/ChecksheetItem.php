<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChecksheetItem extends Model
{
    public function getChecksheetItem($id)
    {
        return ChecksheetItem::where('trial_checksheet_id', $id)
        ->get();
    }
}
