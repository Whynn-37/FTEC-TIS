<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TaktTime;
use App\TrialChecksheet;
use App\ChecksheetItem;
use App\ChecksheetData;
class TaktTimeController extends Controller
{
    public function loadCycleTime(TaktTime $TaktTime, Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;

        $status = 'Error';
        $message = 'No data';
        $result = [];

        if ($trial_checksheet_id !== null) 
        {
            $result = $TaktTime->loadCycleTime($trial_checksheet_id);

            $status = 'Error';
            $message = 'Not Successfully Load';

            if (count($result) !== 0)
            {
                $status = 'Success';
                $message = 'Successfully Load';
            }
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

    public function startCycleTime(TrialChecksheet $TrialChecksheet,
                                    TaktTime $TaktTime,
                                    ChecksheetData $ChecksheetData,
                                    ChecksheetItem $ChecksheetItem,
                                    Request $Request)
    {
        //edited by jed
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $takt_times = $Request->takt_time;
        $part_number = $Request->part_number;
        $revision_number = $Request->revision_number;
        $trial_number = $Request->trial_number;

        $takt_time_result = [];

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
            $trial_checksheet = 
            [
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

           $takt_time_result =  $TaktTime->updateOrCreateTaktTime($data);

            $checksheet_item_result = [];
            $checksheet_data_result = [];

            if($trial_number !== 1)
            {
                $trial_number_minus = $trial_number - 1;

                $result_items = $TrialChecksheet->loadTrialCheckitemsNG($part_number, $trial_number_minus);
 
                foreach($result_items as $items_value) 
                {
                    $result_datas[] = $ChecksheetData->loadTrialCheckitemsNG($items_value->id);
                }

                for($i=0; $i < count($result_items); $i++)
                {  
                    $checksheet_items[] = 
                    [
                        'trial_checksheet_id'   => $last_id['id'],
                        'item_number'           => $result_items[$i]['item_number'],
                        'tools'                 => $result_items[$i]['tools'],
                        'type'                  => $result_items[$i]['type'],
                        'specification'         => $result_items[$i]['specification'],
                        'upper_limit'           => $result_items[$i]['upper_limit'],
                        'lower_limit'           => $result_items[$i]['lower_limit'],
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
                        'sub_number'            => $value['sub_number'],
                        'created_at'            => now(),
                        'updated_at'            => now()
                    ];
                }
                
                $checksheet_data_result =  $ChecksheetData->storeChecksheetDatas($checksheet_datas);
            }

        }

        $status = "Error";
        $message = "Not Successfully Updated";

        if($takt_time_result && $checksheet_item_result && $checksheet_data_result)
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
        $message = "No Data";
        $result = [];

        if ($trial_checksheet_id !== null) 
        {
            $start_date_time = $TaktTime->getStartDateTime($trial_checksheet_id);
            
            if (!empty($start_date_time)) 
            {
                $data = 
                [
                    'trial_checksheet_id'   => $trial_checksheet_id,
                    'start_date'            => $start_date_time['start_date'],
                    'start_time'            => $start_date_time['start_time'],
                    'end_time'              => date('H:i:s'),
                    'actual_time'           => $actual_time,
                    'total_takt_time'       => $total_takt_time,
                    'takt_time'             => $takt_time,
                ];
        
                $result =  $TaktTime->updateOrCreateTaktTime($data);
        
                $status = "Error";
                $message = "Not Successfully Updated";
        
                if($result != null)
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
