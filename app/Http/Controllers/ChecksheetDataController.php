<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ChecksheetData;

class ChecksheetDataController extends Controller
{
    public function storeDatas(ChecksheetData $checksheet_data,Request $request)
    {
        $checksheet_item_id = $request->checksheet_item_id;
        $sub_number         = $request->sub_number;

        $status = 'Error';
        $message = 'no data';

        if ($checksheet_item_id !== null && $sub_number !== null)
        {
            $data = [
                'checksheet_item_id' => $checksheet_item_id,
                'sub_number'         => $sub_number,
                'coordinates'        => null,
                'data'               => null,
                'judgment'           => null,
                'remarks'            => null,
                'hinsei'             => null
            ];
    
            $result =  $checksheet_data->updateOrCreateChecksheetData($data);

            $status = 'Success';
            $message = 'Successfully Saved';
        }

        return [
            'status' => $status,
            'message' => $message,
            'data'  => $result->id
        ];
    }

    public function deleteDatas(ChecksheetData $checksheet_data,Request $request)
    {
        $id = $request->id;

        $status = 'Error';
        $message = 'no data';

        if($id !== null)
        {
            $result =  $checksheet_data->deleteDatas($id);

            return [
                'status' => 'Success' ,
                'message' => 'Successfully Deleted' ,
                'data'    => $result
             ];
        }
    }
}
