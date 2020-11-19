<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\UploadController;

class TestController extends Controller
{
    public function test(UploadController $upload)
    {
        $path = '\\\10.164.20.211\uploads\trial_ledger.xlsx';

        // $result = $upload->upload($path);
        // return $path;
    }

    public function uploadTest(Request $request)
    {
        $file_names = ['numbering_drawing','material_certification','special_tool_data','others_1','others_2'];

        $requestKeys = collect($request->except('trial_checksheet_id','date_inspected','temperature','humidity','judgement','date_finished'))->keys();

        $part_number    = 'test_partnumber';
        
        for($i=0; $i < count($requestKeys); $i++)
        {
            $files []       = $file_names[$i].'.'.request()->file($file_names[$i])->getClientOriginalExtension();

            $file_upload [] = request()->file($file_names[$i])->storeAs($part_number,$files[$i],'public');
        }
    }
}
