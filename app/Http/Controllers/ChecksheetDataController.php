<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ChecksheetData;
use App\ChecksheetItem;

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
            $select_id = $ChecksheetData->selectUpdateId($checksheet_item_id, $sub_number, $operation = '>=');

            if (count($select_id) !== 0)
            {
                $ChecksheetData->updateId($select_id, $action = 'update');
            }

            $data = [
                'checksheet_item_id' => $checksheet_item_id,
                'sub_number'         => $sub_number,
                'coordinates'        => null,
                'data'               => null,
                'judgment'           => 'N/A',
                'remarks'            => null,
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

    public function deleteDatas(ChecksheetData $ChecksheetData, ChecksheetItem $ChecksheetItem, Request $Request)
    {
        $id                 = $Request->id;
        $checksheet_item_id = $Request->checksheet_item_id;
        $sub_number         = $Request->sub_number;
        $judgment           = $Request->judgment;

        $status = 'Error';
        $message = 'no data';
        $test = 0;
        if($id !== null)
        {
            if ($judgment !== null)
            {
                $items = 
                [
                    'judgment'              => $judgment
                ];

                $test = $ChecksheetItem->updateAutoJudgmentItem($checksheet_item_id, $items);
            }

            $select_id = $ChecksheetData->selectUpdateId($checksheet_item_id, $sub_number, $operation = '>');

            if (count($select_id) !== 0)
            {
                $ChecksheetData->updateId($select_id, $action = 'delete');
            }

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
            'data'      => $result,
            'test'      => $test,
        ];
    }
}
