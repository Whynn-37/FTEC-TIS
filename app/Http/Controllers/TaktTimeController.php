<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TaktTime;
use App\TrialChecksheet;
use App\ChecksheetItem;
use App\ChecksheetData;
use App\TrialLedger;
use App\Approval;
use App\Attachment;
use Session;
use DB;
use App\Helpers\ActivityLog;
class TaktTimeController extends Controller
{
    public function loadCycleTime(TaktTime $TaktTime, Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;

        $status = 'Success';
        $message = 'Successfully Load';
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
                                    Approval $Approval,
                                    Attachment $Attachment,
                                    Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $application_date = $Request->application_date;
        $takt_times = $Request->takt_time;
        $part_number = $Request->part_number;
        $revision_number = $Request->revision_number;
        $trial_number = $Request->trial_number;
        $inspection_reason = $Request->inspection_reason;

        $takt_time_result = [];
        $checksheet_item_result = [];
        $checksheet_data_result = [];
        $checksheet_items = [];
        $approval_result = [];
        $attachment_result = [];

        DB::beginTransaction();

        try
        {
            $in_use_data = $TrialChecksheet->getInUse($application_date);

            $in_use = '';

            if ( !empty($in_use_data) ) 
                $in_use = $in_use_data['in_use'];

            if ($in_use === 0 || $in_use === '') 
            {
                if($trial_checksheet_id !== null)
                {
                    $data = 
                    [
                        'trial_checksheet_id'   => $trial_checksheet_id,
                        'start_date'            => date('Y/m/d'),
                        'start_time'            => date('H:i:s'),
                        'end_time'              => '',
                        'actual_time'           => '',
                        'total_takt_time'       => '',
                        'takt_time'             => $takt_times,
                    ];

                    $status = "Success";
                    $message = "Inspection will continue"; 

                    $takt_time_result = $TaktTime->updateOrCreateTaktTime($data);

                    $TrialChecksheet->updateTrialChecksheet($trial_checksheet_id, ['in_use' => 1]);
                }
                else
                {
                    $trial_rm_4m = 0;
                    $prev_application_date = $TrialLedger->getApplicationDate($part_number, $inspection_reason, $trial_number-1);

                    if ($trial_number == 99 || $trial_number == 88) 
                    {
                        $trial_rm_4m = $TrialLedger->countTrialRm4m($part_number, $inspection_reason);
                        $prev_application_date = $TrialChecksheet->getApplicationDate($part_number, $inspection_reason, $trial_rm_4m-1);
                    }

                    $trial_checksheet = 
                    [
                        'application_date'      => $application_date,
                        'part_number'           => $part_number,
                        'revision_number'       => $revision_number,
                        'trial_number'          => $trial_number,
                        'inspection_reason'     => $inspection_reason,
                        'date_inspected'        => now(),
                        'in_use'                => 1,
                        'trial_rm_4m'           => $trial_rm_4m,
                    ];
            
                    $last_id =  $TrialChecksheet->storeTrialChecksheet($trial_checksheet);
                    
                    $data = 
                    [
                        'trial_checksheet_id'   => $last_id['id'],
                        'start_date'            => date('Y/m/d'),
                        'start_time'            => date('H:i:s'),
                        'end_time'              => '',
                        'actual_time'           => '',
                        'total_takt_time'       => '',
                        'takt_time'             => $takt_times,
                    ];

                    $approval_data =
                    [
                        'trial_checksheet_id'      => $last_id['id'],
                        'inspect_by'               => Session::get('name'), // session name
                        'inspect_datetime'         => now(),
                        'decision'                 => 4
                    ];

                    $approval_result = $Approval->storeApproval($approval_data);

                    $attachment_data =
                    [
                        'trial_checksheet_id'   => $last_id['id'],
                        'file_folder'           => '',
                        'file_name'             => ''
                    ];

                    $attachment_result = $Attachment->storeAttachments($attachment_data);

                    if($trial_number >= 2 || $trial_rm_4m >= 2)
                    {
                        $result_items = $TrialChecksheet->loadTrialCheckitemsNG($prev_application_date);
                        
                        if (count($result_items) !== 0) 
                        {
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
                                    'remarks'               => $items_value->remarks,
                                    'judgment'              => 'N/A',
                                    'hinsei'                => '',
                                    'item_type'             => $items_value->item_type,
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
                                    'coordinates'           => $value['coordinates'],
                                    'sub_number'            => $value['sub_number'],
                                    'data'                  => '-,-,-,-,-,-,-,-,-,-',
                                    'judgment'              => 'N/A',
                                    'remarks'               => $value['remarks'],
                                    'type'                  => $value['type'],
                                    'hinsei'                => '',
                                    'created_at'            => now(),
                                    'updated_at'            => now()
                                ];
                            }
                            
                            $checksheet_data_result =  $ChecksheetData->storeChecksheetDatas($checksheet_datas);
                        }
                    }

                    $takt_time_result = $TaktTime->updateOrCreateTaktTime($data);

                    $status = "Success";
                    $message = "Inspection begins"; 

                    $trial_checksheet_id = $last_id['id'];
                }
            }
            else 
            {
                $status = 'Attention';
                $message = 'This Part Number is On-going inspection';
            }

            DB::commit();
        } 
        catch (\Throwable $th) 
        {
            $status = 'Error';
            $message = $th->getMessage();
            DB::rollback();
        }

        ActivityLog::activityLog($message . ' - Id : ' . $trial_checksheet_id . ' - Takt Time : ' . $takt_times, Session::get('name'));

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  
            [
                'takt_time' => $takt_time_result,
                'items'     => $checksheet_item_result,
                'data'      => $checksheet_data_result,
                'approval'  => $approval_result,
                'attachment'=> $attachment_result,
            ]
        ];
    }

    public function StopCycleTime(TaktTime $TaktTime, TrialChecksheet $TrialChecksheet, Request $Request)
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

                $TrialChecksheet->updateTrialChecksheet($trial_checksheet_id, ['in_use' => 0]);
        
                $result = $TaktTime->updateOrCreateTaktTime($data);
        
                $status = "Error";
                $message = "Not Successfully Updated";
        
                if($result)
                {
                    $status = "Success";
                    $message = "Inspection stopped";
                }
            }
        }

        ActivityLog::activityLog($message . ' - Id : ' . $trial_checksheet_id . ' - Actual Time : ' . $actual_time . ' - Total Takt Time : ' . $total_takt_time  . ' - Takt Time : ' . $takt_time, Session::get('name'));

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }
}