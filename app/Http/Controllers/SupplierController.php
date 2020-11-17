<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Supplier;

class SupplierController extends Controller
{
    public function storeSupplier(UploadController $upload,Supplier $supplier)
    {
        // $file = '\\\10.164.20.211\uploads\Copy of Supplier code 20201020(2165).xlsx';
        $file = 'F:\TIS\supplier.xlsx';

        $sheet = 0;
        $data = $upload->upload($file,$sheet);

        for($i = 1; $i < count($data); $i ++)
        {
            $result[] = [
                'supplier_code'   =>  $data[$i][0],
                'supplier_name'   =>  $data[$i][1]
            ];
        }

        return $supplier->storeSupplier($result);
    }
}
