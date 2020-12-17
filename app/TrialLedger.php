<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class TrialLedger extends Model
{
    protected $fillable = ['application_date', 'supplier_code', 'part_number', 'part_name',  'revision_number', 'inspection_reason', 'die_class', 'trial_number'];

    public function storeTrialLedger($datas)
    {
        TrialLedger::truncate();
        return TrialLedger::insert($datas);
    }

    public function loadPartnumber()
    {
        return TrialLedger::where('actual_end_date', null)
        ->orWhere('actual_end_date', '')
        ->select('part_number')
        ->distinct()
        ->get();
    }

    public function loadRevision($part_number)
    {
        return TrialLedger::where('part_number', $part_number)
        ->select('revision_number')
        ->distinct()
        ->get();
    }

    public function loadTrialNumber($part_number, $revision_number)
    {
        return TrialLedger::where('revision_number', $revision_number)
        ->where('part_number', $part_number)
        ->select('trial_number')
        ->distinct()
        ->get();
    }

    public function getTrialLedger($data)
    {
        return TrialLedger::where('part_number', $data['part_number'])
        ->where('revision_number', $data['revision_number'])
        ->where('trial_number', $data['trial_number'])
        ->first();
    }

    public function getApplicationDate($part_number)
    {
        return TrialLedger::where('part_number', $part_number)
        ->where('judgment', '不良')
        ->where('actual_end_date', '!=', null)
        ->select('application_date')
        ->orderBy('trial_number', 'desc')
        ->first();
    }
}
