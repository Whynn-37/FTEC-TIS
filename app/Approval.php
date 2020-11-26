<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
class Approval extends Model
{

    protected $guarded = [];

    public function storeApproval($data)
    {
        return Approval::create($data);
    }
}
