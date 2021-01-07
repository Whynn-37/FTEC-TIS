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

    // public function loadPartnumber()
    // {
    //     return TrialLedger::where('actual_end_date', null)
    //     ->orWhere('actual_end_date', '')
    //     ->select('part_number')
    //     ->distinct()
    //     ->get();
    // }

    
    public function loadPartnumber()
    {
        $ledger = TrialLedger::where('actual_end_date', null)
        ->orWhere('actual_end_date', '')
        ->select('part_number', 'application_date')
        // ->distinct()
        ->get();

        $checksheet = DB::table('trial_checksheets')
        ->where('date_finished', '!=', null)
        ->select('application_date')
        ->get();

        return 
        [
            'ledger' => $ledger,
            'checksheet' => $checksheet,
        ];
    }

    public function loadInspectionReason($part_number)
    {
        $ledger = TrialLedger::where('part_number', $part_number)
        ->where(function($query) {
            $query->where('actual_end_date', null)
                  ->orWhere('actual_end_date', '');
        })
        ->select('part_number', 'inspection_reason', 'application_date')
        // ->distinct()
        ->get();

        $checksheet = DB::table('trial_checksheets')
        ->where('date_finished', '!=', null)
        ->select('part_number', 'application_date')
        ->get();

        return 
        [
            'ledger' => $ledger,
            'checksheet' => $checksheet,
        ];

    }

    public function loadRevision($part_number, $inspection_reason)
    {
        return TrialLedger::where('part_number', $part_number)
        ->where('inspection_reason', $inspection_reason)
        ->where(function($query) {
            $query->where('actual_end_date', null)
                  ->orWhere('actual_end_date', '');
        })
        ->select('revision_number')
        ->distinct()
        ->get();
    }

    public function loadTrialNumber($part_number, $inspection_reason, $revision_number)
    {
        return TrialLedger::where('part_number', $part_number)
        ->where('inspection_reason', $inspection_reason)
        ->where('revision_number', $revision_number)
        ->where(function($query) {
            $query->where('actual_end_date', null)
                  ->orWhere('actual_end_date', '');
        })
        ->select('trial_number')
        ->distinct()
        ->get();
    }

    public function loadApplicationDate($part_number, $inspection_reason, $revision_number, $trial_number)
    {
        return TrialLedger::where('part_number', $part_number)
        ->where('inspection_reason', $inspection_reason)
        ->where('revision_number', $revision_number)
        ->where('trial_number', $trial_number)
        ->where(function($query) {
            $query->where('actual_end_date', null)
                  ->orWhere('actual_end_date', '');
        })
        ->select('application_date')
        ->first();
    }

    // public function getTrialLedger($data)
    // {
    public function getTrialLedger($application_date)
    {
        return TrialLedger::where('application_date', $application_date)
        ->first();
        // return TrialLedger::where('part_number', $data['part_number'])
        // ->where('revision_number', $data['revision_number'])
        // ->where('trial_number', $data['trial_number'])
        // ->where(function($query) {
        //     $query->where('actual_end_date', null)
        //           ->orWhere('actual_end_date', '');
        // })
        // ->first();
    }

    public function getApplicationDate($part_number, $inspection_reason, $trial_number)
    {
        return TrialLedger::where('part_number', $part_number)
        ->where('inspection_reason', $inspection_reason)
        ->where('trial_number', $trial_number)
        // ->where('judgment', '不良')
        // ->where('actual_end_date', '!=', null)
        ->select('application_date')
        ->first();
    }
}
