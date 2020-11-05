<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\UploadController;

class TestController extends Controller
{
    public function test(UploadController $upload)
    {
        $path = '\\\10.164.20.211\uploads\trial_ledger.xlsx';

        $result = $upload->upload($path);
        return $path;
    }
}
