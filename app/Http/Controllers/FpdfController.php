<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \setasign\Fpdi\Fpdi;
use App\TrialChecksheet;

class FpdfController extends Controller
{
    public function pdfTest($datax)
    {
        $pdf = new \setasign\Fpdi\Fpdi();
        // folder name 
        $folder_name = $datax['folder_name'];
        
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
        
        return $pdf->Output($location.'second_page.pdf', 'F');
        exit;
    }

    public function secondPage($data)
    {
        dd($data);
        // return $data;
        // return explode(' ', $data['approval']['inspect_datetime']);
        $pdf = new Fpdi('P', 'mm', [215.9, 300]);

        $pdf->setSourceFile(storage_path('app/public/second_page/second_page.pdf'));
        $template = $pdf->importPage(1);
        $pdf->AddPage();
        $pdf->useTemplate($template);
        
        $pdf->SetFont('Times');
        $pdf->SetFontSize(11);

        $date_finished = explode(" ", $data['checksheet_details']['date_finished']);
        // date
        $pdf->SetXY(180, 13);
        $pdf->Write(0, $date_finished[0]);

        // supplier
        $pdf->SetXY(105, 23);
        $pdf->Write(0, $data['checksheet_details']['supplier_name']);

        // part number
        $pdf->SetXY(43, 30);
        $pdf->Write(0, $data['checksheet_details']['part_number']);

        // part name
        $pdf->SetXY(43, 38);
        $pdf->Write(0, $data['checksheet_details']['part_name']);

        // revision number
        $pdf->SetXY(95, 38);
        $pdf->Write(0, $data['checksheet_details']['revision_number']);

        $pdf->SetFont('Times');
        $pdf->SetFontSize(9);

        // inspect by
        $pdf->SetXY(143, 32);
        $pdf->MultiCell(21,3,$data['approval']['inspect_by'],0,'C');

        $inspect_datetime = explode(" ", $data['approval']['inspect_datetime']);
        $pdf->SetXY(143, 38);
        $pdf->MultiCell(21,3, $inspect_datetime[0],0,'C');

        // evaluated by
        $pdf->SetXY(164, 32);
        $pdf->MultiCell(21,3,$data['approval']['evaluated_by'],0,'C');

        $evaluated_datetime = explode(" ", $data['approval']['evaluated_datetime']);
        $pdf->SetXY(164, 38);
        $pdf->MultiCell(21,3, $evaluated_datetime[0],0,'C');

        // approved by
        $pdf->SetXY(184, 32);
        $pdf->MultiCell(21,3,$data['approval']['approved_by'],0,'C');

        $approved_datetime = explode(" ", $data['approval']['approved_datetime']);
        $pdf->SetXY(184, 38);
        $pdf->MultiCell(21,3, $approved_datetime[0],0,'C');

        $circle = storage_path('app/public/second_page/circle.png');
        for ($i=0; $i < count($data['details_data']); $i++) 
        {
            $pdf->SetFont('Times');
            $pdf->SetFontSize(6);
            $date_finished = explode(" ", $data['details_data'][$i]['date_finished']);

            if ($i === 0) 
            {
                $pdf->SetXY(75, 53);
                $pdf->Write(0, $data['details_data'][$i]['trial_number']);
                $pdf->SetXY(80, 53);
                $pdf->Write(0, $date_finished[0]);
                $pdf->SetXY(99, 53);
                $pdf->Write(0, $data['details_data'][$i]['revision_number']);

                if ($data['details_data'][$i]['judgment'] === 'GOOD') 
                    $pdf->Image($circle,81,53, 10);
                else
                    $pdf->Image($circle,94,53, 10);
            }
            else if($i === 1)
            {
                $pdf->SetXY(111, 53);
                $pdf->Write(0, $data['details_data'][$i]['trial_number']);
                $pdf->SetXY(116, 53);
                $pdf->Write(0, $date_finished[0]);
                $pdf->SetXY(135, 53);
                $pdf->Write(0, $data['details_data'][$i]['revision_number']);

                if ($data['details_data'][$i]['judgment'] === 'GOOD') 
                    $pdf->Image($circle,116,53, 10);
                else
                    $pdf->Image($circle,129,53, 10);
            }
        }

        $increment = 76;

        
        // for ($i=0; $i < count($data['items'][0]); $i++) 
        // { 
        //     switch ($data['items'][0][$i]['tools']) 
        //     {
        //         case 'Caliper':
        //             $tools = 'DC';
        //             break;
        //         case 'Height Gauge':
        //             $tools = 'HG';
        //             break;
        //         case 'Dial Test Indicator':
        //             $tools = 'DI';
        //             break;
        //         case 'Protractor':
        //             $tools = 'PR';
        //             break;
        //         case 'Plug Guage':
        //             $tools = 'PLG';
        //             break;
        //         case 'Pin Gauge':
        //             $tools = 'PG';
        //             break;
        //         case 'Dial Gauge':
        //             $tools = 'DG';
        //             break;
        //         case 'Visual Inspection':
        //             $tools = 'VSL';
        //             break;
        //         case 'Micrometer':
        //             $tools = 'DM';
        //             break;
        //         case 'Projector':
        //             $tools = 'PJ';
        //             break;   
        //         case 'Multimeter':
        //             $tools = 'MM';
        //             break;
        //         case 'Torque Meter':
        //             $tools = 'TM';
        //             break;
        //         case 'Screw Torque Meter':
        //             $tools = 'ST';
        //             break;
        //         case 'CMM':
        //             $tools = 'CMM';
        //             break;
        //         case 'Gear Test':
        //             $tools = 'GT';
        //             break;
        //         case 'Microscope':
        //             $tools = 'MP';
        //             break;
        //         case 'Laser Scan':
        //             $tools = 'LS';
        //             break;
        //         case 'R Gauge':
        //             $tools = 'RG';
        //             break;
        //         case 'Bore Gauge':
        //             $tools = 'BG';
        //             break;
        //         case 'Depth Gauge':
        //             $tools = 'DPG';
        //             break;
        //         default:
        //             $data['items'][0][$i]['tools'];
        //             break;
        //     }

        //     $pdf->SetXY(37, $increment);
        //     $pdf->MultiCell(7,6, $tools,0,'C');

        //     $pdf->SetXY(53, $increment);
        //     $pdf->MultiCell(16,6, $data['items'][0][$i]['specification'],0,'C');

        //     $increment+= 5.7;
        // }

        
        // $var = stripslashes($data['checksheet_details']['supplier_name']);
        // $var = iconv('UTF-8', 'windows-1252', $var);

        // $dateOnly = explode(" ", $data['checksheet_details']['date_finished']);

        // // HEADER DATA
        // $pdf->AddFont('Japanese', '', 'Japanese.php');
        // $pdf->SetFont('Japanese');
        // $pdf->SetTextColor(0, 0, 0);
        // $pdf->SetXY(110, 23);
        // // $pdf->Write(0, mb_convert_encoding('(ｶﾌﾞ)ｵｵﾃ', 'UTF-8', 'html-entities') );
        // // $pdf->Write(0, iconv('UTF-8', 'SJIS', '(ｶﾌﾞ)ｵｵﾃ') );
        // $pdf->Write(0, '(ｶﾌﾞ)ｵｵﾃ');
        // $pdf->SetFont('Times');
        // $pdf->SetXY(180, 13);
        // $pdf->Write(0, $dateOnly[0]);
        // $pdf->SetXY(48, 30);
        // $pdf->Write(0, $data['checksheet_details']['part_number']);
        // $pdf->SetXY(48, 38);
        // $pdf->Write(0, $data['checksheet_details']['part_name']);
        // $pdf->SetXY(94, 38);
        // $pdf->Write(0, $data['checksheet_details']['revision_number']);
        // $pdf->SetXY(120, 38);
        // $pdf->Write(0, 'Unit Name');
        // $pdf->SetXY(147, 33);
        // $pdf->Write(0, $data['approval']['inspect_by']); //$data['approval']['inspect_by']
        // $pdf->SetFontSize(7);
        // $pdf->SetXY(163, 33);
        // $pdf->Write(0, $data['approval']['inspect_datetime']); //$data['approval']['inspect_datetime']
        // $pdf->SetFontSize(12);
        // $pdf->SetXY(185, 33);
        // $pdf->Write(0, 'PIRMA'); //$data['approval']['approved_datetime']

        // // Important item and NG item
        // $pdf->SetFontSize(10);
        // $pdf->SetXY(74, 53);
        // // $pdf->Write(0, $data['checksheets'][0]['trial_number']);
        // $pdf->SetFontSize(8);
        // $pdf->SetXY(78, 53);
        // $pdf->Write(0, $dateOnly[0]); //$data['checksheet_details']['date_finished']
        // $pdf->SetFontSize(10);
        // $pdf->SetXY(97, 53);
        // $pdf->Write(0, $data['checksheet_details']['revision_number']);
        // // Trial 2
        // $pdf->SetXY(110, 53);
        // $pdf->Write(0, $data['checksheet_details']['trial_number']);
        // $pdf->SetXY(118, 53);
        // $pdf->Write(0, 'Date2'); //$data['checksheet_details']['date_finished']
        // $pdf->SetXY(133, 53);
        // $pdf->Write(0, $data['checksheet_details']['revision_number']);
        // // Trial 3
        // $pdf->SetXY(145, 53);
        // $pdf->Write(0, $data['checksheet_details']['trial_number']);
        // $pdf->SetXY(154, 53);
        // $pdf->Write(0, 'Date3'); //$data['checksheet_details']['date_finished']
        // $pdf->SetXY(169, 53);
        // $pdf->Write(0, $data['checksheet_details']['revision_number']);
        // $pdf->SetXY(74, 65);
        // $pdf->Write(0, 'Data1');
        // $pdf->SetXY(110, 65);
        // $pdf->Write(0, 'Data2');
        // $pdf->SetXY(145, 65);
        // $pdf->Write(0, 'Data3');

        // $pdf->SetFontSize(10);
        // $vertical = 79;
        // for ($i=0; $i < count($data['checksheets']); $i++) 
        // { 
        //     $pdf->SetXY(26, $vertical);
        //     $pdf->Write(0, '-');

        //     $pdf->SetXY(36, $vertical);
        //     $pdf->Write(0, $data['checksheets'][$i]['tools']);

        //     $pdf->SetXY(44, $vertical);
        //     $pdf->Write(0, $data['checksheets'][$i]['coordinates']);

        //     $pdf->SetXY(59, $vertical);
        //     $pdf->Write(0, $data['checksheets'][$i]['specification']);

        //     // Trial 1 Difference Value
        //     $pdf->SetXY(73, $vertical);
        //     $pdf->Write(0, '-');
            
        //     // // Trial 2 Difference Value
        //     // $pdf->SetXY(108, $vertical);
        //     // $pdf->Write(0, '-');

        //     // // Trial 3 Difference Value
        //     // $pdf->SetXY(155, $vertical);
        //     // $pdf->Write(0, '-');

        //     // Trial 1 judgment
        //     $pdf->SetXY(83, $vertical);
        //     $pdf->Write(0, $data['checksheets'][$i]['judgment']);

        //     // // Trial 2 judgment
        //     // $pdf->SetXY(119, $vertical);
        //     // $pdf->Write(0, '-');

        //     // // Trial 3 judgment
        //     // $pdf->SetXY(155, $vertical);
        //     // $pdf->Write(0, '-');

        //     // Trial 1 Note
        //     $pdf->SetXY(93, $vertical);
        //     $pdf->Write(0, '-');

        //     // // Trial 2 Note
        //     // $pdf->SetXY(130, $vertical);
        //     // $pdf->Write(0, '-');

        //     // // Trial 3 Note
        //     // $pdf->SetXY(167, $vertical);
        //     // $pdf->Write(0, '-');

        //     // // Malaking Note
        //     // $pdf->SetXY(187, $vertical);
        //     // $pdf->Write(0, '-');

        //     $vertical+= 5.7;
        // }

        $pdf->Output();
        exit;
    }
}
