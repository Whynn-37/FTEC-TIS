<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ChecksheetData;
use App\ChecksheetItem;
use App\Helpers\ActivityLog;// ako nag add kase hindi nagana wala nito - george
use Session;// ako nag add kase hindi nagana wala nito - george
use DB;

class ChecksheetDataController extends Controller
{
    public function storeDatas(ChecksheetData $ChecksheetData, Request $Request)
    {
        $checksheet_item_id = $Request->checksheet_item_id;
        $sub_number = $Request->sub_number;

        $status = 'Error';
        $message = 'No Trial Checksheet ID Or Sub Number';
        $result = [];

        if ($checksheet_item_id !== null && $sub_number !== null)
        {
            DB::beginTransaction();

            try 
            {
                $select_id = $ChecksheetData->selectUpdateId($checksheet_item_id, $sub_number, '>=');

                if (count($select_id) !== 0)
                {
                    $ChecksheetData->updateId($select_id, 'update');
                }

                $data = [
                    'checksheet_item_id' => $checksheet_item_id,
                    'sub_number'         => $sub_number,
                    'coordinates'        => '',
                    'data'               => '',
                    'judgment'           => 'N/A',
                    'remarks'            => '',
                ];
        
                $result = $ChecksheetData->updateOrCreateChecksheetData($data);

                $status = 'Success';
                $message = 'Successfully Saved';
                $result = $result->id;

                DB::commit();
            } 
            catch (\Throwable $th) 
            {
                $status = 'Error';
                $message = $th->getMessage();
                DB::rollback();
            }
        }

        ActivityLog::activityLog($message . ' - Id : ' . $checksheet_item_id . ' - Sub Number : ' . $sub_number, Session::get('name'));

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
        $message = 'No ID';
        $result = false;

        if($id !== null)
        {
            DB::beginTransaction();

            try 
            {
                if ($judgment !== null)
                {
                    $items = 
                    [
                        'judgment'              => $judgment
                    ];

                    $ChecksheetItem->updateAutoJudgmentItem($checksheet_item_id, $items);
                }

                $select_id = $ChecksheetData->selectUpdateId($checksheet_item_id, $sub_number, '>');

                if (count($select_id) !== 0)
                {
                    $ChecksheetData->updateId($select_id, 'delete');
                }

                $result =  $ChecksheetData->deleteDatas($id);

                $status = 'Success';
                $message = 'Successfully Deleted';

                DB::commit();
            } 
            catch (\Throwable $th) 
            {
                $status = 'Error';
                $message = $th->getMessage();
                DB::rollback();
            }
        }

        ActivityLog::activityLog($message . ' - Id : ' . $checksheet_item_id . ' - Sub Number : ' . $sub_number . ' - Judgment : ' . $judgment, Session::get('name'));

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => $result,
        ];
    }
}
