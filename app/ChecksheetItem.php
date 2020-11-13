<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


class ChecksheetItem extends Model
{
    protected $fillable = ['trial_checksheet_id','item_number','tools','type','specification','upper_limit','lower_limit','item_type'];

    public function getChecksheetItem($id)
    {
        return ChecksheetItem::where('trial_checksheet_id', $id)
        ->get();
    }

    public function storeChecksheetItem($data)
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
}
