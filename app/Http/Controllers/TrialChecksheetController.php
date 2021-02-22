<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\MailController;
use App\TrialLedger;
use App\Supplier;
use App\TrialChecksheet;
use App\ChecksheetItem;
use App\ChecksheetData;
use App\Approval;
use App\Attachment;
use DB;
use App\Helpers\ActivityLog;
use App\LoginUser;
use Session;
use Illuminate\Support\Facades\Validator;
use App\Helpers\Unique;
class TrialChecksheetController extends Controller
{
    public function getForInspection(TrialLedger $TrialLedger, LoginUser $LoginUser, Unique $Unique)
    {
        $data = $TrialLedger->getForInspection();

        $result = [];
        $match_application_date = [];

        foreach ($data['ledger'] as $ledger_value) 
        {
            $application_date[] = $ledger_value->application_date;
            foreach ($data['checksheet'] as $checksheet_value) 
            {
                if ($checksheet_value->application_date === $ledger_value->application_date)
                {
                    $match_application_date[] =  $ledger_value->application_date;
                }
            }
        }

        if(count($match_application_date) !== 0)
        {
            for($x=0; $x<count($match_application_date);$x++)
            {
                $key = array_search($match_application_date[$x], $application_date); 
                unset($data['ledger'][$key]); 
            }
        }
            
        foreach ($data['ledger'] as $ledger_value) 
        { 
            $fullname = $LoginUser->getFullName($ledger_value->inspector_id);

            $result[] = 
            [
                'application_date' => $ledger_value->application_date,
                'part_number' => $ledger_value->part_number,
                'inspection_reason' => $ledger_value->inspection_reason,
                'revision_number' => $ledger_value->revision_number,
                'trial_number' => $ledger_value->trial_number,
                'part_name' => $ledger_value->part_name,
                'supplier_code' => $ledger_value->supplier_code,
                'inspector_id' => $fullname['fullname'],
                'supplier_name' => $ledger_value->supplier_name
            ];
        }

        $result = $Unique->unique_multidim_array($result,'application_date');

        $status = 'Error';
        $message = 'No for inspection';

        if (count($result) !== 0) 
        {
            $status = 'Success';
            $message = 'For inspection';
        }
        
        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

    public function getDisapprovedInspection(TrialLedger $TrialLedger, LoginUser $LoginUser)
    {
        $data = $TrialLedger->getDisapprovedInspection(5);

        foreach ($data as $key => $value) 
        {
            $inspector = $LoginUser->getFullName($value->inspect_by);
            $disapproved_by = $LoginUser->getFullName($value->disapproved_by);


            $data[$key]['inspector_id'] = $inspector['fullname'];
            $data[$key]['disapproved_by'] = $disapproved_by['fullname'];
        }

        $status = 'Error';
        $message = 'No Disapproved inspection';

        if (count($data) !== 0) 
        {
            $status = 'Success';
            $message = 'Disapproved inspection';
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $data
        ];
    }

    public function loadDetails(TrialLedger $TrialLedger,
                                Supplier $Supplier,
                                TrialChecksheet $TrialChecksheet,
                                Request $Request)
    {
        $application_date = $Request->application_date;

        $in_use_data = $TrialChecksheet->getInUse($application_date);

        $in_use = '';

        if (!empty($in_use_data)) 
        {
            $in_use = $in_use_data['in_use'];
        }

        $status = 'Error';
        $message = 'Required Fields';
        $result = [];
        $data_trial_ledger_merge = [];
        $trial_checksheet_data_merge = [];

        if ($in_use === 0 || $in_use === '') 
        {
            if ($application_date !== null) 
            {
                $trial_ledger_data  = json_decode(json_encode($TrialLedger->getTrialLedger($application_date)),true);
                $supplier_data      = json_decode(json_encode($Supplier->getSupplier($trial_ledger_data['supplier_code'])),true);

                if ($supplier_data) 
                {
                    $data_trial_ledger_merge = array_merge($trial_ledger_data, $supplier_data);
                }

                $trial_checksheet_data  = json_decode(json_encode($TrialChecksheet->getTrialChecksheet($application_date)),true);

                if($trial_checksheet_data)
                {
                    // if exist
                    if ($data_trial_ledger_merge) 
                    {
                        $trial_checksheet_data_merge = array_merge($data_trial_ledger_merge, $trial_checksheet_data);
                    }

                    $logs = 'The Data Exist in TrialChecksheet';
                }
                else
                {
                    // not exist
                    $id = 
                    [
                        'id' => null
                    ];

                    if ($data_trial_ledger_merge) 
                    {
                        $trial_checksheet_data_merge = array_merge($data_trial_ledger_merge, $id);
                    }

                    $logs = 'The Data Not Exist in TrialChecksheet';
                }

                $status = 'Error';
                $message = 'Please Upload Supplier or No Supplier code';

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
        }
        else 
        {
            $logs = 'On-going inspection';
            $status = 'Attention';
            $message = 'This Part Number is On-going inspection';
        }
        

        ActivityLog::activityLog($message . ' - ' . $logs, Session::get('name'));

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
                            Request $Request)
    {
        $part_number = $Request->part_number;
        $revision_number = $Request->revision_number;
        $trial_checksheet_id = $Request->trial_checksheet_id;

        $status = 'Error';
        $message = 'Required Fields';
        $result = false;

        if($part_number !== null || 
        $revision_number !== null || 
        $trial_checksheet_id !== null)
        {
            DB::beginTransaction();

            try 
            {
                // $filename = $part_number . '_' . $revision_number;
                // $filename =$part_number.'_'.$revision_number.'(00)';
                $filename = 'igm';
                
                // $path ='//10.51.10.39/Sharing/system igm/Guidance Manual/system igm/'; //pabalik nalang sa dati hindi kase nagana sakin -george
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
                    $igm_file_name =  end($filtered_igm_files);
    
                    // $file = '\\\10.51.10.39\Sharing\system igm\Guidance Manual\system igm\\'.$igm_file_name; //pabalik nalang sa dati hindi kase nagana sakin -george
                    $file = 'D:\\'.$igm_file_name;
                    // $file = 'F:\TIS\\'.$igm_file_name;
        
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
                                switch ($igm_data[$i]['tools']) 
                                {
                                    case 'Caliper':
                                        $tools = 'DC';
                                        break;
                                    case 'Height Gauge':
                                        $tools = 'HG';
                                        break;
                                    case 'Dial Test Indicator':
                                        $tools = 'DI';
                                        break;
                                    case 'Protractor':
                                        $tools = 'PR';
                                        break;
                                    case 'Plug Guage':
                                        $tools = 'PLG';
                                        break;
                                    case 'Pin Gauge':
                                        $tools = 'PG';
                                        break;
                                    case 'Dial Gauge':
                                        $tools = 'DG';
                                        break;
                                    case 'Visual Inspection':
                                        $tools = 'VSL';
                                        break;
                                    case 'Micrometer':
                                        $tools = 'DM';
                                        break;
                                    case 'Projector':
                                        $tools = 'PJ';
                                        break;   
                                    case 'Multimeter':
                                        $tools = 'MM';
                                        break;
                                    case 'Torque Meter':
                                        $tools = 'TM';
                                        break;
                                    case 'Screw Torque Meter':
                                        $tools = 'ST';
                                        break;
                                    case 'CMM':
                                        $tools = 'CMM';
                                        break;
                                    case 'Gear Test':
                                        $tools = 'GT';
                                        break;
                                    case 'Microscope':
                                        $tools = 'MP';
                                        break;
                                    case 'Laser Scan':
                                        $tools = 'LS';
                                        break;
                                    case 'R Gauge':
                                        $tools = 'RG';
                                        break;
                                    case 'Bore Gauge':
                                        $tools = 'BG';
                                        break;
                                    case 'Depth Gauge':
                                        $tools = 'DPG';
                                        break;
                                    default:
                                        $tools = $igm_data[$i]['tools'];
                                        break;
                                }

                                $checksheet_item[] = 
                                [
                                    'trial_checksheet_id'   => $trial_checksheet_id,
                                    'item_number'           => intval($igm_data[$i]['item_number']),
                                    'tools'                 => $tools,
                                    'type'                  => $igm_data[$i]['type'],
                                    'specification'         => $igm_data[$i]['specification'],
                                    'upper_limit'           => $igm_data[$i]['upper_limit'],
                                    'lower_limit'           => $igm_data[$i]['lower_limit'],
                                    'remarks'               => '',
                                    'judgment'              => 'N/A',
                                    'hinsei'                => '',
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
                                'remarks'               => '',
                                'type'                  => $checksheet_item[$i]['type'],
                                'created_at'            => now(),
                                'updated_at'            => now()
                            ];
                        }

                        $ChecksheetData->storeChecksheetDatas($checksheet_datas);
        
                        $status = 'Success';
                        $message = 'IGM has been loaded';
                        $result = true;
                    }
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

        ActivityLog::activityLog($message . ' - Id : ' . $trial_checksheet_id . ' - Part Number : ' . $part_number . ' - Revision Number : ' . $revision_number, Session::get('name'));

        return
        [
            'status'    => $status,
            'message'   => $message,
            'result'    => $result
        ];
    }

    public function loadIgm(TrialChecksheet $TrialChecksheet, ChecksheetItem $ChecksheetItem, ChecksheetData $ChecksheetData, Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $part_number = $Request->part_number;
        $inspection_reason = $Request->inspection_reason;
        $trial_number = $Request->trial_number;
        $trial_rm_4m = $Request->trial_rm_4m;

        $status = 'Error';
        $message = 'Not Successfully Load ';

        $checksheet_items = [];
        $checksheet_datas = [];
        $checksheet_data = [];

        if($trial_checksheet_id !== null)
        {
            $checksheet_items = $ChecksheetItem->getChecksheetItem($trial_checksheet_id);

            foreach ($checksheet_items as $checksheet_items_value) 
            {
                $checksheet_datas[] = $ChecksheetData->getChecksheetData($checksheet_items_value['id']);
            }

            $checksheet_ids  = $TrialChecksheet->getChecksheet($part_number, $inspection_reason);

            foreach ($checksheet_ids as $checksheet_ids_value) 
            {
                $trial_checksheet_ids[] = $checksheet_ids_value['id'];
            }

            $checksheet_item_count = $ChecksheetItem->getItem($trial_checksheet_ids);

            if ($trial_number == 1 || $trial_rm_4m == 1)
            {
                foreach ($checksheet_item_count as  $checksheet_item_count_value) 
                {
                    $checksheet_data[] = $ChecksheetData->getdata($checksheet_item_count_value['min']);
                }
            }

            if ($trial_number >= 2 || $trial_rm_4m >= 2)
            {
                $checksheet_item_ng_count = $ChecksheetItem->getNgItem($trial_checksheet_ids);

                foreach ($checksheet_item_ng_count as  $checksheet_item_ng_count_value) 
                {
                    $checksheet_data[] = $ChecksheetData->getdata($checksheet_item_ng_count_value['min']);
                }
            }

            for ($i=0; $i < count($checksheet_data); $i++) 
            { 
                $checksheet_items[$i]['count'] = count($checksheet_data[$i]);
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
                'count' => count($checksheet_item_count),
            ]
        ];
    }

    public function finishedChecksheet(TrialChecksheet $TrialChecksheet,
                                        Approval $Approval,
                                        Attachment $Attachment,
                                        MailController $MailController,
                                        Request $Request)
    {
        $file_names = ['numbering_drawing','material_certification','special_tool_data','others_1','others_2'];

        $trial_checksheet_id    = $Request->trial_checksheet_id;
        $temperature            = $Request->temperature;
        $humidity               = $Request->humidity;
        $judgment               = $Request->judgment;
        $part_number            = $Request->part_number;
        $revision_number        = $Request->revision_number;
        $trial_number           = $Request->trial_number;

        $folder_name    = $part_number . '-' . $revision_number . '-T' . $trial_number . '-' . date('Ymd');//pinadagdag ni jed - george

        $status         = 'Error';
        $message        = 'No File';
            
        $trial_checksheet_result    = [];
        $approval_result            = [];
        $attachment_result          = [];

        if(count($Request->file()) !== 0)
        {
            DB::beginTransaction();

            try 
            {
                for($i=0; $i < count($Request->file()); $i++)
                {
                    if ($Request->file($file_names[$i]) !== '') 
                    {
                        $files[] = $file_names[$i] . '.' . $Request->file($file_names[$i])->getClientOriginalExtension();

                        $Request->file($file_names[$i])->storeAs($folder_name, $files[$i], 'public');
                    }
                }

                $trial_checksheet_data = 
                [
                    'date_finished'    => now(),
                    'judgment'         => $judgment,
                    'temperature'      => $temperature,
                    'humidity'         => $humidity,
                ];

                $trial_checksheet_result = $TrialChecksheet->updateTrialChecksheet($trial_checksheet_id, $trial_checksheet_data);

                $approval_data =
                [
                    'trial_checksheet_id'      => $trial_checksheet_id,
                    'decision'                 => 1,
                    'inspect_by'               => Session::get('name'),
                ];

                $approval_result = $Approval->approved($trial_checksheet_id, $approval_data);

                $attachment_data =
                [
                    'trial_checksheet_id'   => $trial_checksheet_id,
                    'file_folder'           => $folder_name,
                    'file_name'             => implode(',',$files)
                ];

                $attachment_result = $Attachment->storeFileMerge($trial_checksheet_id, $attachment_data);

                $whereSend = $Approval->getApproval($trial_checksheet_id);

                if ($whereSend['disapproved_by'] === null && $whereSend['evaluated_by'] === null) 
                    $MailController->sendEmail($trial_checksheet_id, 'for_evaluation');
                else if ($whereSend['disapproved_by'] !== null && $whereSend['evaluated_by'] !== null)
                    $MailController->sendEmail($trial_checksheet_id, 're_evaluation');
                
                $status  = 'Success';
                $message = 'The inspection is done';

                DB::commit();
            } 
            catch (\Throwable $th) 
            {
                $status = 'Error';
                $message = $th->getMessage();
                DB::rollback();
            }
        }

        ActivityLog::activityLog($message, Session::get('name'));

        return 
        [
            'status'    => $status,
            'message'   => $message,
            'result'    => 
            [
                'trial_checksheet_result'   => $trial_checksheet_result,
                'approval_result'           => $approval_result,
                'attachment_result'         => $attachment_result,
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

                $status  = 'Success';
                $message = 'The data has been updated';

                DB::commit();
            } 
            catch (\Throwable $th) 
            {
                $status = 'Error';
                $message = $th->getMessage();
                DB::rollback();
            }
        }
        
        ActivityLog::activityLog($message . ' - Sub Number - ' . $sub_number . ' Coordinates - ' . $coordinates . ' - Data ' . $data . ' - Judgment Data - ' . $judgment_datas . ' / Judgment Items - ' . $judgment_items, Session::get('name'));

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