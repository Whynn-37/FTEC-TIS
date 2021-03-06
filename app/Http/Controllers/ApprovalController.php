<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Approval;
use App\Attachment;
use App\ChecksheetItem;
use App\TrialChecksheet;
use App\ChecksheetData;
use App\TaktTime;
use App\DownTime;
use App\Supplier;
use App\Exports\TrialEvaluationResultExport;
use App\Http\Controllers\MailController;
use Session;
use DB;
use Excel;
use App\Helpers\ActivityLog;
use App\LoginUser;
use App\Helpers\Unique;

class ApprovalController extends Controller
{
    public function loadInspectionData(ChecksheetData $ChecksheetData, 
                                        ChecksheetItem $ChecksheetItem,
                                        TrialChecksheet $TrialChecksheet, 
                                        Attachment $Attachment,
                                        TaktTime $TaktTime,
                                        DownTime $DownTime,
                                        LoginUser $LoginUser,
                                        Request $Request)
    {
        $trial_checksheet_id = $Request->id;

        $status = 'Error';
        $message = 'No Trial Checksheet ID';

        $checksheet_details = [];
        $checksheet_items = [];
        $checksheet_data = [];
        $attachment_data = [];
        $takt_time_data = [];
        $down_time_data = [];
        $data_takt_sum = [];
        $data_down_sum = [];
 
        if ($trial_checksheet_id !== null) 
        {
            $checksheet_details = $TrialChecksheet->getChecksheetDetails($trial_checksheet_id);
            $inspect_by = $LoginUser->getFullName($checksheet_details['inspect_by']);
            $checksheet_details['inspect_by'] = $inspect_by['fullname'];

            $checksheet_items = $ChecksheetItem->getChecksheetItem($trial_checksheet_id);
            
            foreach($checksheet_items as $checksheet_items_value) 
            {
                $checksheet_data[] = $ChecksheetData->getChecksheetData($checksheet_items_value->id);
            }

            $attachment = $Attachment->getAttachment($trial_checksheet_id);

            $explode_attachment = explode(',', $attachment['file_name']);

            $attachment_data = [
                'file_folder' => $attachment['file_folder'],
                'file_name' => $explode_attachment,
                'file_name_merge' => $attachment['file_name_merge']
            ];

            $takt_time_data = $TaktTime->getTotalTaktTime($trial_checksheet_id);

            foreach ($takt_time_data as $total_takt_time_value) 
            {
                $data_takt_sum[] = $total_takt_time_value['total_takt_time'];
            }

            $takt_time_data = round(array_sum($data_takt_sum), 2);

            $down_time_data = $DownTime->getTotalDownTime($trial_checksheet_id);

            foreach ($down_time_data as $total_down_time_value) 
            {
                $data_down_sum[] = $total_down_time_value['total_down_time'];
            }

            $down_time_data = round(array_sum($data_down_sum), 2);

            $actual_time_data = $TaktTime->getActual($trial_checksheet_id);

            $status = 'Error';
            $message = 'Not Successfully Load';

            if((!empty($checksheet_details) === true) && 
            (!empty($checksheet_items) === true)  && 
            (!empty($checksheet_data) === true)) 
            {
                $status = 'Success';
                $message = 'Successfully Load';
            }
        }
        
        return 
        [
            'status'    => $status ,
            'message'   => $message,
            'data'      => 
            [
                'checksheet_details'    => $checksheet_details,
                'checksheet_items'      => $checksheet_items,
                'checksheet_data'       => $checksheet_data,
                'attachment'            => $attachment_data,
                'takt_time'             => $takt_time_data,
                'down_time'             => $down_time_data,
                'actual_time'           => $actual_time_data['actual_time'],
            ]
        ];
    }
    
    public function loadFinishedInspection(TrialChecksheet $TrialChecksheet, LoginUser $LoginUser, Request $Request)
    {
        $decision = $Request->decision;

        $data = $TrialChecksheet->loadFinishedInspection($decision);

        foreach ($data as $key => $value) 
        {
            $inspect_by = $LoginUser->getFullName($value['inspect_by']);
            $evaluated_by = $LoginUser->getFullName($value['evaluated_by']);
            $approved_by = $LoginUser->getFullName($value['approved_by']);
            $disapproved_by = $LoginUser->getFullName($value['disapproved_by']);

            $data[$key]['inspect_by'] = $inspect_by['fullname'];
            $data[$key]['evaluated_by'] = $evaluated_by['fullname'];
            $data[$key]['approved_by'] = $approved_by['fullname'];
            $data[$key]['disapproved_by'] = $disapproved_by['fullname'];
        }
        
        $status = 'Error';
        $message = 'No Data';
        
        if(count($data) !== 0)
        {
            $status = 'Success';
            $message = 'Load Successfully!';
        }
    
        return
        [
            'status'    => $status ,
            'message'   => $message,
            'data'      => $data
        ];
    }

    public function editItem(ChecksheetItem $ChecksheetItem, Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $item_number = $Request->item_number;
        $specification = $Request->specification;

        $result = $ChecksheetItem->editItem($trial_checksheet_id, $item_number, ['specification' => $specification]);

        $status = 'Error';
        $message = 'Not Successfully Updated';

        if ($result) 
        {
            $status = 'Success';
            $message = 'The Evaluator edit the specs';
        }

        ActivityLog::activityLog($message . ' - Id : ' . $trial_checksheet_id . ' - Item Number : ' . $item_number . ' - Specs : ' . $specification, Session::get('name'));

        return 
        [
            'status'    => $status ,
            'message'   => $message,
            'data'      => $result  
        ];
    }

    public function editHinsei(TrialChecksheet $TrialChecksheet, ChecksheetItem $ChecksheetItem, ChecksheetData $ChecksheetData, Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $checksheet_item_id = $Request->checksheet_item_id;
        $item_number = $Request->item_number;
        $tools = $Request->tools;
        $type = $Request->type;
        $specification = $Request->specification;
        $upper_limit = $Request->upper_limit;
        $lower_limit = $Request->lower_limit;
        $judgment = $Request->judgment;
        $item_type = $Request->item_type;
        $remarks = $Request->remarks;
        $judgment_checksheet = $Request->judgment_checksheet;
        
        $data = 
        [
            'trial_checksheet_id'   => $trial_checksheet_id,
            'item_number'           => $item_number,
            'tools'                 => $tools,
            'type'                  => $type,
            'specification'         => $specification,
            'upper_limit'           => $upper_limit,
            'lower_limit'           => $lower_limit,
            'judgment'              => $judgment,
            'item_type'             => $item_type,
            'remarks'               => $remarks,
            'hinsei'                => 'HINSEI',
        ];

        $TrialChecksheet->updateTrialChecksheet($trial_checksheet_id, ['judgment' => $judgment_checksheet]);
        $ChecksheetData->updateHinsei($checksheet_item_id, ['hinsei' => 'HINSEI']);
        $result = $ChecksheetItem->updateOrCreateChecksheetItem($data);

        $status = 'Error';
        $message = 'Not Successfully Updated';

        if ($result !== null) 
        {
            $status = 'Success';
            $message = 'The Evaluator set to HINSEI';
        }

        ActivityLog::activityLog($message . ' - Id : ' . $trial_checksheet_id . ' - Item Number : ' . $item_number . ' - Tools : ' . $tools . ' - Type : ' . $type . ' - Specs : ' . $specification . ' - Upper Limit : ' . $upper_limit . ' - Lower Limit : ' . $lower_limit . ' - Judgment : ' . $judgment, Session::get('name'));

        return 
        [
            'status'    => $status ,
            'message'   => $message,
            'data'      => $result  
        ];
    }

    public function editData(TrialChecksheet $TrialChecksheet, 
                                ChecksheetItem $ChecksheetItem, 
                                ChecksheetData $ChecksheetData, 
                                Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $checksheet_item_id = $Request->checksheet_item_id;
        $sub_number = $Request->sub_number;
        $coordinates = $Request->coordinates;
        $datas = $Request->data;
        $judgment_datas = $Request->judgment_datas;
        $remarks = $Request->remarks;
        $item_type = $Request->item_type;
        $judgment_items = $Request->judgment_items;
        $judgment_checksheet = $Request->judgment_checksheet;

        $status = 'Error';
        $message = 'Not Successfully Updated';
        $result = false;

        DB::beginTransaction();

        try 
        {
            $data = 
            [
                'checksheet_item_id' => $checksheet_item_id,
                'sub_number'         => $sub_number,
                'coordinates'        => $coordinates,
                'data'               => $datas,
                'judgment'           => $judgment_datas,
                'remarks'            => $remarks,
                'type'               => $item_type,
            ];

            $TrialChecksheet->updateTrialChecksheet($trial_checksheet_id, ['judgment' => $judgment_checksheet]);
            $ChecksheetItem->updateAutoJudgmentItem($checksheet_item_id, ['judgment' => $judgment_items]);
            $ChecksheetData->updateOrCreateChecksheetData($data);

            $status = 'Success';
            $message = 'The Evaluator update the data';
            $result = true;
            
            DB::commit();
        } 
        catch (\Throwable $th) 
        {
            $status = 'Error';
            $message = $th->getMessage();
            DB::rollback();
        }

        ActivityLog::activityLog($message . ' - Id : ' . $checksheet_item_id . ' - Sub Number : ' . $sub_number . ' - Coordinates : ' . $coordinates . ' - Data : ' . $datas . ' - Judgment Checksheet : ' . $judgment_checksheet . ' - Judgment Item : ' . $judgment_items . ' - Judgment Data : ' . $judgment_datas . ' - Remarks : ' . $remarks, Session::get('name'));

        return 
        [
            'status'    => $status ,
            'message'   => $message,
            'data'      => $result  
        ];
    }

    public function generateTrialEvaluationResult($trial_checksheet_id)
    {
        $TrialChecksheet = new TrialChecksheet();
        $ChecksheetItem = new ChecksheetItem();
        $ChecksheetData = new ChecksheetData();
        $TaktTime = new TaktTime();
        $Supplier = new Supplier();
        $Approval = new Approval();
        $Attachment = new Attachment();
        $LoginUser = new LoginUser();

        $status = 'Error';
        $message = 'No Data';
        $result = false;

        if ($trial_checksheet_id !== null) 
        {
            $data_trial_ledger = json_decode(json_encode($TrialChecksheet->getChecksheetDetails($trial_checksheet_id)),true);
            $data_supplier      = json_decode(json_encode($Supplier->getSupplier($data_trial_ledger['supplier_code'])),true);

            $data_trial_ledger_merge = array_merge($data_trial_ledger, $data_supplier);

            $checksheet_items = $ChecksheetItem->getChecksheetItem($trial_checksheet_id);
            
            foreach($checksheet_items as $checksheet_items_value) 
            {
                $checksheet_datas[] = $ChecksheetData->getChecksheetData($checksheet_items_value->id);
            }

            $takt_time = $TaktTime->getActual($trial_checksheet_id);

            $approval = $Approval->getApproval($trial_checksheet_id);

            $inspect_by = $LoginUser->getFullName($approval['inspect_by']);
            $evaluated_by = $LoginUser->getFullName($approval['evaluated_by']);
            $approved_by = $LoginUser->getFullName($approval['approved_by']);
            $disapproved_by = $LoginUser->getFullName($approval['disapproved_by']);

            $approval['inspect_by'] = $inspect_by['fullname'];
            $approval['evaluated_by'] = $evaluated_by['fullname'];
            $approval['approved_by'] = $approved_by['fullname'];
            $approval['disapproved_by'] = $disapproved_by['fullname'];

            $data =  [
                'details' => $data_trial_ledger_merge,
                'takt_time' => $takt_time['actual_time'],
                'items' => $checksheet_items,
                'datas' => $checksheet_datas,
                'approval' => $approval,
            ];

            $folder_name = $Attachment->getAttachment($trial_checksheet_id);

            if ($data) 
            {
                $status = 'Success';
                $message = 'Successfully Save';
                $result = true;

                $date = date('Ymd');
                // return Excel::download(new TrialEvaluationResultExport($data), 'test.xlsx');
                return Excel::store(new TrialEvaluationResultExport($data), $folder_name['file_folder'] . "/{$data_trial_ledger_merge['part_number']}-{$data_trial_ledger_merge['revision_number']}-T{$data_trial_ledger_merge['trial_number']}-{$date}.xlsx", 'public');
            }
        }

        return 
        [
            'status'    => $status ,
            'message'   => $message,
            'data'      => $result  
        ];
    }

    public function generateSecondPage($trial_checksheet_id)
    {
        $TrialChecksheet = new TrialChecksheet();
        $ChecksheetItem = new ChecksheetItem();
        $ChecksheetData = new ChecksheetData();
        $Supplier = new Supplier();
        $Approval = new Approval();
        $Unique = new Unique();
        $LoginUser = new LoginUser();

        $data_trial_ledger = json_decode(json_encode($TrialChecksheet->getChecksheetDetails($trial_checksheet_id)),true);
        $data_supplier = json_decode(json_encode($Supplier->getSupplier($data_trial_ledger['supplier_code'])),true);

        $data_trial_ledger_merge = array_merge($data_trial_ledger, $data_supplier);

        $details_data = $TrialChecksheet->getAllNg($data_trial_ledger_merge['part_number'], $data_trial_ledger_merge['inspection_reason']);

        $get_first_trial = $TrialChecksheet->getFirstTrial($data_trial_ledger_merge['part_number'], $data_trial_ledger_merge['inspection_reason']);

        $result_merge = [];
        $checksheet_items_result = [];
        $checksheet_datas_result = [];

        $get_first_trial_ng = $ChecksheetItem->getfirstTrialNg($get_first_trial['id']);

        if (count($get_first_trial_ng) !== 0) 
        {
            for($i=0; $i < count($details_data); $i++)
            {
                $trial_checksheet_id_result = $details_data[$i]['id'];
                for ($z=0; $z < count($get_first_trial_ng); $z++) 
                { 
                    $result_merge[$i][] = [
                        'trial_checksheet_id' => $trial_checksheet_id_result,
                        'item_number' => $get_first_trial_ng[$z]['item_number']
                    ];
                }
            }
        }

        foreach ($result_merge as $details_key => $details_value) 
        {
            $details_value = $Unique->unique_multidim_array($details_value, 'item_number');
            foreach ($details_value as $value) 
            {
                $checksheets_item = json_decode(json_encode($ChecksheetItem->getItemNg($value['trial_checksheet_id'], $value['item_number'])),true);

                if (empty($checksheets_item)) 
                {
                    $checksheets_item = 
                    [
                        'id' => '',
                        'item_number' => '',
                        'judgment' => '',
                        'lower_limit' => '',
                        'upper_limit' => '',
                        'remarks' => '',
                        'hinsei' => '',
                        'specification' => '',
                        'tools' => '',
                        'type' => '',
                        'trial_checksheet' => '',
                    ];
                }

                $checksheet_items_result[$details_key][] = $checksheets_item;
            }
        }

        foreach ($checksheet_items_result as $checksheet_items_key => $item_value) 
        {
            foreach ($item_value as $value) 
            {
                $checksheet_data = [];

                if ($value['id'] !== '') 
                    $checksheet_data = json_decode(json_encode($ChecksheetData->getDataNg($value['id'])),true);
                
                if (empty($checksheet_data)) 
                {
                    $checksheet_data[] = 
                    [
                        'id' => '', 
                        'checksheet_item_id' => '', 
                        'coordinates' => '', 
                        'data' => '', 
                        'judgment' => '', 
                        'remarks' => '', 
                        'hinsei' => '', 
                        'type' => ''
                    ];
                }

                $checksheet_datas_result[$checksheet_items_key][] = $checksheet_data;
            }
        }

        $approval_data = $Approval->getApproval($trial_checksheet_id);

        $inspect_by = $LoginUser->getFullName($approval_data['inspect_by']);
        $evaluated_by = $LoginUser->getFullName($approval_data['evaluated_by']);
        $approved_by = $LoginUser->getFullName($approval_data['approved_by']);
        $disapproved_by = $LoginUser->getFullName($approval_data['disapproved_by']);

        $approval_data['inspect_by'] = $inspect_by['fullname'];
        $approval_data['evaluated_by'] = $evaluated_by['fullname'];
        $approval_data['approved_by'] = $approved_by['fullname'];
        $approval_data['disapproved_by'] = $disapproved_by['fullname'];

        return 
        [
            'checksheet_details'    =>  $data_trial_ledger_merge,
            'details_data'          =>  $details_data,
            'items'                 =>  $checksheet_items_result,
            'datas'                 =>  $checksheet_datas_result,
            'approval'              =>  $approval_data,
        ];

    }

    public function approved(Approval $Approval,
                                Attachment $Attachment,
                                FpdfController $FpdfController,
                                MailController $MailController,
                                Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
        $decision = $Request->decision;
        $action = $Request->action;
        $selected_file = $Request->selected_file;
        $reason = $Request->reason;

        $attachment = [];
        $status = 'Error';
        $message = 'Not Successfully Save';

        $mail_send = '';

        DB::beginTransaction();

        try 
        {
            if ($decision == 1 && $action == 1) 
            {
                $whereSend = $Approval->getApproval($trial_checksheet_id);

                if (($whereSend['disapproved_by'] === null && $whereSend['evaluated_by'] === null) 
                        || ($whereSend['disapproved_by'] !== null && $whereSend['approved_by'] === null)) 
                    $status = 'for_approval';
                else if ($whereSend['disapproved_by'] !== null && $whereSend['evaluated_by'] !== null)
                    $status = 're_approval';

                $data = 
                [
                    'evaluated_by' => Session::get('name'),
                    'evaluated_datetime' => now(),
                    'decision' => 2
                ];

                $result =  $Approval->approved($trial_checksheet_id, $data);

                $second_page_data = $this->generateSecondPage($trial_checksheet_id);
                $this->generateTrialEvaluationResult($trial_checksheet_id);

                $merge_data_file = 
                [
                    'file_merge' => $selected_file
                ];

                $Attachment->storeFileMerge($trial_checksheet_id, $merge_data_file);

                $folder_name = $Attachment->getAttachment($trial_checksheet_id);

                $merge_file_data = 
                [
                    'folder_name' =>  $folder_name['file_folder'],
                    'file_name' =>  explode(',', $selected_file)
                ];

                $FpdfController->mergeFile($merge_file_data, $second_page_data);

                $message = 'Approved by Evaluator';
            }
            else if ($decision == 1 && $action == 2) 
            {
                $data = 
                [
                    'evaluated_by' => Session::get('name'),
                    'evaluated_datetime' => now(),
                    'disapproved_by' => Session::get('name'),
                    'disapproved_datetime' => now(),
                    'decision' => 5,
                    'reason' => $reason
                ];

                $result =  $Approval->approved($trial_checksheet_id, $data);

                $status = 're_inspect';
                $message = 'Disapproved by Evaluator';
            }
            else if($decision == 2 && $action == 1)
            {
                $data = 
                [
                    'approved_by' => Session::get('name'),
                    'approved_datetime' => now(),
                    'decision' => 0
                ];

                $result =  $Approval->approved($trial_checksheet_id, $data);

                $second_page_data = $this->generateSecondPage($trial_checksheet_id);
                $this->generateTrialEvaluationResult($trial_checksheet_id);

                $folder_name = $Attachment->getAttachment($trial_checksheet_id);

                $merge_file_data = 
                [
                    'folder_name' =>  $folder_name['file_folder'],
                    'file_name' =>  explode(',', $folder_name['file_merge'])
                ];

                $FpdfController->mergeFile($merge_file_data, $second_page_data);

                $status = 'approved';

                $attachment = 
                [
                    storage_path('app/public/' . $folder_name['file_folder'] . '/' . $folder_name['file_name_merge'] . '.pdf'),
                    storage_path('app/public/' . $folder_name['file_folder'] . '/' . $folder_name['file_name_merge'] . '.xlsx'),
                ];

                $message = 'Approved by Approver';
            }
            else if($decision == 2 && $action == 2)
            {
                $data = 
                [
                    'approved_by' => Session::get('name'),
                    'approved_datetime' => now(),
                    'disapproved_by' => Session::get('name'),
                    'disapproved_datetime' => now(),
                    'decision' => 3,
                    'reason' => $reason
                ];

                $result =  $Approval->approved($trial_checksheet_id, $data);

                $status = 're_evaluation_approver';
                $message = 'Disppproved by Approver';
            }
            else if($decision == 3 && $action == 1)
            {
                $data = 
                [
                    'evaluated_by' => Session::get('name'),
                    'evaluated_datetime' => now(),
                    'decision' => 2
                ];

                $result =  $Approval->approved($trial_checksheet_id, $data);

                $second_page_data = $this->generateSecondPage($trial_checksheet_id);
                $this->generateTrialEvaluationResult($trial_checksheet_id);

                $folder_name = $Attachment->getAttachment($trial_checksheet_id);

                $merge_file_data = 
                [
                    'folder_name' =>  $folder_name['file_folder'],
                    'file_name' =>  explode(',', $folder_name['file_merge'])
                ];

                $FpdfController->mergeFile($merge_file_data, $second_page_data);

                $status = 're_approval';
                $message = 'Reapproved by Evaluator';
            }

            $mail_send = $MailController->sendEmail($trial_checksheet_id, $status, $attachment);

            $status = 'Success';

            DB::commit();
        } 
        catch (\Throwable $th) 
        {
            $status = 'Error';
            $message = $th->getMessage();
            DB::rollback();
        }

        ActivityLog::activityLog($message . ' - Id : ' . $trial_checksheet_id . ' - Action : ' . $action . ' - Decision : ' . $decision . ' - Selected File : ' . $selected_file . ' - Reason : ' . $reason, Session::get('name'));
        
        return
        [
           'status'     => $status ,
           'message'    => $message,
           'mail'       => $mail_send,
           'data'       => 
           [
               'result'      => $result,
           ]
        ];
    }
}