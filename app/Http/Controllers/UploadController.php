<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\UploadImport;
use Maatwebsite\Excel\Facades\Excel;


class UploadController extends Controller
{
    public function upload($file)
    {
        $import = new UploadImport();

        Excel::import($import, $file);
        $data =  $import->get_data();

        $response = $data;

        return $response;
    }
}
