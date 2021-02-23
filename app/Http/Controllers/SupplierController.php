<?php

namespace App\Http\Controllers;

use App\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Helpers\ActivityLog;
use Session;
class SupplierController extends Controller
{
    public function storeSupplier(UploadController $upload,Supplier $Supplier,Request $Request)
    {
        $file = $Request->file('upload_file');

        $sheet = 0;
    
        $status = 'Error';
        $message = 'No File';
        $result = [];

        if (file_exists($file)) 
        {
            $file_extension = $Request->file('upload_file')->getClientOriginalExtension();
            
            if($file_extension === 'csv' || $file_extension === 'xlsx')
            { 
                $data = $upload->upload($file, $sheet);

                if($data[0][0] === '払出先コード' && 
                   $data[0][1] === '払出先名' && 
                   $data[0][2] === '備考' &&
                   $data[0][3] === '半角カナ名称' &&
                   $data[0][4] === '全角名称')
                {
                    for($i = 1; $i < count($data); $i ++)
                    {
                        $result[] = 
                        [
                            'supplier_code'   =>  $data[$i][0],
                            'supplier_name'   =>  $data[$i][1]
                        ];
                    }

                    $result = $Supplier->storeSupplier($result);

                    $status = 'Error';
                    $message = 'Not Successfully Save';

                    if ($result) 
                    {
                        $status = 'Success';
                        $message = 'Successfully Save';
                    }
                }
                else
                {
                    $status = 'Error File';
                    $message = 'Incorrect File';
                }
            }
            else
            {
                $status = 'Error File';
                $message = 'Invalid File';
            }
        }
        else
        {
            $status = 'No File';
            $message = 'No File Selected';
        }

        ActivityLog::activityLog($message, Session::get('name'));
        
        return
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

    public function loadSupplier(Supplier $Supplier)
    {
        $result = $Supplier->loadSupplier();
        
        $status = 'Error';
        $message = 'Not Successfully Save';

        if ($result) 
        {
            $status = 'Success';
            $message = 'Successfully Save';
        }

        return
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

    public function updateSupplier(Request $Request,Supplier $Supplier)
    {
        $supplier_code = $Request->supplier_code;
        $supplier_name = $Request->supplier_name;

        $validator = Validator::make($Request->all(), 
        [
            'supplier_code'         => 'required',
            'supplier_code'         => 'required',
        ]);

        if ($validator->fails()) 
        {
            $data = 
            [
                'response'  => "warning",
                'value'     => $validator->errors(),
            ];
        } 
        else 
        {
            //$data = $Request->except('_token','txt_supplier_id');
            $data = 
            [
                'supplier_code'     => $supplier_code,
                'supplier_name'     => $supplier_name,
            ];

            $result = $Supplier->updateOrCreateSupplier($data);     
        }

        $status = 'Error';
        $message = 'Not Successfully Save';

        if ($result) 
        {
            $status = 'Success';
            $message = 'Successfully Save';
        }

        ActivityLog::activityLog($message . ' - Supplier Code : ' . $supplier_code . ' - Supplier Name : ' . $supplier_name, Session::get('name'));

        return
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

    public function deleteSupplier(Request $Request,Supplier $Supplier)
    {
        $id =  $Request->id;

        $result = $Supplier->deleteSupplier($id); 

        $status = 'Error';
        $message = 'Not Successfully Save';
    
        if ($result) 
        {
            $status = 'Success';
            $message = 'Successfully Deleted';
        }

        ActivityLog::activityLog($message . ' - Deleted Id : ' . $id, Session::get('name'));
    
        return
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }
}