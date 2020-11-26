<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ChecksheetItem;
use App\ChecksheetData;
class ChecksheetItemController extends Controller
{
    public function storeItems(ChecksheetItem $ChecksheetItem,ChecksheetData $ChecksheetData,Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $item_number = $Request->item_number;
        $tools = $Request->tools;
        $type = $Request->type;
        $specification = $Request->specification;
        $upper_limit = $Request->upper_limit;
        $lower_limit = $Request->lower_limit;

        if ($type !== 'Min and Max' || $type !== 'Min and Max and Form Tolerance')
        {
            $specification = '-';
            $upper_limit = '-';
            $lower_limit = '-';
        }

        $status = 'Error';
        $message = 'No Data';

        $checksheet_item_id = [];
        $checksheet_data_id = [];

        if ($trial_checksheet_id !== null) 
        {
            $select_id = $ChecksheetItem->selectUpdateId($trial_checksheet_id, $item_number, $operation = '>=');

            if (count($select_id) !== 0)
            {
                $ChecksheetItem->updateId($select_id, $action = 'update');
            }

            $checksheet_item = 
            [
                'trial_checksheet_id'   => $trial_checksheet_id,
                'item_number'           => $item_number,
                'tools'                 => $tools,
                'type'                  => $type,
                'specification'         => $specification,
                'upper_limit'           => $upper_limit,
                'lower_limit'           => $lower_limit,
                'judgment'              => 'N/A',
                'item_type'             => 0,
                'judgment'              => 'N/A',
                'remarks'               => null,
                'hinsei'                => null,
            ];
    
            $checksheet_item_result =  $ChecksheetItem->updateOrCreateChecksheetItem($checksheet_item);

            $checksheet_data = 
            [
                'checksheet_item_id'    => $checksheet_item_result->id,
                'sub_number'            => 1,
                'coordinates'           => null,
                'data'                  => null,
                'judgment'              => 'N/A',
                'remarks'               => null,
            ];
            
            $checksheet_data_result =  $ChecksheetData->updateOrCreateChecksheetData($checksheet_data);
    
            $status = 'Error';
            $message = 'Not Successfully Save';
    
            if ($checksheet_item_result && $checksheet_data_result)
            {
                $status = 'Success';
                $message = 'Successfully Save';

                $checksheet_item_id = $checksheet_item_result->id;
                $checksheet_data_id = $checksheet_data_result->id;
            }
        }

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => 
            [
                'checksheet_item_id' => $checksheet_item_id,
                'checksheet_data_id' => $checksheet_data_id
            ]
        ];
    }

    public function deleteItem(ChecksheetItem $ChecksheetItem, Request $Request)
    {
        $id = $Request->id;
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $item_number = $Request->item_number;

        $status = 'Error';
        $message = 'No Data';

        if ($id !== null) 
        {
            $select_id = $ChecksheetItem->selectUpdateId($trial_checksheet_id, $item_number, $operation = '>');
        
            if (count($select_id) !== 0)
            {
                $ChecksheetItem->updateId($select_id, $action = 'delete');
            }

            $result = $ChecksheetItem->deleteItem($id);

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
