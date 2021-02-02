<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
class ChecksheetData extends Model
{
    protected $guarded = [];

    public function getChecksheetData($id)
    {
        return ChecksheetData::where('checksheet_item_id', $id)
        ->orderBy('sub_number', 'asc')
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
                'type'                  => $data['type'],
            ]
        );
    }

    public function updateId($data, $action)
    {
        foreach ($data as $value)
        {
            if ($action === 'update')
                $sub_number = $value->sub_number + 1;
            else
                $sub_number = $value->sub_number - 1;

            $result = ChecksheetData::find($value->id)
            ->update(['sub_number' => $sub_number]);
        }

        return $result;
    }

    public function selectUpdateId($checksheet_item_id, $sub_number, $operation)
    {
        return ChecksheetData::where('checksheet_item_id', $checksheet_item_id)
        ->where('sub_number', $operation, $sub_number)
        ->select('id', 'sub_number')
        ->orderBy('id', 'asc')
        ->get();
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
    
    public function loadTrialCheckitemsNG($id)
    {
        return ChecksheetData::where('checksheet_item_id', $id)
        ->where('checksheet_data.judgment', '=', 'NG')
        ->orderBy('id', 'asc')
        ->get();
    }

    public function getDataNg($checksheet_item_id)
    {
        return ChecksheetData::where('checksheet_item_id', $checksheet_item_id)
        ->select('id', 'checksheet_item_id', 'coordinates', 'data', 'judgment', 'remarks', 'hinsei', 'type')
        ->orderBy('sub_number', 'asc')
        ->get();
    }

    public function updateHinsei($id, $data)
    {
        return ChecksheetData::where('checksheet_item_id', $id)
        ->update($data);
    }
}
