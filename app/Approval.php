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

    public function approved($trial_checksheet_id, $data)
    {
        return Approval::where('trial_checksheet_id', $trial_checksheet_id)->update($data);
    }

    public function getApproval($id)
    {
        return Approval::where('trial_checksheet_id', $id)
        ->first();
    }
}
