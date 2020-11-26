<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use DB;

class Approval extends Model
{

    protected $guarded = [];

    public function storeApproval($data)
    {
        return Approval::create($data);
    }
    
    public function loadApproval()
    {
        return DB::table('trial_checksheets')
        ->join('approvals', 'approvals.trial_checksheet_id', 'trial_checksheets.id')
        ->where('trial_checksheets.date_finished', '!=', null)
        ->where('approvals.decision', 2)
        ->select(['trial_checksheets.id', 'trial_checksheets.part_number', 'trial_checksheets.revision_number', 'trial_checksheets.trial_number', 'trial_checksheets.date_finished', 'trial_checksheets.judgment'])
        ->get();
    }

    public function loadDisapproved()
    {
        return DB::table('trial_checksheets')
        ->join('approvals', 'approvals.trial_checksheet_id', 'trial_checksheets.id')
        ->where('approvals.decision', 3)
        ->select(['trial_checksheets.part_number', 'trial_checksheets.revision_number', 'trial_checksheets.trial_number', 'approvals.disapproved_by', 'approvals.disapproved_datetime', 'approvals.reason'])
        ->get();
    }
}
