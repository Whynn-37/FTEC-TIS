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

    public function loadTrialStage(TrialLedger $trial_ledger, request $request)
    {
        $message = 'No Trial number';
        $status = 'Error';

        $data = [
            'revision_number'   =>  $request->revision_number,
            'part_number'       =>  $request->part_number
        ];

        $result = $trial_ledger->loadTrialStage($data);

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
            $message = 'uuhm uuhmm';
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
                
                $data_takt_time = json_decode(json_encode($takt_time->getTaktTime($data_trial_checksheet['id'])),true);
                $data_down_time = json_decode(json_encode($down_time->getDownTime($data_trial_checksheet['id'])),true);
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

    
}