<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\TrialLedger;
use DB;
class TrialChecksheet extends Model
{

    protected $guarded = [];

    public function checksheet_items()
    {
        return $this->hasMany('App\ChecksheetItem');
    }

    public function getTrialChecksheet($data)
    {
        return TrialChecksheet::where('part_number',$data['part_number'])
        ->where('revision_number',$data['revision_number'])
        ->where('trial_number',$data['trial_number'])
        ->first();
    }

    public function storeTrialChecksheet($data)
    {
        return TrialChecksheet::create($data);
    }

    public function loadChecksheetItem($id)
    {
        return TrialChecksheet::find($id)->checksheet_items;
    }

    public function getChecksheetDetails($id)
    {
       
     return   $data = TrialChecksheet::join('trial_ledgers', function($join)
        {
            $join->on('trial_ledgers.part_number', '=', 'trial_checksheets.part_number')
                ->on('trial_ledgers.trial_number', '=', 'trial_checksheets.trial_number')
                ->on('trial_ledgers.revision_number', '=', 'trial_checksheets.revision_number');
        })
        ->where('trial_checksheets.id', $id)
        ->select(['trial_checksheets.*','trial_ledgers.*'])
        ->get();
    }

    public function updateTrialChecksheet($id,$data)
    {
        return TrialChecksheet::find($id)->update($data);
    }
    
    public function loadFinishedInspection()
    {
        return TrialChecksheet::join('approvals', 'approvals.trial_checksheet_id','=','trial_checksheets.id')
        ->where('approvals.decision', '=', 1)
        ->select('trial_checksheets.part_number','trial_checksheets.revision_number','trial_checksheets.trial_number','trial_checksheets.judgment','trial_checksheets.date_finished')
        ->get();
    }

    public function loadTrialCheckitemsNG($part_number, $trial_number)
    {
        return TrialChecksheet::join('checksheet_items', 'checksheet_items.trial_checksheet_id','=','trial_checksheets.id')
        ->where('trial_checksheets.judgment', '=', 'NG')
        ->where('checksheet_items.judgment', '=', 'NG')
        ->where('trial_checksheets.part_number', '=', $part_number)
        ->where('trial_checksheets.trial_number', '=', $trial_number)
        ->select('checksheet_items.*')
        ->get();
    }
}
