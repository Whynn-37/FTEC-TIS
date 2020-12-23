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

    public function forInspection()
    {
        return TrialLedger::join('suppliers', 'suppliers.supplier_code', 'trial_ledgers.supplier_code')
        ->where('actual_end_date', null)
        ->orWhere('actual_end_date', '')
        ->select(
            'trial_ledgers.part_number', 
            'trial_ledgers.part_name', 
            'trial_ledgers.revision_number', 
            'trial_ledgers.trial_number', 
            'trial_ledgers.inspector_id',
            'suppliers.supplier_name')
        ->get();
    }

    public function loadPartnumberHistory($column)
    {
        return TrialLedger::join('trial_checksheets', 'trial_checksheets.application_date', 'trial_ledgers.application_date')
        ->join('approvals', 'approvals.trial_checksheet_id', 'trial_checksheets.id')
        ->join('suppliers', 'suppliers.supplier_code', 'trial_ledgers.supplier_code')
        ->where($column)
        ->select(
            'trial_ledgers.part_number', 
            'trial_ledgers.part_name', 
            'trial_ledgers.revision_number', 
            'trial_ledgers.trial_number', 
            'approvals.inspect_by',
            'approvals.inspect_datetime',
            'approvals.evaluated_by',
            'approvals.evaluated_datetime',
            'approvals.approved_by',
            'approvals.approved_datetime',
            'approvals.disapproved_by',
            'approvals.disapproved_datetime',
            'trial_checksheets.judgment',
            'suppliers.supplier_name')
        ->get();
    }
}
