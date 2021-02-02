<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ChecksheetItem;
use App\ChecksheetData;
use DB;
use App\Helpers\ActivityLog;
use Session;
class ChecksheetItemController extends Controller
{
    public function storeItems(ChecksheetItem $ChecksheetItem,ChecksheetData $ChecksheetData,Request $Request)
    {
        $id = $Request->id;
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $item_number = $Request->item_number;
        $tools = $Request->tools;
        $type = $Request->type;
        $specification = $Request->specification;
        $upper_limit = $Request->upper_limit;
        $lower_limit = $Request->lower_limit;
        
        $status = 'Error';
        $message = 'No Data';

        $checksheet_item_id = [];
        $checksheet_data_id = [];
        
        if ($trial_checksheet_id !== null) 
        {
            DB::beginTransaction();

            try 
            {
                if ($id === null)
                {   
                    $select_id = $ChecksheetItem->selectUpdateId($trial_checksheet_id, $item_number, '>=');

                    if (count($select_id) !== 0)
                    {
                        $ChecksheetItem->updateId($select_id, 'update');
                    }
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
                    'remarks'               => '',
                    'hinsei'                => '',
                ];
        
                $checksheet_item_result =  $ChecksheetItem->updateOrCreateChecksheetItem($checksheet_item);

                $checksheet_data = 
                [
                    'checksheet_item_id'    => $checksheet_item_result->id,
                    'sub_number'            => 1,
                    'coordinates'           => '',
                    'data'                  => '',
                    'judgment'              => 'N/A',
                    'remarks'               => '',
                    'type'                  => $type,
                ];
                
                $checksheet_data_result =  $ChecksheetData->updateOrCreateChecksheetData($checksheet_data);
        
                $status = 'Success';
                $message = 'Item added';

                $checksheet_item_id = $checksheet_item_result->id;
                $checksheet_data_id = $checksheet_data_result->id;

                DB::commit();
            } 
            catch (\Throwable $th) 
            {
                $status = 'Error';
                $message = $th->getMessage();
                DB::rollback();
            }
        }

        ActivityLog::activityLog($message . ' - Id : ' . $trial_checksheet_id . ' - Item Number : ' . $item_number . ' - Tools : ' . $tools . ' - Type : ' . $type . ' - Specs : ' . $specification . ' - Upper Limit : ' . $upper_limit . ' - Lower Limit : ' . $lower_limit, Session::get('name'));
     
        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => 
            [
                'checksheet_item_id' => $checksheet_item_id,
                'checksheet_data_id' => $checksheet_data_id,
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
            DB::beginTransaction();

            try 
            {
                $select_id = $ChecksheetItem->selectUpdateId($trial_checksheet_id, $item_number, '>');
            
                if (count($select_id) !== 0)
                {
                    $ChecksheetItem->updateId($select_id, 'delete');
                }

                $result = $ChecksheetItem->deleteItem($id);

                $status = 'Success';
                $message = 'Item deleted';

                DB::commit();
            } 
            catch (\Throwable $th) 
            {
                $status = 'Error';
                $message = $th->getMessage();
                DB::rollback();
            }
        }
        
        ActivityLog::activityLog($message . ' - Id : ' . $trial_checksheet_id . ' - Item Number : ' . $item_number, Session::get('name'));


        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => $result
        ];
    }
}
