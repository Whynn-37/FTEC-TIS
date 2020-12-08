<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//use Fpdf;

class FpdfController extends Controller
{
    public function pdfTest($datax)
    {
        // $pdf = app('Fpdf');
        $pdf = new \setasign\Fpdi\Fpdi();

        // $pdf->AddPage();
        // $pdf->SetFont('Arial','B',16);
        // $pdf->Cell(40,10,'Hello World!');
        // folder name 
        $folder_name = $datax['folder_name']['file_folder'];
        // attachment file 
        $files =$datax['file_name'];
        $location = storage_path('app/public/'.$folder_name.'/');
        
        foreach($files as $file)
        {
            $pagecount = $pdf->setSourceFile($location.$file);

            for($i = 0; $i <$pagecount; $i++)
            {
                $pageId = $pdf->importPage($i + 1);
                
                $pdf->AddPage();
                $pdf->useTemplate($pageId);
            }
        }
        
        $pdf->Output('I');
        exit;
    }
}
