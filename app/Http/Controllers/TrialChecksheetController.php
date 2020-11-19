<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TrialLedger;
use App\Supplier;
use App\TrialChecksheet;
use App\ChecksheetItem;
use App\ChecksheetData;
use App\TaktTime;
use App\DownTime;
use App\Http\Controllers\UploadController;
use DB;

class TrialChecksheetController extends Controller
{
    public function loadPartnumber(TrialLedger $trial_ledger, request $request)
    {
        $message = 'No part number';
        $status = 'Error';
        
        $result = $trial_ledger->loadPartnumber($request->id);

        if (count($result) !== 0) {
            $message = 'Part number loaded successfully';
            $status = 'Success';
        }

        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ]);
    }

    public function loadRevision(TrialLedger $trial_ledger, request $request)
    {
        $message = 'No revision';
        $status = 'Error';

        $result = $trial_ledger->loadRevision($request->part_number);

        if (count($result) !== 0) {
            $message = 'Revision number loaded successfully';
            $status = 'Success';
        }

        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ]);
    }

    public function loadTrialNumber(TrialLedger $trial_ledger, request $request)
    {
        $message = 'No Trial number';
        $status = 'Error';

        $data = [
            'revision_number'   =>  $request->revision_number,
            'part_number'       =>  $request->part_number
        ];

        $result = $trial_ledger->loadTrialNumber($data);

        if (count($result) !== 0) {
            $message = 'Trial number loaded successfully';
            $status = 'Success';
        }
        
        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ]);
    }

    public function loadDetails(TrialLedger $trial_ledger,
                                Supplier $supplier,
                                TrialChecksheet $trial_checksheet,
                                ChecksheetItem $checksheet_item,
                                ChecksheetData $checksheet_data, 
                                TaktTime $takt_time,
                                DownTime $down_time,
                                request $request)
    {

        $message = 'No Data';
        $status = 'Error';
        $result_data = [];
        if ($request->part_number != null || 
        $request->revision_number != null || 
        $request->trial_number != null) 
        {
            $message = 'Successfully Load';
            $status = 'Success';

            $data = [
                'part_number'       =>  $request->part_number,
                'revision_number'   =>  $request->revision_number,
                'trial_number'      => $request->trial_number
            ];

            $data_trial_ledger  = json_decode(json_encode($trial_ledger->getTrialLedger($data)),true);
            $data_supplier      = json_decode(json_encode($supplier->getSupplier($data_trial_ledger['supplier_code'])),true);

            $data_trial_ledger_merge = array_merge($data_trial_ledger,$data_supplier);

            $data_trial_checksheet  = json_decode(json_encode($trial_checksheet->getTrialChecksheet($data)),true);
            
            $data_checksheet_item = [];
            $data_checksheet_data = [];
            $data_takt_time = [];
            $data_down_time = [];

            if($data_trial_checksheet)
            {
                // if exist
                $data_trial_checksheet_merge = array_merge($data_trial_ledger_merge, $data_trial_checksheet);

                $data_checksheet_item = json_decode(json_encode($checksheet_item->getChecksheetItem($data_trial_checksheet['id'])),true);

                for ($i=0; $i < count($data_checksheet_item); $i++) 
                { 
                    $data_checksheet_data [] = json_decode(json_encode($checksheet_data->getChecksheetData($data_checksheet_item[$i]['id'])),true);
                }
                
                $data_takt_time = json_decode(json_encode($takt_time->loadCycleTime($data_trial_checksheet['id'])),true);
                $data_down_time = json_decode(json_encode($down_time->loadDownTime($data_trial_checksheet['id'])),true);
            }
            else
            {
                // not exist
                $id = [
                    'id' => null
                ];
                
                $data_trial_checksheet_merge = array_merge($data_trial_ledger_merge, $id);
            }

            $result_data = [
                'trial_checksheets' => $data_trial_checksheet_merge,
                'checksheet_items'  => $data_checksheet_item,
                'checksheet_datas'  => $data_checksheet_data,
                'takt_times'        => $data_takt_time,
                'down_times'        => $data_down_time
            ];
        }

        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result_data
        ]);
    }

   
    public function storeIgm (UploadController $upload, 
                                ChecksheetItem $checksheet_item,
                                ChecksheetData $checksheet_data, 
                                Request $request)
    {
        $part_number = $request->part_number;
        $revision_number   = $request->revision_number;
        $trial_checksheet_id = $request->trial_checksheet_id;

        // $filename =$part_number.'_'.$revision_number;
        $filename =$part_number.'_'.$revision_number.'(00)';
        // $path ='//10.51.10.39/Sharing/system igm/Guidance Manual/system igm/';
        $path ='F:\TIS\\';

        $igm_files = scandir($path);

        //filtering of igm file
        for ($i=0; $i < count($igm_files); $i++) 
        { 
           if(strpos($igm_files[$i],$filename) !== false)
           {
              $filtered_igm [] = $igm_files[$i];
           }
        }
         
        $igm_data =  end($filtered_igm);

        // $file = '\\\10.51.10.39\Sharing\system igm\Guidance Manual\system igm\\'.$igm_data;
        $file = 'F:\TIS\\'.$igm_data;

        // $file = '\\\10.164.30.10\mit\Personal\Terry -shared 166\TIS\TIS DATA\\'.'IGM.xlsx';
        $sheet = 0;

        if(file_exists($file))
        {
            $data = $upload->upload($file,$sheet);

            for($i=6; $i < count($data); $i++)
            {  
                $igm_result [] =[
                    'item_number'       => $data[$i][26],//sub no
                    'type'              => $data[$i][28],//type
                    'specification'     => $data[$i][29],//nominal
                    'upper_limit'       => $data[$i][31],//ul
                    'lower_limit'       => $data[$i][32],//ll
                    'tools'             => $data[$i][37]//tools
                ];
            }

            for($i=0; $i < count($igm_result); $i++)
            {  
                if($igm_result[$i]['item_number'] !== null &&
                $igm_result[$i]['item_number'] !== 'Sub Seq')
                {
                    $checksheet_items[] = [
                        'trial_checksheet_id'   => $trial_checksheet_id,
                        'item_number'           => intval($igm_result[$i]['item_number']),
                        'tools'                 => $igm_result[$i]['tools'],
                        'type'                  => $igm_result[$i]['type'],
                        'specification'         => $igm_result[$i]['specification'],
                        'upper_limit'           => $igm_result[$i]['upper_limit'],
                        'lower_limit'           => $igm_result[$i]['lower_limit'],
                        'item_type'             => 1,
                        'created_at'            => now(),
                        'updated_at'            => now()
                    ];
                }
            }

            $checksheet_item_result =  $checksheet_item->storeChecksheetItems($checksheet_items);

            for($i=0; $i< count($checksheet_item_result);$i++)
            {   
                $checksheet_datas [] = [
                    'checksheet_item_id'    => $checksheet_item_result[$i],
                    'sub_number'            => 1,
                    'created_at'            => now(),
                    'updated_at'            => now()
                ];
            }
            $checksheet_data_result =  $checksheet_data->storeChecksheetDatas($checksheet_datas);


            $status = 'Error';
            $message = 'no data';
            $result = false;

            if ($checksheet_item_result && $checksheet_data_result)
            {
                $status = 'Success';
                $message = 'Successfully Save';
                $result = true;
            }

            return[
                'status' => $status,
                'message' => $message,
                'result'    => $result
            ];
        } 

    }

    public function loadIgm(TrialChecksheet $trial_checksheet, ChecksheetItem $checksheet_item, Request $request)
    {

        $status = 'Error';
        $message = 'no i.d';
        $checksheet_items = [];
        $checksheet_datas = [];

        $trial_checksheet_id = $request->trial_checksheet_id;

        if($trial_checksheet_id !== null)
        {
            $checksheet_items = $trial_checksheet->loadChecksheetItem($trial_checksheet_id);
            $checksheet_datas = $checksheet_item->loadChecksheetData($checksheet_items);

            $status = 'Success';
            $message = 'Successfully';
        }

        return [
            'status'    => $status,
            'message'   => $message,
            'data'      => 
                [
                    'items' => $checksheet_items,
                    'datas' => $checksheet_datas,
                ]
            ];
    }
    
}