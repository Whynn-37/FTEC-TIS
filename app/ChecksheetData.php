<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChecksheetData extends Model
{
    protected $fillable = ['checksheet_item_id','sub_number', 'coordinates', 'data', 'judgment', 'remarks'];

    public function getChecksheetData($id)
    {
        return ChecksheetData::where('checksheet_item_id', $id)
        ->get();
    }

    public function storeChecksheetDatas($data)
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
            ]
        );
    }

    public function updateAutoJudgmentData($id, $sub_number, $data)
    {
        return ChecksheetData::where('checksheet_item_id', $id)
        ->where('sub_number', $sub_number)
        ->update($data);
    }

    public function deleteDatas($id)
    {
        return ChecksheetData::find($id)->delete();
    }

    public function selectId($checksheet_item_id, $sub_number)
    {
        return ChecksheetData::where('checksheet_item_id', $checksheet_item_id)
        ->where('sub_number', '>', $sub_number)
        ->select('id', 'sub_number')
        ->get();
    }

    public function deleteUpdate($data)
    {
        foreach ($data as $value)
        {
            $result = ChecksheetData::find($value->id)
            ->update(['sub_number' => $value->sub_number - 1]);
        }

        return $result;
    }
}
