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
        ->select('id','file_folder','file_name', 'file_merge', 'file_name_merge')
        ->first();
    }

    public function storeFileMerge($id, $data)
    {
        return Attachment::where('trial_checksheet_id', $id)->update($data);
    }
}
