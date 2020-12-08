<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\UploadController;
use App\TrialLedger;
use App\Supplier;
use App\TrialChecksheet;
use App\ChecksheetItem;
use App\ChecksheetData;
use App\TaktTime;
use App\Approval;
use App\Attachment;
use Session;
use DB;
class TrialChecksheetController extends Controller
{
    public function loadPartnumber(TrialLedger $TrialLedger)
    {
        $data = $TrialLedger->loadPartnumber();

        $status = 'Error';
        $message = 'No Part Number';

        if (count($data) !== 0) 
        {
            $status = 'Success';
            $message = 'Part Number Successfully Load';
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $data
        ];
    }

    public function loadRevision(TrialLedger $TrialLedger, Request $Request)
    {
        $part_number = $Request->part_number;

        $status = 'Error';
        $message = 'Part Number Required';
        $data = [];

        if ($part_number !== null) 
        {
            $data = $TrialLedger->loadRevision($part_number);

            $status = 'Error';
            $message = 'No Revision Number';

            if (count($data) !== 0) 
            {
                $status = 'Success';
                $message = 'Revision Number Successfully load';
            }
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $data
        ];
    }

    public function loadTrialNumber(TrialLedger $TrialLedger, Request $Request)
    {
        $part_number = $Request->part_number;
        $revision_number = $Request->revision_number;

        $status = 'Error';
        $message = 'Part Number and Revision Number Required';

        if ($part_number !== null && $revision_number !== null) 
        {
            $result = $TrialLedger->loadTrialNumber($part_number, $revision_number);

            $status = 'Error';
            $message = 'No Trial number';

            if (count($result) !== 0) 
            {
                $status = 'Success';
                $message = 'Trial Number Successfully load';
            }
        }
        
        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

    public function loadDetails(TrialLedger $TrialLedger,
                                Supplier $Supplier,
                                TrialChecksheet $TrialChecksheet,
                                Request $Request)
    {
        $part_number = $Request->part_number;
        $revision_number = $Request->revision_number;
        $trial_number = $Request->trial_number;

        $status = 'Error';
        $message = 'Required Fields';
        $result = [];

        if ($part_number != null || 
        $revision_number != null || 
        $trial_number != null) 
        {
            $data = 
            [
                'part_number'       => $part_number,
                'revision_number'   => $revision_number,
                'trial_number'      => $trial_number
            ];

            $trial_ledger_data  = json_decode(json_encode($TrialLedger->getTrialLedger($data)),true);
            $supplier_data      = json_decode(json_encode($Supplier->getSupplier($trial_ledger_data['supplier_code'])),true);

            $data_trial_ledger_merge = array_merge($trial_ledger_data, $supplier_data);

            $trial_checksheet_data  = json_decode(json_encode($TrialChecksheet->getTrialChecksheet($data)),true);

            if($trial_checksheet_data)
            {
                // if exist
                $trial_checksheet_data_merge = array_merge($data_trial_ledger_merge, $trial_checksheet_data);
            }
            else
            {
                // not exist
                $id = 
                [
                    'id' => null
                ];
                
                $trial_checksheet_data_merge = array_merge($data_trial_ledger_merge, $id);
            }

            $status = 'Error';
            $message = 'No Details';

            if ($trial_checksheet_data_merge) 
            {
                $status = 'Success';
                $message = 'Details Successfully Load';
            }

            $result = 
            [
                'trial_checksheets' => $trial_checksheet_data_merge,
            ];
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

   
    public function storeIgm(UploadController $Upload, 
                            ChecksheetItem $ChecksheetItem,
                            ChecksheetData $ChecksheetData, 
                            // TaktTime $TaktTime,
                            Request $Request)
    {
        $part_number = $Request->part_number;
        $revision_number = $Request->revision_number;
        $trial_checksheet_id = $Request->trial_checksheet_id;

        // $actual_time = $Request->actual_time;
        // $total_takt_time = $Request->total_takt_time;
        // $takt_time = $Request->takt_time;

        $status = 'Error';
        $message = 'Required Fields';
        $result = false;

        if($part_number !== null || 
        $revision_number !== null || 
        $trial_checksheet_id !== null)
        {
            // $filename = $part_number . '_' . $revision_number;
            // $filename =$part_number.'_'.$revision_number.'(00)';
            $filename = 'igm';
            
            // $path ='//10.51.10.39/Sharing/system igm/Guidance Manual/system igm/'; pabalik nalang sa dati hindi kase nagana sakin -george
            // $path ='F:\TIS\\';
            $path ='D:\\';
    
            $igm_files = scandir($path);
    
            //filtering of igm file
            for ($i=0; $i < count($igm_files); $i++) 
            { 
               if(strpos($igm_files[$i],$filename) !== false)
               {
                    $filtered_igm_files[] = $igm_files[$i];
               }
            }
    
            $status = 'Error';
            $message = 'No file exist';
            $result = false;
    
            if(!empty($filtered_igm_files))
            {
                DB::beginTransaction();

                try 
                {
                    $igm_file_name =  end($filtered_igm_files);
    
                    // $file = '\\\10.51.10.39\Sharing\system igm\Guidance Manual\system igm\\'.$igm_file_name; pabalik nalang sa dati hindi kase nagana sakin -george
                    $file = 'D:\\'.$igm_file_name;
        
                    // $file = '\\\10.164.30.10\mit\Personal\Terry -shared 166\TIS\TIS DATA\\'.'IGM.xlsx';
                    $sheet = 0;
                    $igm_data = [];
                    $checksheet_item = [];
                    $checksheet_datas = [];

                    if(file_exists($file))
                    {
                        $data = $Upload->upload($file, $sheet);
        
                        for($i=6; $i < count($data); $i++)
                        {  
                            $igm_data[] =
                            [
                                'item_number'       => $data[$i][26],//sub no
                                'type'              => $data[$i][28],//type
                                'specification'     => $data[$i][29],//nominal
                                'upper_limit'       => $data[$i][31],//ul
                                'lower_limit'       => $data[$i][32],//ll
                                'tools'             => $data[$i][37]//tools
                            ];
                        }
        
                        for($i=0; $i < count($igm_data); $i++)
                        {  
                            if($igm_data[$i]['item_number'] !== null && $igm_data[$i]['item_number'] !== 'Sub Seq')
                            {
                                $checksheet_item[] = 
                                [
                                    'trial_checksheet_id'   => $trial_checksheet_id,
                                    'item_number'           => intval($igm_data[$i]['item_number']),
                                    'tools'                 => $igm_data[$i]['tools'],
                                    'type'                  => $igm_data[$i]['type'],
                                    'specification'         => $igm_data[$i]['specification'],
                                    'upper_limit'           => $igm_data[$i]['upper_limit'],
                                    'lower_limit'           => $igm_data[$i]['lower_limit'],
                                    'judgment'              => 'N/A',
                                    'item_type'             => 1,
                                    'created_at'            => now(),
                                    'updated_at'            => now()
                                ];
                            }
                        }
        
                        $checksheet_item_data =  $ChecksheetItem->storeChecksheetItems($checksheet_item);
        
                        for($i=0; $i< count($checksheet_item_data);$i++)
                        {   
                            $checksheet_datas[] = 
                            [
                                'checksheet_item_id'    => $checksheet_item_data[$i],
                                'sub_number'            => 1,
                                'judgment'              => 'N/A',
                                'created_at'            => now(),
                                'updated_at'            => now()
                            ];
                        }

                        $ChecksheetData->storeChecksheetDatas($checksheet_datas);

                        // $start_date_time_data = $TaktTime->getStartDateTime($trial_checksheet_id);
            
                        // $takt_time_data = 
                        // [
                        //     'trial_checksheet_id'   => $trial_checksheet_id,
                        //     'start_date'            => $start_date_time_data['start_date'],
                        //     'start_time'            => $start_date_time_data['start_time'],
                        //     'end_time'              => date('H:i:s'),
                        //     'actual_time'           => $actual_time,
                        //     'total_takt_time'       => $total_takt_time,
                        //     'takt_time'             => $takt_time,
                        // ];

                        // $TaktTime->updateOrCreateTaktTime($takt_time_data);
        
                        $status = 'Success';
                        $message = 'Successfully Save';
                        $result = true;
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
        }

        return
        [
            'status'    => $status,
            'message'   => $message,
            'result'    => $result
        ];
    }

    public function loadIgm(ChecksheetItem $ChecksheetItem, ChecksheetData $ChecksheetData, Request $request)
    {
        $trial_checksheet_id = $request->trial_checksheet_id;

        $status = 'Error';
        $message = 'Not Successfully Load ';

        $checksheet_items = [];
        $checksheet_datas = [];

        if($trial_checksheet_id !== null)
        {
            $checksheet_items = $ChecksheetItem->getChecksheetItem($trial_checksheet_id);

            foreach ($checksheet_items as $checksheet_items_value) 
            {
                $checksheet_datas[] = $ChecksheetData->getChecksheetData($checksheet_items_value['id']);
            }

            $status = 'Success';
            $message = 'Successfully Load';
        }

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => 
            [
                'items' => $checksheet_items,
                'datas' => $checksheet_datas,
            ]
        ];
    }

    public function finishedChecksheet(TrialChecksheet $TrialChecksheet,
                                        Approval $Approval,
                                        Attachment $Attachment,
                                        TaktTime $TaktTime,
                                        Request $Request)
    {
        $file_names = ['numbering_drawing','material_certification','special_tool_data','others_1','others_2'];

        $request_keys = collect($Request->except('trial_checksheet_id',
                                                'date_inspected',
                                                'temperature',
                                                'humidity',
                                                'judgment',
                                                'part_number',
                                                'revision_number',
                                                'actual_time',
                                                'total_takt_time',
                                                'takt_time'))->keys();

        $trial_checksheet_id = $Request->trial_checksheet_id;
        $date_inspected = $Request->date_inspected;
        $temperature = $Request->temperature;
        $humidity = $Request->humidity;
        $judgment = $Request->judgment;
        $part_number = $Request->part_number;
        $revision_number = $Request->revision_number;

        $actual_time            = $Request->actual_time;
        $total_takt_time        = $Request->total_takt_time;
        $takt_time              = $Request->takt_time;

        $folder_name = date('Y-m-d') . '_' . $part_number . '_' . $revision_number;

        $status  = 'Error';
        $message = 'No File';
            
        $trial_checksheet_result = [];
        $approval_result = [];
        $attachment_result = [];
        $takt_time_result = [];

        if(count($request_keys) !== 0)
        {
            DB::beginTransaction();

            try 
            {
                for($i=0; $i < count($request_keys); $i++)
                {
                    if ($Request->file($file_names[$i]) !== null) 
                    {
                        $files[] = $file_names[$i] . '.' . $Request->file($file_names[$i])->getClientOriginalExtension();

                        $Request->file($file_names[$i])->storeAs($folder_name, $files[$i], 'public');
                    }
                }

                $trial_checksheet_data = 
                [
                    'date_finished'    => now(),
                    'judgment'         => $judgment,
                    'date_inspected'   => $date_inspected,
                    'temperature'      => $temperature,
                    'humidity'         => $humidity,
                ];

                $trial_checksheet_result = $TrialChecksheet->updateTrialChecksheet($trial_checksheet_id, $trial_checksheet_data);

                $approval_data =
                [
                    'trial_checksheet_id'      => $trial_checksheet_id,
                    // 'inspect_by'               => Session::get('fullname'), // session name
                    'inspect_by'               => 'JED RELATOR', // session name
                    'inspect_datetime'         => now(),
                    'decision'                 => 1
                ];

                $approval_result = $Approval->storeApproval($approval_data);

                $attachment_data =
                [
                    'trial_checksheet_id'   => $trial_checksheet_id,
                    'file_folder'           => $folder_name,
                    'file_name'             => implode(',',$files)
                ];

                $attachment_result = $Attachment->storeAttachments($attachment_data);

                $start_date_time = $TaktTime->getStartDateTime($trial_checksheet_id);

                $takt_time_data = 
                [
                    'trial_checksheet_id'   => $trial_checksheet_id,
                    'start_date'            => $start_date_time['start_date'],
                    'start_time'            => $start_date_time['start_time'],
                    'end_time'              => date('H:i:s'),
                    'actual_time'           => $actual_time,
                    'total_takt_time'       => $total_takt_time,
                    'takt_time'             => $takt_time,
                ];
        
                $takt_time_result =  $TaktTime->updateOrCreateTaktTime($takt_time_data);

                $status  = 'Success';
                $message = 'Successfully Saved';

                DB::commit();
            } 
            catch (\Throwable $th) 
            {
                $status = 'Error';
                $message = $th->getMessage();
                DB::rollback();
            }
        }

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'result'    => 
            [
                'trial_checksheet_result'   => $trial_checksheet_result,
                'approval_result'           => $approval_result,
                'attachment_result'         => $attachment_result,
                'takt_time_result'          => $takt_time_result
            ]    
        ];
    }

    public function updateJudgment(ChecksheetItem $ChecksheetItem, 
                                    ChecksheetData $ChecksheetData, 
                                    Request $request)
    {
        $id                  = $request->id;
        $sub_number          = $request->sub_number;

        $judgment_items      = $request->judgment_items;

        $coordinates         = $request->coordinates;
        $data                = $request->data;
        $judgment_datas      = $request->judgment_datas;

        $status  = 'Error';
        $message = 'No Data';

        if ($id !== null) 
        {
            DB::beginTransaction();

            try 
            {
                $items = 
                [
                    'judgment'              => $judgment_items
                ];

                $datas = 
                [
                    'coordinates' => $coordinates,
                    'data' => $data,
                    'judgment' => $judgment_datas,
                ];

                $checksheet_item_result = $ChecksheetItem->updateAutoJudgmentItem($id, $items);
                $checksheet_data_result = $ChecksheetData->updateAutoJudgmentData($id, $sub_number, $datas);

                $status  = 'Error';
                $message = 'Not Successfully Save';

                if ($checksheet_item_result && $checksheet_data_result)
                {
                    $status  = 'Success';
                    $message = 'Successfully Save';
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

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => 
            [
                'checksheet_item' => $checksheet_item_result,
                'checksheet_data' => $checksheet_data_result
            ]
        ];
    }  

    public function loadIgmNg(TrialChecksheet $TrialChecksheet, 
                                    ChecksheetData $ChecksheetData, 
                                    Request $request)
     {
        $part_number = $request->part_number;
        $trial_number = ($request->trial_number) - 1;

        if($trial_number <= 0)
        {
            //less than to 0 is not applicable
            $status  = 'Error';
            $message = 'Not less than to 1';
            $data = [];
        }
        else
        {
            $result_items = $TrialChecksheet->loadTrialCheckitemsNG($part_number, $trial_number);
           
            foreach($result_items as $checksheet_items) 
            {
                $data = $ChecksheetData->loadTrialCheckitemsNG($checksheet_items->id);
                $result_datas[] = $data[0];
            }

            $data = 
            [
                'items' => $result_items,
                'datas' => $result_datas
            ];

            $status  = 'Success';
            $message = 'Successfully Load';
        }

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'data'      => $data
            
        ];
    }
}