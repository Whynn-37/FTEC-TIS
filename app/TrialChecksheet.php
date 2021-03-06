<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TrialChecksheet extends Model
{
    protected $guarded = [];

    public function getTrialChecksheet($application_date)
    {
        return TrialChecksheet::where('application_date',$application_date)
        ->first();
    }

    public function getInUse($application_date)
    {
        return TrialChecksheet::where('application_date',$application_date)
        ->first('in_use');
    }

    public function storeTrialChecksheet($data)
    {
        return TrialChecksheet::create($data);
    }

    public function getApplicationDate($part_number, $inspection_reason, $trial_number)
    {
        return TrialChecksheet::where('part_number', $part_number)
        ->where('inspection_reason', $inspection_reason)
        ->where('trial_rm_4m', $trial_number)
        ->select('application_date')
        ->first();
    }

    public function getChecksheetDetails($id)
    {
        return TrialChecksheet::join('trial_ledgers', 'trial_ledgers.application_date', 'trial_checksheets.application_date')
        ->join('suppliers', 'trial_ledgers.supplier_code', '=', 'suppliers.supplier_code')
        ->join('approvals', 'approvals.trial_checksheet_id','=','trial_checksheets.id')
        ->where('trial_checksheets.id', $id)
        ->select(
            'trial_checksheets.id',
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
            'trial_ledgers.model_name',
            'trial_ledgers.application_date',
            'trial_ledgers.inspection_required_time',
            'suppliers.supplier_name',
            'approvals.inspect_by',
            )
        ->first();
    }

    public function updateTrialChecksheet($id,$data)
    {
        return TrialChecksheet::find($id)->update($data);
    }
    
    public function loadFinishedInspection($decision)
    {
        return TrialChecksheet::join('approvals', 'approvals.trial_checksheet_id','=','trial_checksheets.id')
        ->join('trial_ledgers', 'trial_ledgers.application_date','=','trial_checksheets.application_date') // pinadagdag ni jed para sa insp reason -george
        ->where('approvals.decision', '=', $decision)
        ->select(
            'trial_checksheets.id',
            'trial_checksheets.judgment',
            'trial_checksheets.date_finished',
            'trial_ledgers.part_number',
            'trial_ledgers.revision_number',
            'trial_ledgers.trial_number',
            'trial_ledgers.inspection_reason',
            'approvals.inspect_by',
            'approvals.inspect_datetime',
            'approvals.evaluated_by',
            'approvals.evaluated_datetime',
            'approvals.approved_by',
            'approvals.approved_datetime',
            'approvals.disapproved_by',
            'approvals.disapproved_datetime',
            'approvals.reason',
        )
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

    public function getAllNg($part_number, $inspection_reason)
    {
        return TrialChecksheet::where('part_number', $part_number)
        ->where('inspection_reason', $inspection_reason)
        // ->where('judgment', 'NG')
        ->select('id', 'trial_number', 'date_finished', 'judgment', 'revision_number')
        ->get();
    }

    public function getFirstTrial($part_number, $inspection_reason)
    {
        return TrialChecksheet::where('part_number', $part_number)
        ->where('inspection_reason', $inspection_reason)
        ->select('id', 'trial_number')
        ->orderBy('trial_number', 'asc')
        ->first();
    }

    public function getChecksheet($part_number, $inspection_reason)
    {
        return TrialChecksheet::where('part_number', $part_number)
        ->where('inspection_reason', $inspection_reason)
        ->select('id')
        ->get();
    }

    public function history($decision)
    {
        return TrialChecksheet::join('trial_ledgers', 'trial_checksheets.application_date', 'trial_ledgers.application_date')
        ->join('approvals', 'trial_checksheets.id', 'approvals.trial_checksheet_id')
        ->join('attachments', 'trial_checksheets.id', 'attachments.trial_checksheet_id')
        ->where('approvals.decision', $decision)
        ->select(
            'trial_checksheets.id',
            'trial_checksheets.judgment',
            'trial_ledgers.part_number',
            'trial_ledgers.revision_number',
            'trial_ledgers.trial_number',
            'trial_ledgers.inspection_reason',
            'approvals.inspect_by',
            'approvals.inspect_datetime',
            'approvals.evaluated_by',
            'approvals.evaluated_datetime',
            'approvals.approved_by',
            'approvals.approved_datetime',
            'approvals.disapproved_by',
            'approvals.disapproved_datetime',
            'attachments.file_folder',
            'attachments.file_name',
            'attachments.file_merge',
            'attachments.file_name_merge',
            )
        ->get();
    }

    public function getTrialLedger()
    {
        return $this->hasOne(TrialLedger::class, 'application_date', 'application_date');
    }

    public function getApproval()
    {
        return $this->hasOne(Approval::class);
    }
}