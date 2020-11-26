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

    public function loadApproval(Approval $approval)
    {
        $message = 'Load Successfully';
        $status = 'Success';

        $approval_decision = $approval->loadApproval();

        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $approval_decision
        ]);
    }

    public function loadDisapproved(Approval $approval)
    {
        $message = 'Load Successfully';
        $status = 'Success';

        $disapproved_decision = $approval->loadDisapproved();

        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $disapproved_decision
        ]);
    }
}
