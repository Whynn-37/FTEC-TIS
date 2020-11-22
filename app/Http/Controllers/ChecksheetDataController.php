<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ChecksheetData;
class ChecksheetDataController extends Controller
{
    public function storeDatas(ChecksheetData $ChecksheetData, Request $Request)
    {
        $checksheet_item_id = $Request->checksheet_item_id;
        $sub_number = $Request->sub_number;

        $status = 'Error';
        $message = 'no data';
        $result = [];

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
    
            $result = $ChecksheetData->updateOrCreateChecksheetData($data);

            $status = 'Error';
            $message = 'Not Successfully Saved';

            if ($result) 
            {
                $status = 'Success';
                $message = 'Successfully Saved';
                $result = $result->id;
            }
        }

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => $result
        ];
    }

    public function deleteDatas(ChecksheetData $ChecksheetData, Request $Request)
    {
        $id = $Request->id;

        $status = 'Error';
        $message = 'no data';

        if($id !== null)
        {
            $result =  $ChecksheetData->deleteDatas($id);

            $status = 'Error';
            $message = 'Not Successfully Deleted';

            if ($result) 
            {
                $status = 'Success';
                $message = 'Successfully Deleted';
            }
        }

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => $result
        ];
    }
}
