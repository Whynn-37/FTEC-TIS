<?php

namespace App\Http\Controllers;

use App\Imports\UploadImport;
use Maatwebsite\Excel\Facades\Excel;
class UploadController extends Controller
{
    public function upload($file, $sheet = null)
    {
        $import = new UploadImport($sheet);

        Excel::import($import, $file);
        return $import->getData();
    }
}