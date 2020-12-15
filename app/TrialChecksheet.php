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
        return TrialChecksheet::join('trial_ledgers', function($join)
        {
            $join->on('trial_ledgers.part_number', '=', 'trial_checksheets.part_number')
                ->on('trial_ledgers.trial_number', '=', 'trial_checksheets.trial_number')
                ->on('trial_ledgers.revision_number', '=', 'trial_checksheets.revision_number');
        })
        ->where('trial_checksheets.id', $id)
        ->select([
            'trial_checksheets.part_number', 
            'trial_checksheets.revision_number',
            'trial_checksheets.trial_number',
            'trial_checksheets.date_finished',
            'trial_checksheets.judgment',
            'trial_checksheets.date_inspected',
            'trial_checksheets.temperature',
            'trial_checksheets.humidity',
            'trial_ledgers.part_name',
            'trial_ledgers.die_class',
            'trial_ledgers.supplier_code',
            'trial_ledgers.inspection_reason',
            ])
        ->first();
    }

    public function updateTrialChecksheet($id,$data)
    {
        return TrialChecksheet::find($id)->update($data);
    }
    
    public function loadFinishedInspection($decision)
    {
        return TrialChecksheet::join('approvals', 'approvals.trial_checksheet_id','=','trial_checksheets.id')
        ->where('approvals.decision', '=', $decision)
        ->get();
    }

    public function loadTrialCheckitemsNG($application_date)
    {
        return TrialChecksheet::join('checksheet_items', 'checksheet_items.trial_checksheet_id','=','trial_checksheets.id')
        ->where('trial_checksheets.judgment', '=', 'NG')
        ->where('checksheet_items.judgment', '=', 'NG')
        ->where('trial_checksheets.application_date', '=', $application_date['application_date'])
        ->select('checksheet_items.*')
        ->get();
    }

    public function getAllNg($part_number)
    {
        return TrialChecksheet::where('part_number', $part_number)
        ->where('judgment', 'NG')
        ->select('id', 'trial_number', 'date_finished', 'judgment', 'revision_number')
        ->get();
    }

    public function getFirstTrial($part_number)
    {
        return TrialChecksheet::where('part_number', $part_number)
        ->where('judgment', 'NG')
        ->select('id', 'trial_number')
        ->orderBy('trial_number', 'asc')
        ->first();
    }

}
