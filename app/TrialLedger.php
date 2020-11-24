<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class TrialLedger extends Model
{
    protected $fillable = ['application_date', 'supplier_code', 'part_number', 'part_name',  'revision_number', 'inspection_reason', 'die_class', 'trial_number'];

    public function storeTrialLedger($result)
    {
        TrialLedger::truncate();
        return TrialLedger::insert($result);
    }

    public function loadPartnumber()
    {
        // nag add ng actual_end_date by jed
        return TrialLedger::where('actual_end_date', null)
        ->select('part_number')
        ->get();
    }

    public function loadRevision($part_number)
    {
        // nag add ng distinct() by jed
        return TrialLedger::where('part_number',$part_number)
        ->select('revision_number')
        ->distinct()
        ->get();
    }

    public function loadTrialNumber($part_number, $revision_number)
    {
        return TrialLedger::where('revision_number',$revision_number)
        ->where('part_number',$part_number)
        ->select('trial_number')
        ->get();
    }

    public function getTrialLedger($data)
    {
        return TrialLedger::where('part_number',$data['part_number'])
        ->where('revision_number',$data['revision_number'])
        ->where('trial_number',$data['trial_number'])
        ->first();
    }
}
