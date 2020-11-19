<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Approval;
use App\ChecksheetItem;
use App\TrialChecksheet;
use App\ChecksheetData;

class ApprovalController extends Controller
{
    
    public function loadInspectionData(ChecksheetData $checksheetdata,ChecksheetItem $checksheetitem,TrialChecksheet $trialchecksheet, Request $request)
    {
        $trial_checksheet_id = $request->id;

         $checksheet_details = $trialchecksheet->getChecksheetDetails($trial_checksheet_id);
          $checksheet_items = $checksheetitem->getChecksheetItem($trial_checksheet_id);

         foreach($checksheet_items as $value){
            $data = $checksheetdata->getChecksheetData($value->id);
            $checksheet_data[] = $data[0];
        }
          
       // return $checksheet_data;

        if((!empty($checksheet_details) == true ) && 
        (!empty($checksheet_items) == true)  && 
        (!empty($checksheet_data) == true)){

            $status = 'Success';
            $message = 'Load Successfully!';
        }else{

            $status = 'Error';
            $message = 'Somethings Wrong!';
        }




      return    ['status' => $status ,
                    'message' => $message,
                    'data' => [
                        'checksheet_details' => $checksheet_details,
                        'checksheet_items' => $checksheet_items,
                        'checksheet_data' =>$checksheet_data
                        ]        
                ];

    }
    public function loadFinishedInspection(TrialChecksheet $trialchecksheet)
    {
        $data = $trialchecksheet->loadFinishedInspection();

       if(!empty($data) == true )
       {

            $status = 'Success';
            $message = 'Load Successfully!';
        }else{

            $status = 'Error';
            $message = 'Somethings Wrong!';
        }

       return    ['status' => $status ,
       'message' => $message,
       'data' => $data
   ];
    }
}
