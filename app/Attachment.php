<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $guarded = [];

    public function storeAttachments($data)
    {
        return Attachment::create($data);
    }

    public function getAttachment($id)
    {
        return Attachment::where('trial_checksheet_id', $id)
        ->select('id', 'file_folder', 'file_name')
        ->first();
    }
}
