<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TaktTime;
use App\TrialChecksheet;
use App\ChecksheetItem;
use App\ChecksheetData;
use App\TrialLedger;
use DB;
class TaktTimeController extends Controller
{
    public function loadCycleTime(TaktTime $TaktTime, Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;

        $status = 'Error';
        $message = 'No Trial Checksheet ID';
        $data = [];

        if ($trial_checksheet_id !== null) 
        {
            $data = $TaktTime->loadCycleTime($trial_checksheet_id);

            $status = 'Error';
            $message = 'Not Successfully Load';

            if (count($data) !== 0)
            {
                $status = 'Success';
                $message = 'Successfully Load';
            }
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $data
        ];
    }

    public function startCycleTime(TrialLedger $TrialLedger,
                                    TrialChecksheet $TrialChecksheet,
                                    TaktTime $TaktTime,
                                    ChecksheetData $ChecksheetData,
                                    ChecksheetItem $ChecksheetItem,
                                    Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $application_date = $Request->application_date;
        $takt_times = $Request->takt_time;
        $part_number = $Request->part_number;
        $revision_number = $Request->revision_number;
        $trial_number = $Request->trial_number;

        $takt_time_result = [];
        $checksheet_item_result = [];
        $checksheet_data_result = [];

        if($trial_checksheet_id !== null)
        {
            $data = 
            [
                'trial_checksheet_id'   => $trial_checksheet_id,
                'start_date'            => date('Y/m/d'),
                'start_time'            => date('H:i:s'),
                'end_time'              => null,
                'actual_time'           => null,
                'total_takt_time'       => null,
                'takt_time'             => $takt_times,
            ];
        }
        else
        {
            DB::beginTransaction();

            try
            {
                $trial_checksheet = 
                [
                    'application_date'      => $application_date,
                    'part_number'           => $part_number,
                    'revision_number'       => $revision_number,
                    'trial_number'          => $trial_number
                ];
        
                $last_id =  $TrialChecksheet->storeTrialChecksheet($trial_checksheet);
                
                $data = 
                [
                    'trial_checksheet_id'   => $last_id['id'],
                    'start_date'            => date('Y/m/d'),
                    'start_time'            => date('H:i:s'),
                    'end_time'              => null,
                    'actual_time'           => null,
                    'total_takt_time'       => null,
                    'takt_time'             => $takt_times,
                ];
                
                if($trial_number >= 2)
                {
                    $application_date = $TrialLedger->getApplicationDate($part_number);
                    
                    $result_items = $TrialChecksheet->loadTrialCheckitemsNG($application_date);
    
                    foreach($result_items as $items_value) 
                    {
                        $result_datas[] = $ChecksheetData->loadTrialCheckitemsNG($items_value->id);

                        $checksheet_items[] = 
                        [
                            'trial_checksheet_id'   => $last_id['id'],
                            'item_number'           => $items_value->item_number,
                            'tools'                 => $items_value->tools,
                            'type'                  => $items_value->type,
                            'specification'         => $items_value->specification,
                            'upper_limit'           => $items_value->upper_limit,
                            'lower_limit'           => $items_value->lower_limit,
                            'judgment'              => 'N/A',
                            'item_type'             => 0,
                            'created_at'            => now(),
                            'updated_at'            => now()
                        ];
                    }

                    $checksheet_item_result =  $ChecksheetItem->storeChecksheetItems($checksheet_items);

                    $new_array = [];
                    for($i=0; $i<count($result_datas); $i++)
                    {
                        $items = $result_datas[$i];

                        foreach($items as $item)
                        {
                            $item->checksheet_item_id = $checksheet_item_result[$i];
                            $new_array[] = $item;
                        }
                    }
                    
                    foreach ($new_array as $value) 
                    {
                        $checksheet_datas[] =
                        [
                            'checksheet_item_id'    => $value['checksheet_item_id'],
                            'coordinates'            => $value['coordinates'],
                            'sub_number'            => $value['sub_number'],
                            'created_at'            => now(),
                            'updated_at'            => now()
                        ];
                    }
                    
                    $checksheet_data_result =  $ChecksheetData->storeChecksheetDatas($checksheet_datas);
                }

                DB::commit();
            } 
            catch (\Throwable $th) 
            {
                $status = 'Error';
                $message = $th->getMessage();
                DB::rollback();
            }
        }

        $takt_time_result = $TaktTime->updateOrCreateTaktTime($data);

        $status = "Error";
        $message = "Not Successfully Updated";

        if($takt_time_result)
        {
            $status = "Success";
            $message = "Successfully Updated"; 
        }
        
        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  
            [
                'takt_time' => $takt_time_result,
                'items'     => $checksheet_item_result,
                'data'      => $checksheet_data_result,
            ]
        ];
    }

    public function StopCycleTime(TaktTime $TaktTime, Request $Request)
    {
        $trial_checksheet_id    = $Request->trial_checksheet_id;
        $actual_time            = $Request->actual_time;
        $total_takt_time        = $Request->total_takt_time;
        $takt_time              = $Request->takt_time;

        $status = "Error";
        $message = "No Trial Checksheet ID";
        $result = [];

        if ($trial_checksheet_id !== null) 
        {
            $start_date_time_data = $TaktTime->getStartDateTime($trial_checksheet_id);
            
            if (!empty($start_date_time_data)) 
            {
                $data = 
                [
                    'trial_checksheet_id'   => $trial_checksheet_id,
                    'start_date'            => $start_date_time_data['start_date'],
                    'start_time'            => $start_date_time_data['start_time'],
                    'end_time'              => date('H:i:s'),
                    'actual_time'           => $actual_time,
                    'total_takt_time'       => $total_takt_time,
                    'takt_time'             => $takt_time,
                ];
        
                $result = $TaktTime->updateOrCreateTaktTime($data);
        
                $status = "Error";
                $message = "Not Successfully Updated";
        
                if($result)
                {
                    $status = "Success";
                    $message = "Successfully Updated";
                }
            }
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }
}
