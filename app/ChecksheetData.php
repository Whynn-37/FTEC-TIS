<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChecksheetData extends Model
{
    protected $fillable = ['checksheet_item_id','sub_number'];

    public function getChecksheetData($id)
    {
        return ChecksheetData::where('checksheet_item_id', $id)
        ->get();
    }

    public function storeChecksheetData($data)
    {
        return ChecksheetData::insert($data);
    }
}
