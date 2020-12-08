<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \setasign\Fpdi\Fpdi;
use App\TrialChecksheet;

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

    public function secondPage($data)
    {
        // dd($data);
        // return $data;
        // return explode(' ', $data['approval']['inspect_datetime']);
        $pdf = new Fpdi('P', 'mm', [215.9, 300]);

        $pdf->setSourceFile(storage_path('app/public/second_page/second_page.pdf'));
        $test = $pdf->importPage(1);
        $pdf->AddPage();
        $pdf->useTemplate($test);

        // $var = stripslashes($data['checksheet_details']['supplier_name']);
        // $var = iconv('UTF-8', 'windows-1252', $var);

        $dateOnly = explode(" ", $data['checksheet_details']['date_finished']);

        // HEADER DATA
        $pdf->AddFont('Japanese', '', 'Japanese.php');
        $pdf->SetFont('Japanese');
        $pdf->SetTextColor(0, 0, 0);
        $pdf->SetXY(110, 23);
        // $pdf->Write(0, mb_convert_encoding('(ｶﾌﾞ)ｵｵﾃ', 'UTF-8', 'html-entities') );
        // $pdf->Write(0, iconv('UTF-8', 'SJIS', '(ｶﾌﾞ)ｵｵﾃ') );
        $pdf->Write(0, '(ｶﾌﾞ)ｵｵﾃ');
        $pdf->SetFont('Times');
        $pdf->SetXY(180, 13);
        $pdf->Write(0, $dateOnly[0]);
        $pdf->SetXY(48, 30);
        $pdf->Write(0, $data['checksheet_details']['part_number']);
        $pdf->SetXY(48, 38);
        $pdf->Write(0, $data['checksheet_details']['part_name']);
        $pdf->SetXY(94, 38);
        $pdf->Write(0, $data['checksheet_details']['revision_number']);
        $pdf->SetXY(120, 38);
        $pdf->Write(0, 'Unit Name');
        $pdf->SetXY(147, 33);
        $pdf->Write(0, $data['approval']['inspect_by']); //$data['approval']['inspect_by']
        $pdf->SetFontSize(7);
        $pdf->SetXY(163, 33);
        $pdf->Write(0, $data['approval']['inspect_datetime']); //$data['approval']['inspect_datetime']
        $pdf->SetFontSize(12);
        $pdf->SetXY(185, 33);
        $pdf->Write(0, 'PIRMA'); //$data['approval']['approved_datetime']

        // Important item and NG item
        $pdf->SetFontSize(10);
        $pdf->SetXY(74, 53);
        $pdf->Write(0, $data['checksheets'][0]['trial_number']);
        $pdf->SetFontSize(8);
        $pdf->SetXY(78, 53);
        $pdf->Write(0, $dateOnly[0]); //$data['checksheet_details']['date_finished']
        $pdf->SetFontSize(10);
        $pdf->SetXY(97, 53);
        $pdf->Write(0, $data['checksheet_details']['revision_number']);
        // Trial 2
        $pdf->SetXY(110, 53);
        $pdf->Write(0, $data['checksheet_details']['trial_number']);
        $pdf->SetXY(118, 53);
        $pdf->Write(0, 'Date2'); //$data['checksheet_details']['date_finished']
        $pdf->SetXY(133, 53);
        $pdf->Write(0, $data['checksheet_details']['revision_number']);
        // Trial 3
        $pdf->SetXY(145, 53);
        $pdf->Write(0, $data['checksheet_details']['trial_number']);
        $pdf->SetXY(154, 53);
        $pdf->Write(0, 'Date3'); //$data['checksheet_details']['date_finished']
        $pdf->SetXY(169, 53);
        $pdf->Write(0, $data['checksheet_details']['revision_number']);
        $pdf->SetXY(74, 65);
        $pdf->Write(0, 'Data1');
        $pdf->SetXY(110, 65);
        $pdf->Write(0, 'Data2');
        $pdf->SetXY(145, 65);
        $pdf->Write(0, 'Data3');

        $pdf->SetFontSize(10);
        $vertical = 79;
        for ($i=0; $i < count($data['checksheets']); $i++) 
        { 
            $pdf->SetXY(26, $vertical);
            $pdf->Write(0, '-');

            $pdf->SetXY(36, $vertical);
            $pdf->Write(0, $data['checksheets'][$i]['tools']);

            $pdf->SetXY(44, $vertical);
            $pdf->Write(0, $data['checksheets'][$i]['coordinates']);

            $pdf->SetXY(59, $vertical);
            $pdf->Write(0, $data['checksheets'][$i]['specification']);

            // Trial 1 Difference Value
            $pdf->SetXY(73, $vertical);
            $pdf->Write(0, '-');
            
            // // Trial 2 Difference Value
            // $pdf->SetXY(108, $vertical);
            // $pdf->Write(0, '-');

            // // Trial 3 Difference Value
            // $pdf->SetXY(155, $vertical);
            // $pdf->Write(0, '-');

            // Trial 1 judgment
            $pdf->SetXY(83, $vertical);
            $pdf->Write(0, $data['checksheets'][$i]['judgment']);

            // // Trial 2 judgment
            // $pdf->SetXY(119, $vertical);
            // $pdf->Write(0, '-');

            // // Trial 3 judgment
            // $pdf->SetXY(155, $vertical);
            // $pdf->Write(0, '-');

            // Trial 1 Note
            $pdf->SetXY(93, $vertical);
            $pdf->Write(0, '-');

            // // Trial 2 Note
            // $pdf->SetXY(130, $vertical);
            // $pdf->Write(0, '-');

            // // Trial 3 Note
            // $pdf->SetXY(167, $vertical);
            // $pdf->Write(0, '-');

            // // Malaking Note
            // $pdf->SetXY(187, $vertical);
            // $pdf->Write(0, '-');

            $vertical+= 5.7;
        }

        $pdf->Output();
        exit;
    }
}
