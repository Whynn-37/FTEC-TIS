<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\TrialLedger;
use DB;
class TrialChecksheet extends Model
{

    protected $fillable = ['part_number','revision_number','trial_number'];

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
    public function loadFinishedInspection()
    {
        return TrialChecksheet::join('takt_times', 'takt_times.trial_checksheet_id','=','trial_checksheets.id')
        ->where('takt_times.date_finished', '!=', null)
        ->select('trial_checksheets.part_number','trial_checksheets.revision_number','trial_checksheets.trial_number','trial_checksheets.judgement','takt_times.date_finished')
        ->get();
    }
}
