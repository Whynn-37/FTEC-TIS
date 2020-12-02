<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;


class ChecksheetItem extends Model
{
    protected $fillable = ['trial_checksheet_id', 'item_number', 'tools', 'type', 'specification', 'upper_limit', 'lower_limit', 'item_type', 'judgment', 'hinsei'];

    public function checksheet_datas()
    {
        return $this->hasMany('App\ChecksheetData');
    }

    public function getChecksheetItem($id)
    {
        return ChecksheetItem::where('trial_checksheet_id', $id)
        ->get();
    }

    public function storeChecksheetItems($data)
    {
        foreach($data as $row)
        {
            $id[] = ChecksheetItem::insertGetId(
               [ 
                'trial_checksheet_id'   => $row['trial_checksheet_id'],
                'item_number'           => $row['item_number'],
                'tools'                 => $row['tools'],
                'type'                  => $row['type'],
                'specification'         => $row['specification'],
                'upper_limit'           => $row['upper_limit'],
                'lower_limit'           => $row['lower_limit'],
                'item_type'             => $row['item_type'],
                'created_at'            => $row['created_at'],
                'updated_at'            => $row['updated_at']
               ]
            );
        }
        return $id;
    }

    public function loadChecksheetData($data)
    {
        $result = [];
        if (!empty($data)) 
        {
            foreach ($data as $id) 
            {
                $result[] = ChecksheetItem::find($id['id'])->checksheet_datas;
            }
        }
        return $result;
    }

    public function updateOrCreateChecksheetItem($data)
    {
        return ChecksheetItem::updateOrCreate(
            [   
                'trial_checksheet_id'   => $data['trial_checksheet_id'],
                'item_number'           => $data['item_number'],
            ],
            [
                'tools'                 => $data['tools'],
                'type'                  => $data['type'],
                'specification'         => $data['specification'],
                'upper_limit'           => $data['upper_limit'],
                'lower_limit'           => $data['lower_limit'],
                'item_type'             => $data['item_type'],
                'judgment'              => $data['judgment'],
                'remarks'               => $data['remarks'],
                'hinsei'                => $data['hinsei'],
            ]
        );
    }

    public function updateId($data, $action)
    {
        foreach ($data as $value)
        {
            if ($action === 'update')
                $item_number = $value->item_number + 1;
            else
                $item_number = $value->item_number - 1;

            $result = ChecksheetItem::find($value->id)
            ->update(['item_number' => $item_number]);
        }

        return $result;
    }

    public function selectUpdateId($trial_checksheet_id, $item_number, $operation)
    {
        return ChecksheetItem::where('trial_checksheet_id', $trial_checksheet_id)
        ->where('item_number', $operation, $item_number)
        ->select('id', 'item_number')
        ->get();
    }

    public function updateAutoJudgmentItem($id, $data)
    {
        return ChecksheetItem::find($id)->update($data);
    }

    public function deleteItem($id)
    {
        ChecksheetItem::find($id)->checksheet_datas()->delete();
        return ChecksheetItem::find($id)->delete();
    }
}
