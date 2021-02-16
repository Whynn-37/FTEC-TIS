<?php

namespace App\Http\Controllers;

use App\Http\Controllers\UploadController;
use App\TrialLedger;
use App\Helpers\ActivityLog;
use Session;

class TrialLedgerController extends Controller
{
    public function storeTrialLedger(UploadController $Upload, TrialLedger $TrialLedger)
    {
        // $file = '\\\10.164.20.211\uploads\trial_ledger.xlsx';
        //    $file = 'C:\TIS\trial_ledger.xlsx';
        $file = 'F:\TIS\trial_ledger.xlsx';
       // $file = 'D:\trial_ledger.xlsx';
       // $file = '\\\10.164.20.211\uploads\trial_ledger.xlsx';
    //    $file = 'D:\trial_ledger.xlsx';
        // $file = 'D:\trial_ledger.csv';
        // $file = '\\\10.164.20.211\uploads\trial_ledger.xlsx';
        // $file = 'D:\TIS\trial_ledger.xlsx';
        $file = 'F:\TIS\trial_ledger.xlsx';

        $status = 'Error';
        $message = 'No file in Directory';
        $result = [];
        $sheet = 0;
        $store_trial_ledger = [];

        $logs = 'The File Path is wrong or No file in directory';

        if(file_exists($file))
        {
            $status = 'Success';
            $message = 'File exist';
            
            $data = $Upload->upload($file,$sheet);

            for($i=1; $i < count($data); $i++)
            {
                $datas[] = 
                [
                    'application_date'              =>  $data[$i][1], //APPL_DATE
                    'received_date'                 =>  $data[$i][2], //RECV_DATE
                    'supplier_code'                 =>  $data[$i][3], //SUP_CD
                    'part_number'                   =>  $data[$i][4], //PART_DWG_NO
                    'part_name'                     =>  $data[$i][5], //PART_NAME
                    'revision_number'               =>  $data[$i][6], //PART_VER
                    'inspection_reason'             =>  $data[$i][7], //INSP_REASON
                    'die_class'                     =>  $data[$i][9], //DIE_CLASS
                    'model_name'                    =>  $data[$i][10], //MODEL
                    'delivery_date'                 =>  $data[$i][15], //D_DELV_DATE
                    'inspector_id'                  =>  $data[$i][16], //INSPECTOR_ID
                    'judgment'                      =>  $data[$i][17], //JUDG
                    'trial_number'                  =>  $data[$i][18], //TRIAL_NUM
                    'inspection_actual_time'        =>  $data[$i][20], //INSP_ACT_TIME
                    'inspection_required_time'      =>  $data[$i][21], //INSP_REQ_TIME
                    'plan_start_date'               =>  $data[$i][22], //PLAN_START_DATE
                    'plan_end_date'                 =>  $data[$i][23], //PLAN_END_DATE
                    'actual_end_date'               =>  $data[$i][24] //ACT_END_DATE
                ];
                // $datas[] = 
                // [
                //     'application_date'              =>  $data[$i][0], //APPL_DATE
                //     'received_date'                 =>  $data[$i][1], //RECV_DATE
                //     'supplier_code'                 =>  $data[$i][2], //SUP_CD
                //     'part_number'                   =>  $data[$i][3], //PART_DWG_NO
                //     'part_name'                     =>  $data[$i][4], //PART_NAME
                //     'revision_number'               =>  $data[$i][5], //PART_VER
                //     'inspection_reason'             =>  $data[$i][7], //INSP_REASON
                //     'die_class'                     =>  $data[$i][9], //DIE_CLASS
                //     'model_name'                    =>  $data[$i][10], //MODEL
                //     'delivery_date'                 =>  $data[$i][15], //D_DELV_DATE
                //     'inspector_id'                  =>  $data[$i][16], //INSPECTOR_ID
                //     'judgment'                      =>  $data[$i][17], //JUDG
                //     'trial_number'                  =>  $data[$i][18], //TRIAL_NUM
                //     'inspection_actual_time'        =>  $data[$i][20], //INSP_ACT_TIME
                //     'inspection_required_time'      =>  $data[$i][21], //INSP_REQ_TIME
                //     'plan_start_date'               =>  $data[$i][22], //PLAN_START_DATE
                //     'plan_end_date'                 =>  $data[$i][23], //PLAN_END_DATE
                //     'actual_end_date'               =>  $data[$i][24] //ACT_END_DATE
                // ];
            }

            $logs = 'Trial Ledger has been reload';

            $store_trial_ledger = $TrialLedger->storeTrialLedger($datas);
        }
        
        ActivityLog::activityLog($logs, Session::get('name'));

        return 
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $store_trial_ledger
        ];
    }
}
