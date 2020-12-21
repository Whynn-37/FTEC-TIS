<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class History extends Model
{
    public function loadPartnumberHistory($column, $part_number)
    {
        return DB::table('trial_ledgers')
        ->join('trial_checksheets', 'trial_checksheets.part_number', 'trial_ledgers.part_number')
        ->join('approvals', 'approvals.trial_checksheet_id', 'trial_checksheets.id')
        ->where('trial_ledgers.part_number', $part_number)
        ->where($column)
        ->select('trial_checksheets.part_number', 'trial_ledgers.part_name')
        ->get();
    }
}
