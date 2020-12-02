<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//use Fpdf;

class FpdfController extends Controller
{
    //

    public function pdfTest (){


        // $pdf = app('Fpdf');
        $pdf = new \setasign\Fpdi\Fpdi();

        // $pdf->AddPage();
        // $pdf->SetFont('Arial','B',16);
        // $pdf->Cell(40,10,'Hello World!');


       // folder name 
       $folder_name = '2020-11-19_CA05705-Y341_05';
        // attachment file 
       $files =['material_certification.pdf','numbering_drawing.pdf'];

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
        
        //output
        $pdf->Output();
        exit;

    }
}
