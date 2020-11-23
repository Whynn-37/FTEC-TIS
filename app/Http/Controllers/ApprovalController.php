<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Approval;
use App\ChecksheetItem;
use App\TrialChecksheet;
use App\ChecksheetData;
class ApprovalController extends Controller
{
    public function loadInspectionData(ChecksheetData $ChecksheetData, 
                                        ChecksheetItem $ChecksheetItem,
                                        TrialChecksheet $TrialChecksheet, 
                                        Request $Request)
    {
        $trial_checksheet_id = $Request->id;

        $status = 'Error';
        $message = 'No data';

        $checksheet_details = [];
        $checksheet_items = [];
        $checksheet_data = [];

        if ($trial_checksheet_id !== null) 
        {
            $checksheet_details = $TrialChecksheet->getChecksheetDetails($trial_checksheet_id);
            $checksheet_items = $ChecksheetItem->getChecksheetItem($trial_checksheet_id);
            
            foreach($checksheet_items as $checksheet_items_value) 
            {
                $data = $ChecksheetData->getChecksheetData($checksheet_items_value->id);
                $checksheet_data[] = $data[0];
            }

            $status = 'Error';
            $message = 'Somethings Wrong!';

            if((!empty($checksheet_details) === true ) && 
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

    public function editData(ChecksheetData $ChecksheetData, Request $Request)
    {
        $checksheet_item_id = $Request->checksheet_item_id;
        $sub_number = $Request->sub_number;
        $coordinates = $Request->coordinates;
        $data = $Request->data;
        $judgment = $Request->judgment;
        $remarks = $Request->remarks;

        $dataset = 
        [
            'checksheet_item_id' => $checksheet_item_id,
            'sub_number'         => $sub_number,
            'coordinates'        => $coordinates,
            'data'               => $data,
            'judgment'           => $judgment,
            'remarks'            => $remarks,
        ];

        $result = $ChecksheetData->updateOrCreateChecksheetData($dataset);

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
    
}
