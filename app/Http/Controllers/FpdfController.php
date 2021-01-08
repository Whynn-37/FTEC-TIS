<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Attachment;
use \setasign\Fpdi\Fpdi;
use App\TrialChecksheet;

class FpdfController extends Controller
{
    public function mergeFile($datax, $data)
    {
        // $pdf = new \setasign\Fpdi\Fpdi();
        $pdf = new Fpdi('P', 'mm', [215.9, 300]);

        // folder name 
        $folder_name = $datax['folder_name'];
        
        // attachment file 
        $files =$datax['file_name'];
        $location = storage_path('app/public/'.$folder_name.'/');

        if ($data['checksheet_details']['judgment'] === 'NG')
        {
            $checksheet = [];

            if (count($data['items']) !== 0) 
            {
                for ($a=0; $a < count($data['datas']); $a++) 
                { 
                    for ($b=0; $b < count($data['datas'][$a]); $b++) 
                    { 
                        if (empty($data['datas'][$a][$b])) 
                        {
                            $datas[$a][] = 
                            [
                                'data'          => '',
                                'judgment'      => '',
                                'remarks'       => '',
                            ];
                        }

                        for ($c=0; $c < count($data['items'][0]); $c++) 
                        {
                            if ($b === $c) 
                            {
                                for ($e=0; $e < count($data['datas'][$a][$b]); $e++) 
                                { 
                                    if ($e === 0) 
                                    {
                                        $items[$a][] = 
                                        [
                                            'tools'         => $data['items'][0][$c]['tools'],
                                            'specification' => $data['items'][0][$c]['specification'],
                                            'upper_limit'   => $data['items'][0][$c]['upper_limit'],
                                            'lower_limit'   => $data['items'][0][$c]['lower_limit'],
                                            'coordinates'   => $data['datas'][$a][$b][$e]['coordinates'],
                                        ];
                                    }
                                    else
                                    {
                                        $items[$a][] = 
                                        [
                                            'tools'         => '',
                                            'specification' => '',
                                            'upper_limit'   => '',
                                            'lower_limit'   => '',
                                            'coordinates'   => $data['datas'][$a][$b][$e]['coordinates'],
                                        ];
                                    }   

                                    $datas[$a][] = 
                                    [
                                        'data'          => explode(",",$data['datas'][$a][$b][$e]['data']),
                                        'judgment'      => $data['datas'][$a][$b][$e]['judgment'],
                                        'remarks'       => $data['datas'][$a][$b][$e]['remarks'],
                                    ];
                                }
                            }
                        } 
                    }
                }

                $checksheet =
                [
                    'items' => $items[0],
                    'datas' => $datas
                ];
            }

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
            $pdf->SetFontSize(6);
            $pdf->SetXY(105, 23);
            $pdf->Write(0, $data['checksheet_details']['supplier_name']);

            // part number
            $pdf->SetFontSize(11);
            $pdf->SetXY(43, 30);
            $pdf->Write(0, $data['checksheet_details']['part_number']);

            // part name
            $pdf->SetFontSize(6);
            $pdf->SetXY(43, 38);
            $pdf->Write(0, $data['checksheet_details']['part_name']);

            // revision number
            $pdf->SetFontSize(11);
            $pdf->SetXY(95, 38);
            $pdf->Write(0, $data['checksheet_details']['revision_number']);

            $pdf->SetFont('Times');
            $pdf->SetFontSize(6);

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

            $indicator = 0;

            if (count($checksheet) !== 0) 
            {
                for ($i=0; $i < count($data['details_data']); $i++) 
                { 
                    if ($indicator === 3) 
                    {
                        $indicator = 0;
                    }
                    $indicator++;

                    $pdf->SetFont('Times');
                    $pdf->SetFontSize(6);

                    if ($indicator == 1)
                    {
                        $circle = storage_path('app/public/second_page/circle.png');

                        // trial number
                        $pdf->SetXY(75, 53);
                        $pdf->Write(0, $data['details_data'][$i]['trial_number']);
                        // date
                        $pdf->SetXY(80, 53);
                        $pdf->Write(0, $date_finished[0]);
                        // revision number
                        $pdf->SetXY(99, 53);
                        $pdf->Write(0, $data['details_data'][$i]['revision_number']);
                        // judgment
                        if ($data['details_data'][$i]['judgment'] === 'GOOD') 
                            $pdf->Image($circle,81,53, 10);
                        else
                            $pdf->Image($circle,94,53, 10);

                        $increment = 76;
                        foreach ($checksheet['items'] as $items) 
                        {
                            switch ($items['tools']) 
                            {
                                case 'Caliper':
                                    $tools = 'DC';
                                    break;
                                case 'Height Gauge':
                                    $tools = 'HG';
                                    break;
                                case 'Dial Test Indicator':
                                    $tools = 'DI';
                                    break;
                                case 'Protractor':
                                    $tools = 'PR';
                                    break;
                                case 'Plug Guage':
                                    $tools = 'PLG';
                                    break;
                                case 'Pin Gauge':
                                    $tools = 'PG';
                                    break;
                                case 'Dial Gauge':
                                    $tools = 'DG';
                                    break;
                                case 'Visual Inspection':
                                    $tools = 'VSL';
                                    break;
                                case 'Micrometer':
                                    $tools = 'DM';
                                    break;
                                case 'Projector':
                                    $tools = 'PJ';
                                    break;   
                                case 'Multimeter':
                                    $tools = 'MM';
                                    break;
                                case 'Torque Meter':
                                    $tools = 'TM';
                                    break;
                                case 'Screw Torque Meter':
                                    $tools = 'ST';
                                    break;
                                case 'CMM':
                                    $tools = 'CMM';
                                    break;
                                case 'Gear Test':
                                    $tools = 'GT';
                                    break;
                                case 'Microscope':
                                    $tools = 'MP';
                                    break;
                                case 'Laser Scan':
                                    $tools = 'LS';
                                    break;
                                case 'R Gauge':
                                    $tools = 'RG';
                                    break;
                                case 'Bore Gauge':
                                    $tools = 'BG';
                                    break;
                                case 'Depth Gauge':
                                    $tools = 'DPG';
                                    break;
                                default:
                                    $tools = $items['tools'];
                                    break;
                            }

                            // tools
                            $pdf->SetXY(36, $increment);
                            $pdf->MultiCell(9,6, $tools,0,'C');

                            // coordinates
                            $pdf->SetXY(44, $increment);
                            $pdf->MultiCell(9,6, $items['coordinates'],0,'C');

                            
                            $plus_minus = '';
                            if ($items['specification'] !== null && $items['specification'] !== '') 
                            {
                                $plus_minus = stripslashes(' ±');
                                $plus_minus = iconv('UTF-8', 'windows-1252', $plus_minus);
                            }

                            // specification
                            $pdf->SetXY(53, $increment);
                            $pdf->MultiCell(16,6, $items['specification'] .$plus_minus. substr($items['lower_limit'], 1),0,'C');

                            $increment+= 5.7;
                        }

                        $increment = 76;
                        foreach ($checksheet['datas'][$i] as $datas) 
                        {
                            switch ($datas['judgment']) 
                            {
                                case 'GOOD':
                                    $judgment = 'O';
                                    break;
                                case 'NG':
                                    $judgment = 'X';
                                    break;
                                default:
                                    $judgment = '';
                                    break;
                            }

                            $max = '';
                            $min = '';

                            if ($datas['data'] != '') 
                            {
                                $x = 0;
                                $data_value = [];
                            
                                for ($g = 0; $g < 10; $g++)
                                {                        if($g % 2 == 1)
                                    {   
                                        $data_value[$x]['min'] = floatval($datas['data'][$g]);
                                        $x++;
                                    }
                                    else
                                    {
                                        $data_value[$x]['max'] = floatval($datas['data'][$g]);
                                    }
                                }
                                
                                $minmax = max($data_value);

                                $max = $minmax['max'];
                                $min = $minmax['min'];
                            }
                            
                            // min max
                            $pdf->SetXY(69, $increment);
                            $pdf->MultiCell(13,3, $max,0,'C');
                            $pdf->SetXY(69, $increment+3);
                            $pdf->MultiCell(13,3,$min ,0,'C');

                            // judgment
                            $pdf->SetXY(82, $increment);
                            $pdf->MultiCell(10,6, $judgment,0,'C');

                            // remarks
                            $pdf->SetXY(92, $increment);
                            $pdf->MultiCell(13,6, $datas['remarks'],0,'C');

                            $increment+= 5.7;
                        }
                    }
                    else if ($indicator == 2)
                    {
                        // trial number
                        $pdf->SetXY(111, 53);
                        $pdf->Write(0, $data['details_data'][$i]['trial_number']);
                        // date
                        $pdf->SetXY(116, 53);
                        $pdf->Write(0, $date_finished[0]);
                        // revision number
                        $pdf->SetXY(135, 53);
                        $pdf->Write(0, $data['details_data'][$i]['revision_number']);
                        // judgment
                        if ($data['details_data'][$i]['judgment'] === 'GOOD') 
                            $pdf->Image($circle,116,53, 10);
                        else
                            $pdf->Image($circle,129,53, 10);
                            
                        $increment = 76;
                        foreach ($checksheet['datas'][$i] as $datas) 
                        {
                            switch ($datas['judgment']) 
                            {
                                case 'GOOD':
                                    $judgment = 'O';
                                    break;
                                case 'NG':
                                    $judgment = 'X';
                                    break;
                                default:
                                    $judgment = '';
                                    break;
                            }

                            $max = '';
                            $min = '';

                            if ($datas['data'] != '') 
                            {
                                $x = 0;
                                $data_value = [];
                            
                                for ($g = 0; $g < 10; $g++)
                                {                        if($g % 2 == 1)
                                    {   
                                        $data_value[$x]['min'] = floatval($datas['data'][$g]);
                                        $x++;
                                    }
                                    else
                                    {
                                        $data_value[$x]['max'] = floatval($datas['data'][$g]);
                                    }
                                }

                                $minmax = max($data_value);

                                $max = $minmax['max'];
                                $min = $minmax['min'];
                            }
                            
                            // min max
                            $pdf->SetXY(105, $increment);
                            $pdf->MultiCell(13,3, $max,0,'C');
                            $pdf->SetXY(105, $increment+3);
                            $pdf->MultiCell(13,3, $min,0,'C');
                            
                            // judgment
                            $pdf->SetXY(118, $increment);
                            $pdf->MultiCell(10,6, $judgment,0,'C');

                            $pdf->SetXY(128, $increment);
                            $pdf->MultiCell(13,6, $datas['remarks'],0,'C');

                            $increment+= 5.7;
                        }
                    }
                    else if ($indicator == 3) 
                    {
                        // trial number
                        $pdf->SetXY(146, 53);
                        $pdf->Write(0, $data['details_data'][$i]['trial_number']);
                        // date
                        $pdf->SetXY(152, 53);
                        $pdf->Write(0, $date_finished[0]);
                        // revision number
                        $pdf->SetXY(171, 53);
                        $pdf->Write(0, $data['details_data'][$i]['revision_number']);
                        // judgment
                        if ($data['details_data'][$i]['judgment'] === 'GOOD') 
                            $pdf->Image($circle,152,53, 10);
                        else
                            $pdf->Image($circle,165,53, 10);

                        $increment = 76;
                        foreach ($checksheet['datas'][$i] as $datas) 
                        {
                            switch ($datas['judgment']) 
                            {
                                case 'GOOD':
                                    $judgment = 'O';
                                    break;
                                case 'NG':
                                    $judgment = 'X';
                                    break;
                                default:
                                    $judgment = '';
                                    break;
                            }

                            $max = '';
                            $min = '';

                            if ($datas['data'] != '') 
                            {
                                $x = 0;
                                $data_value = [];
                            
                                for ($g = 0; $g < 10; $g++)
                                {                        if($g % 2 == 1)
                                    {   
                                        $data_value[$x]['min'] = floatval($datas['data'][$g]);
                                        $x++;
                                    }
                                    else
                                    {
                                        $data_value[$x]['max'] = floatval($datas['data'][$g]);
                                    }
                                }

                                $minmax = max($data_value);

                                $max = $minmax['max'];
                                $min = $minmax['min'];
                            }
                            
                            // min max
                            $pdf->SetXY(140, $increment);
                            $pdf->MultiCell(13,3, $max,0,'C');
                            $pdf->SetXY(140, $increment+3);
                            $pdf->MultiCell(13,3, $min,0,'C');
                            
                            // judgment
                            $pdf->SetXY(153, $increment);
                            $pdf->MultiCell(10,6, $judgment,0,'C');

                            $pdf->SetXY(163, $increment);
                            $pdf->MultiCell(13,6, $datas['remarks'],0,'C');

                            $increment+= 5.7;
                        }
                    }
                }
            }
        }
        
        foreach($files as $file)
        {
            $file_type = explode(".", $file);

            if($file_type[1] == 'pdf')
            {
                $pagecount = $pdf->setSourceFile($location.$file);

                for($i = 0; $i <$pagecount; $i++)
                {
                    $pageId = $pdf->importPage($i + 1);
                    
                    $pdf->AddPage();
                    $pdf->useTemplate($pageId);
                }
            }
            else 
            {
                $pdf->AddPage();
                $path = $location.$file;
                $pdf->Image($path,5,100,200);
            }
        }

        $Attachment = new Attachment();
        $merge_data_file = 
        [
            'file_name_merge' => $data['checksheet_details']['part_number']. '-' . $data['checksheet_details']['revision_number'] . '-' . 'T' . $data['checksheet_details']['trial_number'] . '-' . date('Ymd')
        ];

        $Attachment->storeFileMerge($data['checksheet_details']['id'], $merge_data_file);

        
        return $pdf->Output($location.$data['checksheet_details']['part_number']. '-' . $data['checksheet_details']['revision_number'] . '-' . 'T' . $data['checksheet_details']['trial_number'] . '-' . date('Ymd') . '.pdf', 'F');
        exit;
    }

        // public function pdfTest($datax)
    // {
    //     $pdf = new \setasign\Fpdi\Fpdi();
    //     // folder name 
    //     $folder_name = $datax['folder_name'];
        
    //     // attachment file 
    //     $files =$datax['file_name'];
    //     $location = storage_path('app/public/'.$folder_name.'/');
        
    //     foreach($files as $file)
    //     {
    //         $pagecount = $pdf->setSourceFile($location.$file);

    //         for($i = 0; $i <$pagecount; $i++)
    //         {
    //             $pageId = $pdf->importPage($i + 1);
                
    //             $pdf->AddPage();
    //             $pdf->useTemplate($pageId);
    //         }
    //     }
        
    //     return $pdf->Output($location.$folder_name.'.pdf', 'F');
    //     exit;
    // }

//     public function secondPage($data)
//     {
//         $pdf = new Fpdi('P', 'mm', [215.9, 300]);

//         $checksheet = [];

//         if (count($data['items']) !== 0) 
//         {
//             for ($a=0; $a < count($data['datas']); $a++) 
//             { 
//                 for ($b=0; $b < count($data['datas'][$a]); $b++) 
//                 { 
//                     if (empty($data['datas'][$a][$b])) 
//                     {
//                         $datas[$a][] = 
//                         [
//                             'data'          => '',
//                             'judgment'      => '',
//                             'remarks'       => '',
//                         ];
//                     }

//                     for ($c=0; $c < count($data['items'][0]); $c++) 
//                     {
//                         if ($b === $c) 
//                         {
//                             for ($e=0; $e < count($data['datas'][$a][$b]); $e++) 
//                             { 
//                                 if ($e === 0) 
//                                 {
//                                     $items[$a][] = 
//                                     [
//                                         'tools'         => $data['items'][0][$c]['tools'],
//                                         'specification' => $data['items'][0][$c]['specification'],
//                                         'upper_limit'   => $data['items'][0][$c]['upper_limit'],
//                                         'lower_limit'   => $data['items'][0][$c]['lower_limit'],
//                                         'coordinates'   => $data['datas'][$a][$b][$e]['coordinates'],
//                                     ];
//                                 }
//                                 else
//                                 {
//                                     $items[$a][] = 
//                                     [
//                                         'tools'         => '',
//                                         'specification' => '',
//                                         'upper_limit'   => '',
//                                         'lower_limit'   => '',
//                                         'coordinates'   => $data['datas'][$a][$b][$e]['coordinates'],
//                                     ];
//                                 }   

//                                 $datas[$a][] = 
//                                 [
//                                     'data'          => explode(",",$data['datas'][$a][$b][$e]['data']),
//                                     'judgment'      => $data['datas'][$a][$b][$e]['judgment'],
//                                     'remarks'       => $data['datas'][$a][$b][$e]['remarks'],
//                                 ];
//                             }
//                         }
//                     } 
//                 }
//             }

//             $checksheet =
//             [
//                 'items' => $items[0],
//                 'datas' => $datas
//             ];
//         }

//         $pdf->setSourceFile(storage_path('app/public/second_page/second_page.pdf'));
//         $template = $pdf->importPage(1);
//         $pdf->AddPage();
//         $pdf->useTemplate($template);

//         $pdf->SetFont('Times');
//         $pdf->SetFontSize(11);

//         $date_finished = explode(" ", $data['checksheet_details']['date_finished']);
//         // date
//         $pdf->SetXY(180, 13);
//         $pdf->Write(0, $date_finished[0]);

//         // supplier
//         $pdf->SetXY(105, 23);
//         $pdf->Write(0, $data['checksheet_details']['supplier_name']);

//         // part number
//         $pdf->SetXY(43, 30);
//         $pdf->Write(0, $data['checksheet_details']['part_number']);

//         // part name
//         $pdf->SetXY(43, 38);
//         $pdf->Write(0, $data['checksheet_details']['part_name']);

//         // revision number
//         $pdf->SetXY(95, 38);
//         $pdf->Write(0, $data['checksheet_details']['revision_number']);

//         $pdf->SetFont('Times');
//         $pdf->SetFontSize(6);

//         // inspect by
//         $pdf->SetXY(143, 32);
//         $pdf->MultiCell(21,3,$data['approval']['inspect_by'],0,'C');

//         $inspect_datetime = explode(" ", $data['approval']['inspect_datetime']);
//         $pdf->SetXY(143, 38);
//         $pdf->MultiCell(21,3, $inspect_datetime[0],0,'C');

//         // evaluated by
//         $pdf->SetXY(164, 32);
//         $pdf->MultiCell(21,3,$data['approval']['evaluated_by'],0,'C');

//         $evaluated_datetime = explode(" ", $data['approval']['evaluated_datetime']);
//         $pdf->SetXY(164, 38);
//         $pdf->MultiCell(21,3, $evaluated_datetime[0],0,'C');

//         // approved by
//         $pdf->SetXY(184, 32);
//         $pdf->MultiCell(21,3,$data['approval']['approved_by'],0,'C');

//         $approved_datetime = explode(" ", $data['approval']['approved_datetime']);
//         $pdf->SetXY(184, 38);
//         $pdf->MultiCell(21,3, $approved_datetime[0],0,'C');

//         $indicator = 0;

//         if (count($checksheet) !== 0) 
//         {
//             for ($i=0; $i < count($data['details_data']); $i++) 
//             { 
//                 if ($indicator === 3) 
//                 {
//                     $indicator = 0;
//                 }
//                 $indicator++;

//                 $pdf->SetFont('Times');
//                 $pdf->SetFontSize(9);

//                 if ($indicator == 1)
//                 {
                    
//                     $circle = storage_path('app/public/second_page/circle.png');

//                     // trial number
//                     $pdf->SetXY(75, 53);
//                     $pdf->Write(0, $data['details_data'][$i]['trial_number']);
//                     // date
//                     $pdf->SetXY(80, 53);
//                     $pdf->Write(0, $date_finished[0]);
//                     // revision number
//                     $pdf->SetXY(99, 53);
//                     $pdf->Write(0, $data['details_data'][$i]['revision_number']);
//                     // judgment
//                     if ($data['details_data'][$i]['judgment'] === 'GOOD') 
//                         $pdf->Image($circle,81,53, 10);
//                     else
//                         $pdf->Image($circle,94,53, 10);

//                     $increment = 76;
//                     foreach ($checksheet['items'] as $items) 
//                     {
//                         switch ($items['tools']) 
//                         {
//                             case 'Caliper':
//                                 $tools = 'DC';
//                                 break;
//                             case 'Height Gauge':
//                                 $tools = 'HG';
//                                 break;
//                             case 'Dial Test Indicator':
//                                 $tools = 'DI';
//                                 break;
//                             case 'Protractor':
//                                 $tools = 'PR';
//                                 break;
//                             case 'Plug Guage':
//                                 $tools = 'PLG';
//                                 break;
//                             case 'Pin Gauge':
//                                 $tools = 'PG';
//                                 break;
//                             case 'Dial Gauge':
//                                 $tools = 'DG';
//                                 break;
//                             case 'Visual Inspection':
//                                 $tools = 'VSL';
//                                 break;
//                             case 'Micrometer':
//                                 $tools = 'DM';
//                                 break;
//                             case 'Projector':
//                                 $tools = 'PJ';
//                                 break;   
//                             case 'Multimeter':
//                                 $tools = 'MM';
//                                 break;
//                             case 'Torque Meter':
//                                 $tools = 'TM';
//                                 break;
//                             case 'Screw Torque Meter':
//                                 $tools = 'ST';
//                                 break;
//                             case 'CMM':
//                                 $tools = 'CMM';
//                                 break;
//                             case 'Gear Test':
//                                 $tools = 'GT';
//                                 break;
//                             case 'Microscope':
//                                 $tools = 'MP';
//                                 break;
//                             case 'Laser Scan':
//                                 $tools = 'LS';
//                                 break;
//                             case 'R Gauge':
//                                 $tools = 'RG';
//                                 break;
//                             case 'Bore Gauge':
//                                 $tools = 'BG';
//                                 break;
//                             case 'Depth Gauge':
//                                 $tools = 'DPG';
//                                 break;
//                             default:
//                                 $tools = $items['tools'];
//                                 break;
//                         }

//                         // tools
//                         $pdf->SetXY(37, $increment);
//                         $pdf->MultiCell(7,6, $tools,0,'C');

//                         // coordinates
//                         $pdf->SetXY(44, $increment);
//                         $pdf->MultiCell(9,6, $items['coordinates'],0,'C');

                        
//                         $plus_minus = '';
//                         if ($items['specification'] !== null && $items['specification'] !== '') 
//                         {
//                             $plus_minus = stripslashes(' ±');
//                             $plus_minus = iconv('UTF-8', 'windows-1252', $plus_minus);
//                         }

//                         // specification
//                         $pdf->SetXY(53, $increment);
//                         $pdf->MultiCell(16,6, $items['specification'] .$plus_minus. substr($items['lower_limit'], 1),0,'C');

//                         $increment+= 5.7;
//                     }

//                     $increment = 76;
//                     foreach ($checksheet['datas'][$i] as $datas) 
//                     {
//                         switch ($datas['judgment']) 
//                         {
//                             case 'GOOD':
//                                 $judgment = 'O';
//                                 break;
//                             case 'NG':
//                                 $judgment = 'X';
//                                 break;
//                             default:
//                                 $judgment = '';
//                                 break;
//                         }

//                         $max = '';
//                         $min = '';

//                         if ($datas['data'] != '') 
//                         {
//                             $x = 0;
//                             $data_value = [];
                        
//                             for ($g = 0; $g < 10; $g++)
//                             {                        if($g % 2 == 1)
//                                 {   
//                                     $data_value[$x]['min'] = floatval($datas['data'][$g]);
//                                     $x++;
//                                 }
//                                 else
//                                 {
//                                     $data_value[$x]['max'] = floatval($datas['data'][$g]);
//                                 }
//                             }
                            
//                             $minmax = max($data_value);

//                             $max = $minmax['max'];
//                             $min = $minmax['min'];
//                         }
                        
//                         // min max
//                         $pdf->SetXY(69, $increment);
//                         $pdf->MultiCell(13,3, $max,0,'C');
//                         $pdf->SetXY(69, $increment+3);
//                         $pdf->MultiCell(13,3,$min ,0,'C');

//                         // judgment
//                         $pdf->SetXY(82, $increment);
//                         $pdf->MultiCell(10,6, $judgment,0,'C');

//                         // remarks
//                         $pdf->SetXY(92, $increment);
//                         $pdf->MultiCell(13,6, $datas['remarks'],0,'C');

//                         $increment+= 5.7;
//                     }
//                 }
//                 else if ($indicator == 2)
//                 {
//                     // trial number
//                     $pdf->SetXY(111, 53);
//                     $pdf->Write(0, $data['details_data'][$i]['trial_number']);
//                     // date
//                     $pdf->SetXY(116, 53);
//                     $pdf->Write(0, $date_finished[0]);
//                     // revision number
//                     $pdf->SetXY(135, 53);
//                     $pdf->Write(0, $data['details_data'][$i]['revision_number']);
//                     // judgment
//                     if ($data['details_data'][$i]['judgment'] === 'GOOD') 
//                         $pdf->Image($circle,116,53, 10);
//                     else
//                         $pdf->Image($circle,129,53, 10);
                        
//                     $increment = 76;
//                     foreach ($checksheet['datas'][$i] as $datas) 
//                     {
//                         switch ($datas['judgment']) 
//                         {
//                             case 'GOOD':
//                                 $judgment = 'O';
//                                 break;
//                             case 'NG':
//                                 $judgment = 'X';
//                                 break;
//                             default:
//                                 $judgment = '';
//                                 break;
//                         }

//                         $max = '';
//                         $min = '';

//                         if ($datas['data'] != '') 
//                         {
//                             $x = 0;
//                             $data_value = [];
                        
//                             for ($g = 0; $g < 10; $g++)
//                             {                        if($g % 2 == 1)
//                                 {   
//                                     $data_value[$x]['min'] = floatval($datas['data'][$g]);
//                                     $x++;
//                                 }
//                                 else
//                                 {
//                                     $data_value[$x]['max'] = floatval($datas['data'][$g]);
//                                 }
//                             }

//                             $minmax = max($data_value);

//                             $max = $minmax['max'];
//                             $min = $minmax['min'];
//                         }
                        
//                         // min max
//                         $pdf->SetXY(105, $increment);
//                         $pdf->MultiCell(13,3, $max,0,'C');
//                         $pdf->SetXY(105, $increment+3);
//                         $pdf->MultiCell(13,3, $min,0,'C');
                        
//                         // judgment
//                         $pdf->SetXY(118, $increment);
//                         $pdf->MultiCell(10,6, $judgment,0,'C');

//                         $pdf->SetXY(128, $increment);
//                         $pdf->MultiCell(13,6, $datas['remarks'],0,'C');

//                         $increment+= 5.7;
//                     }
//                 }
//                 else if ($indicator == 3) 
//                 {
//                     // trial number
//                     $pdf->SetXY(146, 53);
//                     $pdf->Write(0, $data['details_data'][$i]['trial_number']);
//                     // date
//                     $pdf->SetXY(152, 53);
//                     $pdf->Write(0, $date_finished[0]);
//                     // revision number
//                     $pdf->SetXY(171, 53);
//                     $pdf->Write(0, $data['details_data'][$i]['revision_number']);
//                     // judgment
//                     if ($data['details_data'][$i]['judgment'] === 'GOOD') 
//                         $pdf->Image($circle,152,53, 10);
//                     else
//                         $pdf->Image($circle,165,53, 10);

//                     $increment = 76;
//                     foreach ($checksheet['datas'][$i] as $datas) 
//                     {
//                         switch ($datas['judgment']) 
//                         {
//                             case 'GOOD':
//                                 $judgment = 'O';
//                                 break;
//                             case 'NG':
//                                 $judgment = 'X';
//                                 break;
//                             default:
//                                 $judgment = '';
//                                 break;
//                         }

//                         $max = '';
//                         $min = '';

//                         if ($datas['data'] != '') 
//                         {
//                             $x = 0;
//                             $data_value = [];
                        
//                             for ($g = 0; $g < 10; $g++)
//                             {                        if($g % 2 == 1)
//                                 {   
//                                     $data_value[$x]['min'] = floatval($datas['data'][$g]);
//                                     $x++;
//                                 }
//                                 else
//                                 {
//                                     $data_value[$x]['max'] = floatval($datas['data'][$g]);
//                                 }
//                             }

//                             $minmax = max($data_value);

//                             $max = $minmax['max'];
//                             $min = $minmax['min'];
//                         }
                        
//                         // min max
//                         $pdf->SetXY(140, $increment);
//                         $pdf->MultiCell(13,3, $max,0,'C');
//                         $pdf->SetXY(140, $increment+3);
//                         $pdf->MultiCell(13,3, $min,0,'C');
                        
//                         // judgment
//                         $pdf->SetXY(153, $increment);
//                         $pdf->MultiCell(10,6, $judgment,0,'C');

//                         $pdf->SetXY(163, $increment);
//                         $pdf->MultiCell(13,6, $datas['remarks'],0,'C');

//                         $increment+= 5.7;
//                     }
//                 }
//             }
//         }

//         $pdf->Output();
//         exit;
//     }
}