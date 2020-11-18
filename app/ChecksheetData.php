<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChecksheetData extends Model
{
    protected $fillable = ['checksheet_item_id','sub_number', 'coordinates', 'data', 'judgment', 'remarks', 'hinsei'];

    public function getChecksheetData($id)
    {
        return ChecksheetData::where('checksheet_item_id', $id)
        ->get();
    }

    public function storeChecksheetData($data)
    {
        return ChecksheetData::insert($data);
    }

    public function updateOrCreateChecksheetData($data)
    {
        return ChecksheetData::updateOrCreate(
            [
                'checksheet_item_id'   => $data['checksheet_item_id'],
                'sub_number'           => $data['sub_number'],
            ],
            [
                'coordinates'           => $data['coordinates'],
                'data'                  => $data['data'],
                'judgment'              => $data['judgment'],
                'remarks'               => $data['remarks'],
                'hinsei'                => $data['hinsei'],
            ]
        );
    }

    public function deleteDatas($id)
    {
        return ChecksheetData::find($id)->delete();
    }
}
