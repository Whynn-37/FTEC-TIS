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
use App\TaktTime;
use App\Approval;
use App\Attachment;
use App\History;
use App\LoginUser;
use Session;
use DB;
class TrialChecksheetController extends Controller
{
    public function unique_multidim_array($array, $key) { 
        $temp_array = array(); 
        $i = 0; 
        $key_array = array(); 
        
        foreach($array as $val) { 
            if (!in_array($val[$key], $key_array)) { 
                $key_array[$i] = $val[$key]; 
                $temp_array[] = $val; 
            } 
            $i++; 
        } 

        return $temp_array; 
    }

    public function loadPartnumber(TrialLedger $TrialLedger)
    {
        $data = $TrialLedger->loadPartnumber();

        if (count($data['checksheet']) !== 0) 
        {
            foreach ($data['ledger'] as $ledger_value) 
            {
                $application_date[] = $ledger_value->application_date;
                foreach ($data['checksheet'] as $checksheet_value) 
                {
                    if ($checksheet_value->application_date === $ledger_value->application_date)
                    {
                        $match_application_date[] =  $ledger_value->application_date;
                        $result = [];
                    }
                    else 
                    {
                        $result[] = 
                        [
                            'part_number' => $ledger_value->part_number
                        ];
                        $match_application_date = false;
                    }
                }
            }

            if($match_application_date !== false)
            {
                for($x=0; $x<count($match_application_date);$x++)
                {
                    $key = array_search($match_application_date[$x], $application_date); 
                    unset($data['ledger'][$key]); 
                }

                foreach ($data['ledger'] as $ledger_value) 
                { 
                    $result[] = 
                    [
                        'part_number' => $ledger_value->part_number
                    ];
                }
            }
        }
        else 
        {
            foreach ($data['ledger'] as $ledger_value) 
            {
                $result[] = [
                    'part_number' => $ledger_value->part_number
                ];
            }
        }

        $result = $this->unique_multidim_array($result,'part_number');

        $status = 'Error';
        $message = 'No Part Number';

        if (count($result) !== 0) 
        {
            $status = 'Success';
            $message = 'Part Number Successfully Load';
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

    public function loadInspectionReason(TrialLedger $TrialLedger, Request $Request)
    {
        $part_number = $Request->part_number;

        $status = 'Error';
        $message = 'Inspection Reason Required';

        if ($part_number !== null) 
        {
            $data = $TrialLedger->loadInspectionReason($part_number);

            if (count($data['checksheet']) !== 0) 
            {
                foreach ($data['ledger'] as $ledger_value) 
                {
                    $application_date[] = $ledger_value->application_date;
                    foreach ($data['checksheet'] as $checksheet_value) 
                    {
                        if ($checksheet_value->application_date === $ledger_value->application_date)
                        {
                            $match_application_date[] =  $ledger_value->application_date;
                            $result = [];
                        }
                        else
                        {
                            $result[] = 
                            [
                                'inspection_reason' => $ledger_value->inspection_reason
                            ];
                            $match_application_date = false;
                        }
                    }
                }
                
                if($match_application_date !== false)
                {
                    for($x=0; $x<count($match_application_date);$x++)
                    {
                        $key = array_search($match_application_date[$x], $application_date); 
                        unset($data['ledger'][$key]); 
                    }

                    foreach ($data['ledger'] as $ledger_value) 
                    { 
                        $result[] = 
                        [
                            'inspection_reason' => $ledger_value->inspection_reason
                        ];
                    }
                }
            }
            else 
            {
                foreach ($data['ledger'] as $ledger_value) 
                {
                    $result[] = [
                        'inspection_reason' => $ledger_value->inspection_reason
                    ];
                }
            }

            $result = $this->unique_multidim_array($result,'inspection_reason');

            $status = 'Error';
            $message = 'No Inspection Reason';

            if (count($result) !== 0) 
            {
                $status = 'Success';
                $message = 'Inspection Reason Successfully load';
            }
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

    public function loadRevision(TrialLedger $TrialLedger, Request $Request)
    {
        $part_number = $Request->part_number;
        $inspection_reason = $Request->inspection_reason;

        $status = 'Error';
        $message = 'Part Number Required';
        $data = [];

        if ($part_number !== null && $inspection_reason !== null) 
        {
            $data = $TrialLedger->loadRevision($part_number, $inspection_reason);

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
        $inspection_reason = $Request->inspection_reason;
        $revision_number = $Request->revision_number;

        $status = 'Error';
        $message = 'Part Number and Revision Number Required';

        if ($part_number !== null && $inspection_reason !== null && $revision_number !== null) 
        {
            $result = $TrialLedger->loadTrialNumber($part_number, $inspection_reason, $revision_number);

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

    public function loadApplicationDate(TrialLedger $TrialLedger, Request $Request)
    {
        $part_number = $Request->part_number;
        $inspection_reason = $Request->inspection_reason;
        $revision_number = $Request->revision_number;
        $trial_number = $Request->trial_number;

        $status = 'Error';
        $message = 'No Application Date';

        if ($part_number !== null && $inspection_reason !== null && $revision_number !== null && $trial_number !== null) 
        {
            $result = $TrialLedger->loadApplicationDate($part_number, $inspection_reason, $revision_number, $trial_number);

            $status = 'Error';
            $message = 'No Application Date';

            if ($result) 
            {
                $status = 'Success';
                $message = 'Application Date Successfully load';
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
        $inspection_reason = $Request->inspection_reason;
        $revision_number = $Request->revision_number;
        $trial_number = $Request->trial_number;

        $application_date = $Request->application_date;

        $status = 'Error';
        $message = 'Required Fields';
        $result = [];

        if ($application_date !== null) 
        {
            $data = 
            [
                'part_number'       => $part_number,
                'inspection_reason' => $inspection_reason,
                'revision_number'   => $revision_number,
                'trial_number'      => $trial_number
            ];

            $trial_ledger_data  = json_decode(json_encode($TrialLedger->getTrialLedger($application_date)),true);
            $supplier_data      = json_decode(json_encode($Supplier->getSupplier($trial_ledger_data['supplier_code'])),true);

            $data_trial_ledger_merge = array_merge($trial_ledger_data, $supplier_data);

            $trial_checksheet_data  = json_decode(json_encode($TrialChecksheet->getTrialChecksheet($application_date)),true);

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
            // $filename = $part_number . '_' . $revision_number;
            // $filename =$part_number.'_'.$revision_number.'(00)';
            $filename = 'igm';
            
            // $path ='//10.51.10.39/Sharing/system igm/Guidance Manual/system igm/'; pabalik nalang sa dati hindi kase nagana sakin -george
            $path ='F:\TIS\\';
            // $path ='D:\\';
    
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
                    // $file = 'D:\\'.$igm_file_name;
                    $file = 'F:\TIS\\'.$igm_file_name;
        
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
                                        MailController $MailController,
                                        Request $Request)
    {
        $file_names = ['numbering_drawing','material_certification','special_tool_data','others_1','others_2'];

        $trial_checksheet_id = $Request->trial_checksheet_id;
        $temperature = $Request->temperature;
        $humidity = $Request->humidity;
        $judgment = $Request->judgment;
        $part_number = $Request->part_number;
        $revision_number = $Request->revision_number;

        $folder_name = $part_number . '-' . $revision_number . '-' . date('Ymd');

        $status  = 'Error';
        $message = 'No File';
            
        $trial_checksheet_result = [];
        $approval_result = [];
        $attachment_result = [];

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
                    'inspect_by'               => Session::get('fullname'), // session name
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

                $MailController->sendEmail($trial_checksheet_id, 'after_inspection');

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
                $message = 'Successfully Save';

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

    public function loadPartNumberColumn (TrialLedger $TrialLedger, LoginUser $LoginUser, Request $request)
    {
        $report_status = $request->report_status;
        $merge = [];

        $inspector ='';
        $evaluator ='';
        $approver ='';
        if($report_status == null)
        {
            $status = 'Error';
            $message = 'No part number/status';
            $status_result = [];
        }
        else
        {
            if($report_status == 'For Inspection')  
            {
                $inspector = '';
                $status_result = $TrialLedger->forInspection();
                foreach ($status_result as $status_result_value) 
                {
                    $full_name[] = $LoginUser->selectUser(['name' => $status_result_value['inspector_id']]);
                    $full_name = array_unique($full_name);

                    if ($status_result_value['inspector_id'] == null || $status_result_value['inspector_id'] == '') 
                    {
                        $merge[] = 
                        [
                            'trial_checksheet_id'   => $status_result_value['id'],
                            'part_number'           => $status_result_value['part_number'],
                            'part_name'             => $status_result_value['part_name'],
                            'supplier_name'         => $status_result_value['supplier_name'],
                            'revision_number'       => $status_result_value['revision_number'],
                            'trial_number'          => $status_result_value['trial_number'],
                            'judgment'              => "-",
                            'inspector'             => $inspector,
                            'inspect_datetime'      => "-",
                            'evaluated_by'          => "-",
                            'evaluated_datetime'    => "-",
                            'approved_by'           => "-",
                            'approved_datetime'     => "-",
                            'merge_pdf'             => "-",
                         
                        ];
                    }

                    foreach ($full_name as $full_name_value) 
                    {
                        if ($status_result_value['inspector_id'] === $full_name_value['name']) 
                        {
                            $merge[] = 
                            [
                                'trial_checksheet_id'   => $status_result_value['id'],
                                'part_number'       => $status_result_value['part_number'],
                                'part_name'         => $status_result_value['part_name'],
                                'supplier_name'     => $status_result_value['supplier_name'],
                                'revision_number'   => $status_result_value['revision_number'],
                                'trial_number'      => $status_result_value['trial_number'],
                                'judgment'             => "-",
                                'inspector'         => $full_name_value['fullname'],
                                'inspect_datetime'      => "-",
                                'evaluated_by'          => "-",
                                'evaluated_datetime'    => "-",
                                'approved_by'           => "-",
                                'approved_datetime'     => "-",
                                'merge_pdf'             => "-",
                            ];
                        }
                        return $merge;
                    }
                }
            }
            else if($report_status == 'For Evaluation')
            {
                $column = 
                [
                    'decision'    =>  1,
                ];

                $status_result = $TrialLedger->loadPartnumberHistory($column);
                foreach ($status_result as $status_result_value) 
                {
                    $inspect[] = $LoginUser->selectUser(['name' => $status_result_value['inspect_by']]);
                    $evaluated[] = $LoginUser->selectUser(['name' => $status_result_value['evaluated_by']]);

                    $inspect = array_unique($inspect);
                    $evaluated = array_unique($evaluated);

                    foreach ($inspect as $inspect_value) 
                    {
                        if ($status_result_value['inspect_by'] === $inspect_value['name']) 
                        {
                            $inspector = $inspect_value['fullname'];
                        }
                    }

                    foreach ($evaluated as $evaluated_value) 
                    {
                        if ($status_result_value['evaluated_by'] === $evaluated_value['name']) 
                        {
                            $evaluator = $evaluated_value['fullname'];
                        }
                    }

                    $merge[] = 
                    [
                        'trial_checksheet_id'   => $status_result_value['id'],
                        'part_number'           => $status_result_value['part_number'],
                        'part_name'             => $status_result_value['part_name'],
                        'supplier_name'         => $status_result_value['supplier_name'],
                        'revision_number'       => $status_result_value['revision_number'],
                        'trial_number'          => $status_result_value['trial_number'],
                        'judgment'              => $status_result_value['judgment'],
                        'inspector'             => $inspector,
                        'inspect_datetime'      => $status_result_value['inspect_datetime'],
                        'evaluated_by'          => $evaluator,
                        'evaluated_datetime'    => $status_result_value['evaluated_datetime'],
                        'approved_by'           => "-",
                        'approved_datetime'     => "-",
                        'merge_pdf'             => "-",
                    ];
                }
            }
            else if($report_status == 'For Approval')
            {
                $column = 
                [
                    'decision'    =>  2,
                ];
              
                $status_result = $TrialLedger->loadPartnumberHistory($column);
                foreach ($status_result as $status_result_value) 
                {
                    $inspect[] = $LoginUser->selectUser(['name' => $status_result_value['inspect_by']]);
                    $evaluated[] = $LoginUser->selectUser(['name' => $status_result_value['evaluated_by']]);
                    $approved[] = $LoginUser->selectUser(['name' => $status_result_value['approved_by']]);

                    $inspect = array_unique($inspect);
                    $evaluated = array_unique($evaluated);
                    $approved = array_unique($approved);
      
                    foreach ($inspect as $inspect_value) 
                    {
                        if ($status_result_value['inspect_by'] === $inspect_value['name']) 
                        {
                            $inspector = $inspect_value['fullname'];
                        }
                    }

                    foreach ($evaluated as $evaluated_value) 
                    {
                        if ($status_result_value['evaluated_by'] === $evaluated_value['name']) 
                        {
                            $evaluator = $evaluated_value['fullname'];
                        }
                    }

                    foreach ($approved as $approved_value) 
                    {
                        if ($status_result_value['approved_by'] === $approved_value['name']) 
                        {
                            $approver = $approved_value['fullname'];
                        }
                    }

                    $merge[] = 
                    [
                        'trial_checksheet_id'   => $status_result_value['id'],
                        'part_number'           => $status_result_value['part_number'],
                        'part_name'             => $status_result_value['part_name'],
                        'supplier_name'         => $status_result_value['supplier_name'],
                        'revision_number'       => $status_result_value['revision_number'],
                        'trial_number'          => $status_result_value['trial_number'],
                        'judgment'              => $status_result_value['judgment'],
                        'inspector'             => $inspector,
                        'inspect_datetime'      => $status_result_value['inspect_datetime'],
                        'evaluated_by'          => $evaluator,
                        'evaluated_datetime'    => $status_result_value['evaluated_datetime'],
                        'approved_by'           => $approver,
                        'approved_datetime'     => $status_result_value['approved_datetime'],
                        'merge_pdf'             => "-",
                    ];
                }
            }
            else if($report_status == 'Approved')
            {
                $column = 
                [
                    'decision'    =>  0,
                ];

                $status_result = $TrialLedger->loadPartnumberHistory($column);
                foreach ($status_result as $status_result_value) 
                {
                    $inspect[] = $LoginUser->selectUser(['name' => $status_result_value['inspect_by']]);
                    $evaluated[] = $LoginUser->selectUser(['name' => $status_result_value['evaluated_by']]);
                    $approved[] = $LoginUser->selectUser(['name' => $status_result_value['approved_by']]);

                    $inspect = array_unique($inspect);
                    $evaluated = array_unique($evaluated);
                    $approved = array_unique($approved);

                    foreach ($inspect as $inspect_value) 
                    {
                        if ($status_result_value['inspect_by'] === $inspect_value['name']) 
                        {
                            $inspector = $inspect_value['fullname'];
                        }
                    }

                    foreach ($evaluated as $evaluated_value) 
                    {
                        if ($status_result_value['evaluated_by'] === $evaluated_value['name']) 
                        {
                            $evaluator = $evaluated_value['fullname'];
                        }
                    }

                    foreach ($approved as $approved_value) 
                    {
                        if ($status_result_value['approved_by'] === $approved_value['name']) 
                        {
                            $approver = $approved_value['fullname'];
                        }
                    }

                $merge[] = 
                    [
                        'trial_checksheet_id'   => $status_result_value['id'],
                        'part_number'           => $status_result_value['part_number'],
                        'part_name'             => $status_result_value['part_name'],
                        'supplier_name'         => $status_result_value['supplier_name'],
                        'revision_number'       => $status_result_value['revision_number'],
                        'trial_number'          => $status_result_value['trial_number'],
                        'judgment'              => $status_result_value['judgment'],
                        'inspector'             => $inspector,
                        'inspect_datetime'      => $status_result_value['inspect_datetime'],
                        'evaluated_by'          => $evaluator,
                        'evaluated_datetime'    => $status_result_value['evaluated_datetime'],
                        'approved_by'           => $approver,
                        'approved_datetime'     => $status_result_value['approved_datetime'],
                        'merge_pdf'             => storage_path('app/public/'.$status_result_value['file_folder'].'/'.$status_result_value['file_folder'].".pdf" ),
                    ];
                }
            }
            else if($report_status == 'Disapproved')
            {
                $column = 
                [
                    'decision'    =>  3,
                ];

                $status_result = $TrialLedger->loadPartnumberHistory($column);
                foreach ($status_result as $status_result_value) 
                {
                    $inspect[] = $LoginUser->selectUser(['name' => $status_result_value['inspect_by']]);
                    $evaluated[] = $LoginUser->selectUser(['name' => $status_result_value['evaluated_by']]);
                    $disapproved[] = $LoginUser->selectUser(['name' => $status_result_value['disapproved_by']]);

                    $inspect = array_unique($inspect);
                    $evaluated = array_unique($evaluated);
                    $disapproved = array_unique($disapproved);

                    foreach ($inspect as $inspect_value) 
                    {
                        if ($status_result_value['inspect_by'] === $inspect_value['name']) 
                        {
                            $inspector = $inspect_value['fullname'];
                        }
                    }

                    foreach ($evaluated as $evaluated_value) 
                    {
                        if ($status_result_value['evaluated_by'] === $evaluated_value['name']) 
                        {
                            $evaluator = $evaluated_value['fullname'];
                        }
                    }

                    foreach ($disapproved as $disapproved_value) 
                    {
                        if ($status_result_value['disapproved_by'] === $disapproved_value['name']) 
                        {
                            $approver = $disapproved_value['fullname'];
                        }
                    }

                    $merge[] = 
                    [
                        'trial_checksheet_id'   => $status_result_value['id'],
                        'part_number'           => $status_result_value['part_number'],
                        'part_name'             => $status_result_value['part_name'],
                        'supplier_name'         => $status_result_value['supplier_name'],
                        'revision_number'       => $status_result_value['revision_number'],
                        'trial_number'          => $status_result_value['trial_number'],
                        'judgment'              => $status_result_value['judgment'],
                        'inspector'             => $inspector,
                        'inspect_datetime'      => $status_result_value['inspect_datetime'],
                        'evaluated_by'          => $evaluator,
                        'evaluated_datetime'    => $status_result_value['evaluated_datetime'],
                        'disapproved_by'        => $approver,
                        'disapproved_datetime'  => $status_result_value['disapproved_datetime'],
                        'merge_pdf'             => storage_path('app/public/'.$status_result_value['file_folder'].'/'.$status_result_value['file_folder'].".pdf" ),
                    ];
                }
            }

            $status = 'Success';
            $message = 'Successfully Loaded';
        }
        //return $report_status;
        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $merge,
        ];
    }

    public function loadDetailsHistory(TrialChecksheet $TrialChecksheet, LoginUser $LoginUser, TrialLedger $TrialLedger, Request $Request)
    {
        $status = $Request->status;

        // if($status == 'For Inspection')
        // {
        //     $get_part_number = 
        //     [
        //         'trial_ledgers.part_number'    =>  $part_number,
        //     ];
        // }
        // else if($status == 'For Evaluation')
        // {
        //     $get_part_number = 
        //     [
        //         'trial_ledgers.part_number'    =>  $part_number,
        //     ];
        // }
        // else if($status == 'For Approval')
        // {
        //     $get_part_number = 
        //     [
        //         'trial_ledgers.part_number'    =>  $part_number,
        //     ];
        // }
        // else if($status == 'Approved')
        // {
        //     $get_part_number = 
        //     [
        //         'trial_ledgers.part_number'    =>  $part_number,
        //     ];
        // }
        // else if($status == 'Disapproved')
        // {
        //     $get_part_number = 
        //     [
        //         'trial_ledgers.part_number'    =>  $part_number,
        //     ];
        // }

        // return $load_detail_history = $TrialChecksheet->getAllData($get_part_number);
    }
}