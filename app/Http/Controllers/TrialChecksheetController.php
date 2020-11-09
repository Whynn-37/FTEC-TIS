<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TrialLedger;

class TrialChecksheetController extends Controller
{
    public function loadPartnumber(TrialLedger $trial_ledger, request $request)
    {
        $message = 'No part number';
        $status = 'Error';
        
        $result = $trial_ledger->loadPartnumber($request->id);

        if (count($result) !== 0) {
            $message = 'Part number loaded successfully';
            $status = 'Success';
        }

        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ]);
    }

    public function loadRevision(TrialLedger $trial_ledger, request $request)
    {
        $message = 'No revision';
        $status = 'Error';

        $result = $trial_ledger->loadRevision($request->part_number);

        if (count($result) !== 0) {
            $message = 'Revision number loaded successfully';
            $status = 'Success';
        }

        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ]);
    }

    public function loadTrialStage(TrialLedger $trial_ledger, request $request)
    {
        $message = 'No Trial number';
        $status = 'Error';

        $data = [
            'revision_number'   =>  $request->revision_number,
            'part_number'       =>  $request->part_number
        ];

        $result = $trial_ledger->loadTrialStage($data);

        if (count($result) !== 0) {
            $message = 'Trial number loaded successfully';
            $status = 'Success';
        }
        

        return response()->json([
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ]);
    }
}