<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChecksheetData extends Model
{
    public function getChecksheetData($id)
    {
        return ChecksheetData::where('checksheet_item_id', $id)
        ->get();
    }
}
