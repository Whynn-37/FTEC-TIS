<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TrialChecksheet extends Model
{

    protected $fillable = ['part_number','revision_number','trial_stage'];

    public function getTrialChecksheet($data)
    {
        return TrialChecksheet::where('part_number',$data['part_number'])
        ->where('revision_number',$data['revision_number'])
        ->where('trial_stage',$data['trial_number'])
        ->first();
    }

    public function storeTrialChecksheet($data)
    {
        return TrialChecksheet::create($data);
    }
}
