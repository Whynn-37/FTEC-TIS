<?php

namespace App\Http\Controllers;

use App\Supplier;
class SupplierController extends Controller
{
    public function storeSupplier(UploadController $upload,Supplier $Supplier)
    {
        // $file = '\\\10.164.20.211\uploads\Copy of Supplier code 20201020(2165).xlsx';
        $file = 'F:\TIS\supplier.xlsx';
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
}
