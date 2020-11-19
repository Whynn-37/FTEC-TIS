<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ChecksheetItem;
use App\ChecksheetData;

class ChecksheetItemController extends Controller
{
    public function storeItems(ChecksheetItem $checksheet_item,ChecksheetData $checksheet_data,Request $request)
    {
        $trial_checksheet_id = $request->trial_checksheet_id;
        $item_number         = $request->item_number;
        $tools               = $request->tools;
        $type                = $request->type;
        $specification       = $request->specification;
        $upper_limit         = $request->upper_limit;
        $lower_limit         = $request->lower_limit;
        $sub_number          = $request->sub_number;

        $checksheet_items = [
            'trial_checksheet_id'   => $trial_checksheet_id,
            'item_number'           => $item_number,
            'tools'                 => $tools,
            'type'                  => $type,
            'specification'         => $specification,
            'upper_limit'           => $upper_limit,
            'lower_limit'           => $lower_limit,
            'item_type'             => 0,
            'created_at'            => now(),
            'updated_at'            => now()
        ];

        $checksheet_item_result =  $checksheet_item->updateOrCreateChecksheetItem($checksheet_items);
        
        $checksheet_datas = [
            'checksheet_item_id'    => $checksheet_item_result->id,
            'sub_number'            => 1,
            'coordinates'           => null,
            'data'                  => null,
            'judgment'              => null,
            'remarks'               => null,
            'hinsei'                => null,
        ];
        
        $checksheet_data_result =  $checksheet_data->updateOrCreateChecksheetData($checksheet_datas);

        $status = 'Error';
        $message = 'Not Successfully Save';

        if ($checksheet_item_result && $checksheet_data_result)
        {
            $status = 'Success';
            $message = 'Successfully Save';
        }

        return [
            'status' => $status,
            'message' => $message,
            'data' => [
                'checksheet_item_id' => $checksheet_item_result->id,
                'checksheet_data_id' => $checksheet_data_result->id
            ]
        ];
    }

    public function deleteItem(ChecksheetItem $checksheet_item, Request $request)
    {
        $id = $request->id;

        $result = $checksheet_item->deleteItem($id);

        $status = 'Error';
        $message = 'no data';

        if ($result)
        {
            $status = 'Success';
            $message = 'Successfully Deleted';
        }

        return [
            'status' => $status,
            'message' => $message,
        ];
    }
}
