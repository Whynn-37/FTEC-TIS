<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Approval;
use App\Attachment;
use App\ChecksheetItem;
use App\TrialChecksheet;
use App\ChecksheetData;
use Session;
use App\TaktTime;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TrialEvaluationResultExport;
use App\Supplier;
use App\TrialLedger;
use App\Http\Controllers\FpdfController;

class ApprovalController extends Controller
{

    public function loadInspectionData(ChecksheetData $ChecksheetData, 
                                        ChecksheetItem $ChecksheetItem,
                                        TrialChecksheet $TrialChecksheet, 
                                        Request $Request)
    {
        $trial_checksheet_id = $Request->id;

        $status = 'Error';
        $message = 'No Trial Checksheet ID';

        $checksheet_details = [];
        $checksheet_items = [];
        $checksheet_data = [];

        if ($trial_checksheet_id !== null) 
        {
            $checksheet_details = $TrialChecksheet->getChecksheetDetails($trial_checksheet_id);
            $checksheet_items = $ChecksheetItem->getChecksheetItem($trial_checksheet_id);
            
            foreach($checksheet_items as $checksheet_items_value) 
            {
                $checksheet_data[] = $ChecksheetData->getChecksheetData($checksheet_items_value->id);
            }

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
                'checksheet_data'       =>$checksheet_data
            ]
        ];
    }
    
    public function loadFinishedInspection(TrialChecksheet $trialchecksheet)
    {
        $data = $trialchecksheet->loadFinishedInspection();

        $status = 'Error';
        $message = 'Somethings Wrong!';
        
        if(!empty($data) == true )
        {
            $status = 'Success';
            $message = 'Load Successfully!';
        }

       return
       [
           'status' => $status ,
           'message' => $message,
           'data' => $data
        ];
    }

    public function editHinsei(ChecksheetItem $ChecksheetItem, Request $Request)
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
        $hinsei = $Request->hinsei;

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
            'hinsei'                => $hinsei,
        ];

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

    public function editData(ChecksheetData $ChecksheetData, Request $Request)
    {
        $checksheet_item_id = $Request->checksheet_item_id;
        $sub_number = $Request->sub_number;
        $coordinates = $Request->coordinates;
        $data = $Request->data;
        $judgment = $Request->judgment;
        $remarks = $Request->remarks;

        $data = 
        [
            'checksheet_item_id' => $checksheet_item_id,
            'sub_number'         => $sub_number,
            'coordinates'        => $coordinates,
            'data'               => $data,
            'judgment'           => $judgment,
            'remarks'            => $remarks,
        ];

        $result = $ChecksheetData->updateOrCreateChecksheetData($data);

        $status = 'Error';
        $message = 'Somethings Wrong!';

        if ($result !== null) {

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

    public function generateTrialEvaluationResult(TrialChecksheet $TrialChecksheet, 
                                                    ChecksheetItem $ChecksheetItem,
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

            $checksheet_items = $TrialChecksheet->loadChecksheetItem($trial_checksheet_id);
            $checksheet_datas = $ChecksheetItem->loadChecksheetData($checksheet_items);

            $takt_time = $TaktTime->loadCycleTime($trial_checksheet_id);

            $approval = $Approval->getApproval($trial_checksheet_id);

            $data =  [
                'details' => $data_trial_ledger_merge,
                'takt_time' => $takt_time,
                'items' => $checksheet_items,
                'datas' => $checksheet_datas,
                'approval' => $approval,
            ];
<<<<<<< HEAD

            return $data;

=======
            // $data_trial_ledger_merge['part_number']. '_' . $data_trial_ledger_merge['revision_number'] .'.xlsx'
>>>>>>> 8d5d9d692a26ce93c54fe300b1b10f6fcc68abe0
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
        $data_supplier      = json_decode(json_encode($Supplier->getSupplier($data_trial_ledger['supplier_code'])),true);
        $data_trial_ledger_merge = array_merge($data_trial_ledger, $data_supplier);

        if ($data_trial_ledger_merge['trial_number'] !== 1)
        {
            $details_data = $TrialChecksheet->getAllNg($data_trial_ledger_merge['part_number'], $data_trial_ledger_merge['revision_number']);

            foreach ($details_data as $details_value) 
            {
                $checksheet_items[] = json_decode(json_encode($ChecksheetItem->getItemNg($details_value['id'])),true);
            }

            foreach ($checksheet_items as $item_value) 
            {
                $checksheet_datas[] = json_decode(json_encode($ChecksheetData->getDataNg($item_value['id'])),true);
            }

            for ($i=0; $i < count($checksheet_datas); $i++) 
            { 
                for ($z=0; $z < count($checksheet_items); $z++) 
                {
                    for ($y=0; $y < count($details_data); $y++) 
                    { 
                        if ($i === $z && $i === $y) 
                        {
                            if (count($checksheet_datas[$i]) < 2) 
                            {
                                $checksheet_data[] = 
                                [
                                    'trial_number'      => $details_data[0]['trial_number'],
                                    'date_finished'     => $details_data[0]['date_finished'],
                                    'judgment'          => $details_data[0]['judgment'],
                                    'revision_number'   => $details_data[0]['revision_number'],
                                    'tools'             => $checksheet_items[0]['tools'],
                                    'specification'     => $checksheet_items[0]['specification'],
                                    'coordinates'       => $checksheet_datas[0][0]['coordinates'],
                                    'data'              => explode(",",$checksheet_datas[0][0]['data']),
                                    'judgment'          => $checksheet_datas[0][0]['judgment'],
                                    'remarks'           => $checksheet_datas[0][0]['remarks'],
                                ];
                            }
                            else
                            {
                                for ($q=0; $q < count($checksheet_datas[$i]); $q++) 
                                { 
                                    $checksheet_data[] = 
                                    [
                                        'trial_number'      => $details_data[$y]['trial_number'],
                                        'date_finished'     => $details_data[$y]['date_finished'],
                                        'judgment'          => $details_data[$y]['judgment'],
                                        'revision_number'   => $details_data[$y]['revision_number'],
                                        'tools'             => $checksheet_items[$z]['tools'],
                                        'specification'     => $checksheet_items[$z]['specification'],
                                        'coordinates'       => $checksheet_datas[$i][$q]['coordinates'],
                                        'data'              => explode(",",$checksheet_datas[$i][$q]['data']),
                                        'judgment'          => $checksheet_datas[$i][$q]['judgment'],
                                        'remarks'           => $checksheet_datas[$i][$q]['remarks'],
                                    ];
                                }
                            }
                        }
                    }
                }
            }

            $approval_data = json_decode(json_encode($Approval->getApproval($trial_checksheet_id)),true);

            $data = [
                'checksheet_details'    =>  $data_trial_ledger_merge,
                'checksheets'           =>  $checksheet_data,
                'approval'              =>  $approval_data,
            ];
            // return $data;
            return $FpdfController->secondPage($data);
        }
    }

    public function loadApproval(Approval $approval)
    {
        $data = $approval->loadApproval();

        $status = 'Error';
        $message = 'Not Load Successfully';

        if ($data) 
        {
            $status = 'Success';
            $message = 'Load Successfully';
        }

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $data
        ];
    }


    public function loadDisapproved(TrialChecksheet $trialchecksheet)
    {
        $data = $trialchecksheet->loadDisapproved();

        $status = 'Error';
        $message = 'Somethings Wrong!';
        
        if(!empty($data) == true )
        {
            $status = 'Success';
            $message = 'Load Successfully!';
        }

       return
       [
           'status' => $status ,
           'message' => $message,
           'data' => $data
        ];
    }

    public function approved(Approval $Approval,Attachment $Attachment,Request $Request)
    {
      

         $trial_checksheet_id = $Request->trial_checksheet_id;
         $selected_file = $Request->selected_file;


        $data = [
            'evaluated_by' => Session::get('fullname'),
            'evaluated_datetime' => date('Y/m/d H:i:s'),
            'decision' => 2
            ];

         // --- update method 
         // $result =  $Approval->approved($trial_checksheet_id,$data);
         
         //  --- select method        
         return $attachment  =  $Attachment->getAttachment($trial_checksheet_id);

         // pdf merge method    
        
         
        $status = 'Error';
        $message = 'Somethings Wrong!';
        
        if(!empty($result) == true )
        {
            $status = 'Success';
            $message = 'Load Successfully!';
            $result  = '';
        }

       return
       [
           'status' => $status ,
           'message' => $message,
           'data' => $result
        ];
    }
}
