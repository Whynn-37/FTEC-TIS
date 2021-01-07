<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Approval;
use App\Attachment;
use App\ChecksheetItem;
use App\TrialChecksheet;
use App\ChecksheetData;
use App\TaktTime;
use App\Supplier;
use App\Exports\TrialEvaluationResultExport;
use App\Http\Controllers\MailController;
use Session;
use DB;
use Illuminate\Support\Facades\Mail;

class ApprovalController extends Controller
{
    public function loadInspectionData(ChecksheetData $ChecksheetData, 
                                        ChecksheetItem $ChecksheetItem,
                                        TrialChecksheet $TrialChecksheet, 
                                        Attachment $Attachment,
                                        TaktTime $TaktTime,
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

        if ($trial_checksheet_id !== null) 
        {
            $checksheet_details = $TrialChecksheet->getChecksheetDetails($trial_checksheet_id);
            $checksheet_items = $ChecksheetItem->getChecksheetItem($trial_checksheet_id);
            
            foreach($checksheet_items as $checksheet_items_value) 
            {
                $checksheet_data[] = $ChecksheetData->getChecksheetData($checksheet_items_value->id);
            }

            $attachment = $Attachment->getAttachment($trial_checksheet_id);

            $explode_attachment = explode(',', $attachment['file_name']);

            $attachment_data = [
                'file_folder' => $attachment['file_folder'],
                'file_name' => $explode_attachment
            ];

            $takt_time_data = $TaktTime->getTotalTaktTime($trial_checksheet_id);


            $status = 'Error';
            $message = 'Somethings Wrong!';

            if((!empty($checksheet_details) === true) && 
            (!empty($checksheet_items) === true)  && 
            (!empty($checksheet_data) === true)) 
            {
                $status = 'Success';
                $message = 'Load Successfully!';
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
            ]
        ];
    }
    
    public function loadFinishedInspection(TrialChecksheet $TrialChecksheet, Request $Request)
    {
        $decision = $Request->decision;

        $data = $TrialChecksheet->loadFinishedInspection($decision);
        
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

    public function editHinsei(TrialChecksheet $TrialChecksheet, ChecksheetItem $ChecksheetItem, Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;
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

        $trial_checksheet = 
        [
            'judgment'              => $judgment_checksheet
        ];

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

        $TrialChecksheet->updateTrialChecksheet($trial_checksheet_id, $trial_checksheet);

        $result = $ChecksheetItem->updateOrCreateChecksheetItem($data);

        $status = 'Error';
        $message = 'Somethings Wrong!';

        if ($result !== null) 
        {
            $status = 'Success';
            $message = 'Update Successfully!';
        }

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
        $data = $Request->data;
        $judgment_datas = $Request->judgment_datas;
        $remarks = $Request->remarks;

        $judgment_items = $Request->judgment_items;

        $judgment_checksheet = $Request->judgment_checksheet;


        $status = 'Error';
        $message = 'Somethings Wrong!';
        $result = false;

        DB::beginTransaction();

        try 
        {
            $trial_checksheet = 
            [
                'judgment'              => $judgment_checksheet
            ];

            $items = 
            [
                'judgment'              => $judgment_items
            ];

            $data = 
            [
                'checksheet_item_id' => $checksheet_item_id,
                'sub_number'         => $sub_number,
                'coordinates'        => $coordinates,
                'data'               => $data,
                'judgment'           => $judgment_datas,
                'remarks'            => $remarks,
            ];

            $TrialChecksheet->updateTrialChecksheet($trial_checksheet_id, $trial_checksheet);
            $ChecksheetItem->updateAutoJudgmentItem($checksheet_item_id, $items);
            $ChecksheetData->updateOrCreateChecksheetData($data);

            $status = 'Success';
            $message = 'Update Successfully!';
            $result = true;
            
            DB::commit();
        } 
        catch (\Throwable $th) 
        {
            $status = 'Error';
            $message = $th->getMessage();
            DB::rollback();
        }

        return 
        [
            'status'    => $status ,
            'message'   => $message,
            'data'      => $result  
        ];
    }

    public function generateTrialEvaluationResult(TrialChecksheet $TrialChecksheet, 
                                                    ChecksheetItem $ChecksheetItem,
                                                    ChecksheetData $ChecksheetData,
                                                    TaktTime $TaktTime,
                                                    Supplier $Supplier,
                                                    Approval $Approval,
                                                    Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;

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

            $takt_time = $TaktTime->loadCycleTime($trial_checksheet_id);

            $approval = $Approval->getApproval($trial_checksheet_id);

            $data =  [
                'details' => $data_trial_ledger_merge,
                'takt_time' => $takt_time,
                'items' => $checksheet_items,
                'datas' => $checksheet_datas,
                'approval' => $approval,
            ];

            if ($data) 
            {
                $status = 'Success';
                $message = 'Successfully Save';
                $result = true;
                return (new TrialEvaluationResultExport($data))->download("{$data_trial_ledger_merge['part_number']}_{$data_trial_ledger_merge['revision_number']}.xlsx");
            }
        }

        return 
        [
            'status'    => $status ,
            'message'   => $message,
            'data'      => $result  
        ];
    }

    public function generateSecondPage(TrialChecksheet $TrialChecksheet, 
                                        ChecksheetItem $ChecksheetItem,
                                        ChecksheetData $ChecksheetData,
                                        Supplier $Supplier,
                                        Approval $Approval,
                                        FpdfController $FpdfController,
                                        Request $Request)
    {
        $trial_checksheet_id = $Request->trial_checksheet_id;

         $data_trial_ledger = json_decode(json_encode($TrialChecksheet->getChecksheetDetails($trial_checksheet_id)),true);
        $data_supplier = json_decode(json_encode($Supplier->getSupplier($data_trial_ledger['supplier_code'])),true);

        $data_trial_ledger_merge = array_merge($data_trial_ledger, $data_supplier);

         $details_data = $TrialChecksheet->getAllNg($data_trial_ledger_merge['part_number']);

        $get_first_trial = $TrialChecksheet->getFirstTrial($data_trial_ledger_merge['part_number']);

        $result_merge = [];
        $checksheet_items_result = [];
        $checksheet_datas_result = [];

        $get_first_trial_ng = $ChecksheetItem->getfirstTrialNg($get_first_trial['id']);

        if (count($get_first_trial_ng) !== 0) 
        {
            if ($data_trial_ledger['trial_number'] !== 1) 
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
            else 
            {
                for($i=0; $i < count($details_data); $i++)
                {
                    $trial_checksheet_id_result = $details_data[$i]['id'];
                    $result_merge[$i][] = [
                        'trial_checksheet_id' => $details_data[$i]['id'],
                        'item_number' => $get_first_trial_ng[$z]['item_number']
                    ];
                }
            }
        }

        foreach ($result_merge as $details_key => $details_value) 
        {
            foreach ($details_value as $value) 
            {
                $checksheet_items_result[$details_key][] = json_decode(json_encode($ChecksheetItem->getItemNg($value['trial_checksheet_id'], $value['item_number'])),true);
            }
        }

        foreach ($checksheet_items_result as $checksheet_items_key => $item_value) 
        {
            foreach ($item_value as $value) 
            {
                $checksheet_datas_result[$checksheet_items_key][] = json_decode(json_encode($ChecksheetData->getDataNg($value['id'])),true);
            }
        }

        $approval_data = json_decode(json_encode($Approval->getApproval($trial_checksheet_id)),true);

        $data = [
            'checksheet_details'    =>  $data_trial_ledger_merge,
            'details_data'          =>  $details_data,
            'items'                 =>  $checksheet_items_result,
            'datas'                 =>  $checksheet_datas_result,
            'approval'              =>  $approval_data,
        ];

        return $FpdfController->secondPage($data);
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

        if ($decision == 1 && $action == 1) 
        {
            $data = 
            [
                'evaluated_by' => Session::get('fullname'),
                // 'evaluated_by' => 'TERRY BALAHADIA',
                'evaluated_datetime' => now(),
                'decision' => 2
            ];

            $folder_name = $Attachment->getAttachment($trial_checksheet_id);

            $datax = 
            [
                'folder_name' =>  $folder_name['file_folder'],
                'file_name' =>  explode(',', $selected_file)
            ];

            $FpdfController->pdfTest($datax);

            $status = 'after_evaluation';

            $folder_name = $folder_name['file_folder'];
        }
        else if($decision == 2 && $action == 1)
        {
            $data = 
            [
                'approved_by' => Session::get('fullname'),
                // 'approved_by' => 'JOHN JOHREL MANZANO',
                'approved_datetime' => now(),
                'decision' => 0
            ];

            $status = 'approved';

            $folder_name = '';
        }
        else if($decision == 2 && $action == 2)
        {
            $data = 
            [
                'disapproved_by' => Session::get('fullname'),
                // 'disapproved_by' => 'JOHN JOHREL MANZANO',
                'disapproved_datetime' => now(),
                'decision' => 3
            ];

            $status = 'disapproved';

            $folder_name = '';
        }
        else if($decision == 3 && $action == 1)
        {
            $data = 
            [
                'evaluated_by' => Session::get('fullname'),
                // 'evaluated_by' => 'TERRY BALAHADIA',
                'evaluated_datetime' => now(),
                'decision' => 2
            ];

            $folder_name = $Attachment->getAttachment($trial_checksheet_id);

            $datax = 
            [
                'folder_name' =>  $folder_name['file_folder'],
                'file_name' =>  explode(',', $selected_file)
            ];

            $FpdfController->pdfTest($datax);

            $status = 'after_evaluation';

            $folder_name = $folder_name['file_folder'];
        }
        
        $result =  $Approval->approved($trial_checksheet_id, $data);

        // $send_mail = 
        // [
        //     'trial_checksheet_id' => $trial_checksheet_id,
        //     'status' => $status
        // ];

        $MailController->sendEmail($trial_checksheet_id, $status);

        $status = 'Error';
        $message = 'Somethings Wrong!';
        
        if($result)
        {
            $status = 'Success';
            $message = 'Save Successfully!';
        }

        return
        [
           'status'     => $status ,
           'message'    => $message,
           'data'       => 
           [
               'folder_name' => $folder_name,
               'result'      => $result,
           ]
        ];
    }
}
