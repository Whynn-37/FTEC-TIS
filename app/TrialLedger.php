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

    public function getTrialLedger($application_date)
    {
        return TrialLedger::where('application_date', $application_date)
        ->first();
    }

    public function getApplicationDate($part_number, $inspection_reason, $trial_number)
    {
        return TrialLedger::where('part_number', $part_number)
        ->where('inspection_reason', $inspection_reason)
        ->where('trial_number', $trial_number)
        ->select('application_date')
        ->first();
    }

    public function getInspectionHistory($application_date)
    {
        return TrialLedger::join('suppliers', 'suppliers.supplier_code', 'trial_ledgers.supplier_code')
        ->where('trial_ledgers.application_date', $application_date)
        ->select(
            'trial_ledgers.application_date',
            'trial_ledgers.part_number', 
            'trial_ledgers.inspection_reason',
            'trial_ledgers.revision_number', 
            'trial_ledgers.trial_number', 
            'trial_ledgers.part_name', 
            'trial_ledgers.model_name', 
            'trial_ledgers.supplier_code',
            'suppliers.supplier_name',
            'trial_ledgers.received_date',
            'trial_ledgers.plan_start_date',
            'trial_ledgers.inspection_required_time',
            'trial_ledgers.die_class',
            'trial_ledgers.inspector_id',
        )
        ->first();
    }

    public function loadPartnumberHistory($column)
    {
        return TrialLedger::join('trial_checksheets', 'trial_checksheets.application_date', 'trial_ledgers.application_date')
        ->join('approvals', 'approvals.trial_checksheet_id', 'trial_checksheets.id')
        ->join('suppliers', 'suppliers.supplier_code', 'trial_ledgers.supplier_code')
        ->leftJoin('attachments', 'attachments.trial_checksheet_id', 'trial_checksheets.id')
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
            'trial_checksheets.id',
            'trial_checksheets.judgment',
            'suppliers.supplier_name',
            'attachments.file_folder')
        ->get();
    }

    public function history()
    {
        $ledger = TrialLedger::where('actual_end_date', null)
        ->orWhere('actual_end_date', '')
        ->get();

        $checksheet = DB::table('trial_checksheets')
        ->get();

        return 
        [
            'ledger' => $ledger,
            'checksheet' => $checksheet,
        ];
    }
}
