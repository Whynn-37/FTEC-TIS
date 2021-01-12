<?php

namespace App\Http\Controllers;

use App\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class SupplierController extends Controller
{
    public function storeSupplier(UploadController $upload,Supplier $Supplier)
    {
        // $file = '\\\10.164.20.211\uploads\Copy of Supplier code 20201020(2165).xlsx';
        // $file = 'C:\TIS\supplier.xlsx';

        // $file = 'F:\TIS\supplier.xlsx';
        $file = 'F:\TIS\supplier.xlsx';
        // $file = 'D:\supplier.xlsx';
        $sheet = 0;

        $status = 'Error';
        $message = 'No File';
        $result = [];

        if (file_exists($file)) 
        {
            $data = $upload->upload($file, $sheet);

            for($i = 1; $i < count($data); $i ++)
            {
                $result[] = [
                    'supplier_code'   =>  $data[$i][0],
                    'supplier_name'   =>  $data[$i][1]
                ];
            }

            $result = $Supplier->storeSupplier($result);

            $status = 'Error';
            $message = 'Npt Successfully Save';

            if ($result) 
            {
                $status = 'Success';
                $message = 'Successfully Save';
            }
        }

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

        return
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }

    public function deleteSupplier($id,Supplier $Supplier)
    {
        $result = $Supplier->deleteSupplier($id); 

        $status = 'Error';
        $message = 'Not Successfully Save';
    
        if ($result) 
        {
            $status = 'Success';
            $message = 'Successfully Deleted';
        }
    
        return
        [
            'status'    =>  $status,
            'message'   =>  $message,
            'data'      =>  $result
        ];
    }
}
