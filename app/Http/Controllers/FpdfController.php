<?php

namespace App\Http\Controllers;

use App\Attachment;
// use \setasign\Fpdi\Fpdi;
use \setasign\Fpdi\FpdiProtection;
use \setasign\Fpdi\Tcpdf\Fpdi;
class FpdfController extends Controller
{
    public function mergeFile($merge_data, $data)
    {
        // $pdf = new \setasign\Fpdi\Fpdi();
        $pdf = new Fpdi('P', 'mm', [215.9, 300]);
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);

        // folder name 
        $folder_name = $merge_data['folder_name'];
        
        // attachment file 
        $files =$merge_data['file_name'];
        $location = storage_path('app/public/'.$folder_name.'/');

        $circle = storage_path('app/public/second_page/circle.png');

        // if ($data['checksheet_details']['judgment'] === 'NG')
        // {
            $checksheet = []; 
            $datas = [];
            $items = [];

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
                                'hinsei'       => '',
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
                                        if ($data['items'][$a][$c]['id'] !== '') 
                                        {
                                            $items[$a][] = 
                                            [
                                                'tools'         => $data['items'][0][$c]['tools'],
                                                'specification' => $data['items'][0][$c]['specification'],
                                                'upper_limit'   => $data['items'][0][$c]['upper_limit'],
                                                'lower_limit'   => $data['items'][0][$c]['lower_limit'],
                                                'type'          => $data['items'][0][$c]['type'],
                                                'hinsei'        => $data['items'][$a][$c]['hinsei'],
                                                'remarks'       => $data['items'][$a][$c]['remarks'],
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
                                                'type'          => '',
                                                'hinsei'        => '',
                                                'remarks'       => '',
                                                'coordinates'   => $data['datas'][$a][$b][$e]['coordinates'],
                                            ];
                                        } 
                                    }
                                    else
                                    {
                                        $items[$a][] = 
                                        [
                                            'tools'         => '',
                                            'specification' => '',
                                            'upper_limit'   => '',
                                            'lower_limit'   => '',
                                            'type'          => '',
                                            'hinsei'        => '',
                                            'remarks'       => '',
                                            'coordinates'   => $data['datas'][$a][$b][$e]['coordinates'],
                                        ];
                                    }   

                                    

                                    $datas[$a][] = 
                                    [
                                        'data'          => explode(",",$data['datas'][$a][$b][$e]['data']),
                                        'judgment'      => $data['datas'][$a][$b][$e]['judgment'],
                                        'remarks'       => $data['datas'][$a][$b][$e]['remarks'],
                                        'hinsei'        => $data['datas'][$a][$b][$e]['hinsei'],
                                        'type'          => $data['datas'][$a][$b][$e]['type'],
                                    ];
                                }
                            }
                        } 
                    }
                }

                $checksheet =
                [
                    'items' => $items,
                    'datas' => $datas,
                ];

                $indicator = 0;
                
                $date_finished = explode(" ", $data['checksheet_details']['date_finished']);

                if (count($checksheet) !== 0) 
                {
                    for ($i=0; $i < count($data['details_data']); $i++) 
                    { 
                        if ($indicator === 3) 
                        {
                            $indicator = 0;
                        }
                        $indicator++;

                        // $pdf->SetFont('Times');
                        $pdf->SetFontSize(6);

                        if ($indicator == 1)
                        {
                            $pdf->setSourceFile(storage_path('app/public/second_page/second_page.pdf'));
                            $template = $pdf->importPage(1);
                            $pdf->AddPage();
                            $pdf->useTemplate($template);

                            $pdf->SetFont('cid0jp');
                            $pdf->SetFontSize(11);

                            // date
                            $pdf->SetXY(180, 10);
                            $pdf->Write(0, $date_finished[0]);

                            // inspection reason
                            if ($data['checksheet_details']['inspection_reason'] === 'ND') 
                                $pdf->Image($circle,20,18, 10);
                            else if ($data['checksheet_details']['inspection_reason'] === 'TD') 
                                $pdf->Image($circle,57,18, 10);

                            // supplier
                            $pdf->SetFontSize(6);
                            $pdf->SetXY(105, 23);
                            $pdf->Write(0, $data['checksheet_details']['supplier_name']);

                            // part number
                            $pdf->SetFontSize(11);
                            $pdf->SetXY(43, 28);
                            $pdf->Write(0, $data['checksheet_details']['part_number']);

                            // part name
                            $pdf->SetFontSize(6);
                            $pdf->SetXY(43, 38);
                            $pdf->Write(0, $data['checksheet_details']['part_name']);

                            // revision number
                            $pdf->SetFontSize(11);
                            $pdf->SetXY(95, 36);
                            $pdf->Write(0, $data['checksheet_details']['revision_number']);

                            $pdf->SetFontSize(6);

                            // inspect by
                            $inspect_datetime = explode(" ", $data['approval']['inspect_datetime']);
                            $pdf->SetXY(143, 32);
                            $pdf->MultiCell(21,3, $inspect_datetime[0],0,'C');

                            switch ($data['approval']['inspect_by']) 
                            {
                                case 'JED RELATOR':
                                    $signature_inspector = 'JED RELATOR';
                                    break;
                                case 'HIDEKO NAKAMURA':
                                    $signature_inspector = 'HIDEKO NAKAMURA';
                                    break;
                                case 'KAZUHITO MITOMI':
                                    $signature_inspector = 'KAZUHITO MITOMI';
                                    break;
                                case 'KIYOKAZU WATANABE':
                                    $signature_inspector = 'KIYOKAZU WATANABE';
                                    break;
                                case 'MASAHARU KOBAYASHI':
                                    $signature_inspector = 'MASAHARU KOBAYASHI';
                                    break;   
                                case 'MEGUMI NAGAI':
                                    $signature_inspector = 'MEGUMI NAGAI';
                                    break;
                                case 'RUMIKO NISHIMURA':
                                    $signature_inspector = 'RUMIKO NISHIMURA';
                                    break;
                                case 'SHINICHI HIROKI':
                                    $signature_inspector = 'SHINICHI HIROKI';
                                    break;
                                case 'TAKAYOSHI SAKATSUME':
                                    $signature_inspector = 'TAKAYOSHI SAKATSUME';
                                    break; 
                                case 'TOKIKO MATSUNAGA':
                                    $signature_inspector = 'TOKIKO MATSUNAGA';
                                    break;
                                case 'YUUKI HORI':
                                    $signature_inspector = 'YUUKI HORI';
                                    break;
                                case 'YUUKI KAMATA':
                                    $signature_inspector = 'YUUKI KAMATA';
                                    break;
                                case 'YASUO TAKAHASHI':
                                    $signature_inspector = 'YASUO TAKAHASHI';
                                    break;
                                case 'MAKIKO KAIDOU':
                                    $signature_inspector = 'MAKIKO KAIDOU';
                                    break;
                                case 'TERRY MERWIN BALAHADIA':
                                    $signature_inspector = 'TERRY MERWIN BALAHADIA';
                                    break;
                                case 'GEORGE BIEN ALMENANZA':
                                    $signature_inspector = 'GEORGE ALMENANZA';
                                    break;
                                case 'HARUKI FUJITA':
                                    $signature_inspector = 'HARUKI FUJITA';
                                    break;
                                case 'KOUJI SAWAZAKI':
                                    $signature_inspector = 'KOUJI SAWAZAKI';
                                    break;
                                case 'TAKAHIRO HIROSAWA':
                                    $signature_inspector = 'TAKAHIRO HIROSAWA';
                                    break;
                                case 'YUTAKA MORIYAMA':
                                    $signature_inspector = 'YUTAKA MORIYAMA';
                                    break;
                                case 'YUTAKA SATOU':
                                    $signature_inspector = 'YUTAKA SATOU';
                                    break;
                                case 'ERIKA REFORMADO':
                                    $signature_inspector = 'ERIKA REFORMADO';
                                    break;
                                default:
                                    $signature_inspector = '';
                                    break;
                            }

                            $signature_inspector = storage_path('/app/public/second_page/signature/'. $signature_inspector .'.png');

                            $pdf->Image($signature_inspector,146,26, 15);

                            // evaluated by
                            $evaluated_datetime = explode(" ", $data['approval']['evaluated_datetime']);
                            $pdf->SetXY(164, 32);
                            $pdf->MultiCell(21,3, $evaluated_datetime[0],0,'C');

                            switch ($data['approval']['evaluated_by']) 
                            {
                                case 'TERRY MERWIN BALAHADIA':
                                    $signature_evaluator = 'TERRY MERWIN BALAHADIA';
                                    break;
                                case 'GEORGE BIEN ALMENANZA':
                                    $signature_evaluator = 'GEORGE ALMENANZA';
                                    break;
                                case 'HARUKI FUJITA':
                                    $signature_evaluator = 'HARUKI FUJITA';
                                    break;
                                case 'KOUJI SAWAZAKI':
                                    $signature_evaluator = 'KOUJI SAWAZAKI';
                                    break;
                                case 'TAKAHIRO HIROSAWA':
                                    $signature_evaluator = 'TAKAHIRO HIROSAWA';
                                    break;
                                case 'YUTAKA MORIYAMA':
                                    $signature_evaluator = 'YUTAKA MORIYAMA';
                                    break;
                                case 'YUTAKA SATOU':
                                    $signature_evaluator = 'YUTAKA SATOU';
                                    break;
                                case 'ERIKA REFORMADO':
                                    $signature_evaluator = 'ERIKA REFORMADO';
                                    break;
                                default:
                                    $signature_evaluator = '';
                                    break;
                            }

                            $evaluator = storage_path('/app/public/second_page/signature/'. $signature_evaluator .'.png');

                            $pdf->Image($evaluator,167,26, 15);

                            // approved by
                            $approved_datetime = explode(" ", $data['approval']['approved_datetime']);
                            $pdf->SetXY(184, 32);
                            $pdf->MultiCell(21,3, $approved_datetime[0],0,'C');

                            switch ($data['approval']['approved_by']) 
                            {
                                case 'MARK JOHREL MANZANO':
                                    $signature_approver = 'MARK JOHREL MANZANO';
                                    break; 
                                case 'KAZUSHI WATANABE':
                                    $signature_approver = 'KAZUSHI WATANABE';
                                    break;
                                case 'TAMOTSU KOIKE':
                                    $signature_approver = 'TAMOTSU KOIKE';
                                    break;
                                case 'ERIKA REFORMADO':
                                    $signature_approver = 'ERIKA REFORMADO';
                                    break;
                                default:
                                    $signature_approver = '';
                                    break;
                            }

                            $approver = storage_path('/app/public/second_page/signature/'. $signature_approver .'.png');

                            $pdf->Image($approver,187,26, 15);

                            // trial number
                            $pdf->SetXY(75, 52);
                            $pdf->Write(0, $data['details_data'][$i]['trial_number']);
                            // date
                            $pdf->SetXY(80, 52);
                            $pdf->Write(0, $date_finished[0]);
                            // revision number
                            $pdf->SetXY(99, 52);
                            $pdf->Write(0, $data['details_data'][$i]['revision_number']);
                            // judgment
                            if ($data['details_data'][$i]['judgment'] === 'GOOD') 
                                $pdf->Image($circle,81,53, 10);
                            else
                                $pdf->Image($circle,94,53, 10);

                            $increment = 76;
                            foreach ($checksheet['items'][0] as $items) 
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

                                
                                $plus_minus = ' ';
                                if (is_numeric($items['specification'])) 
                                {
                                    $plus_minus = ' ± ';
                                }

                                // specification
                                $pdf->SetXY(53, $increment);
                                $pdf->MultiCell(16,6, $items['specification'] .$plus_minus. substr($items['upper_limit'], 1),0,'C');


                                $increment+= 5.7;
                            }

                            $increment = 76;

                            

                            foreach ($checksheet['datas'][$i] as $datas) 
                            {
                                switch ($datas['judgment']) 
                                {
                                    case 'GOOD':
                                        $judgment = '○';
                                        break;
                                    case 'NG':
                                        $judgment = 'X';
                                        break;
                                    default:
                                        $judgment = '';
                                        break;
                                }
                                
                                $max_data = '';
                                $min_data = '';
                                
                                if ($datas['data'] != '') 
                                {
                                    if ($datas['type'] === 'Min and Max' || $datas['type'] === 'Min and Max and Form Tolerance') 
                                    {
                                        $x = 0;
                                        $data_value = [];
                                    
                                        for ($g = 0; $g < 10; $g++)
                                        {   
                                            if ($datas['data'][$g] !== '-') 
                                            {
                                                if($g % 2 == 1)
                                                {   
                                                    $data_value[$x]['min'] = floatval($datas['data'][$g]);
                                                    $x++;
                                                }
                                                else
                                                {
                                                    $data_value[$x]['max'] = floatval($datas['data'][$g]);
                                                }
                                            }                     
                                        }
                                        
                                        $minmax = max($data_value);

                                        $max_data = $minmax['max'];
                                        $min_data = $minmax['min'];
                                    }
                                    else if ($datas['type'] === 'Actual' || $datas['type'] === 'Material Thickness') 
                                    {
                                        $x = 0;
                                        for ($h=0; $h < 5; $h++) 
                                        { 
                                            if ($datas['data'][$h] !== '-') 
                                            {
                                                $data_value[$x]['max'] = floatval($datas['data'][$h]);
                                                $x++;
                                            }
                                        }

                                        $minmax = max($data_value);

                                        $max_data = $minmax['max'];
                                    }
                                    else 
                                    {
                                        $max_data = 'NG';

                                        if ($datas['judgment'] === 'GOOD') 
                                        {
                                            $max_data = 'OK';
                                        }
                                        else if ($datas['judgment'] === '')
                                        {
                                            $max_data = '';
                                        }
                                    }
                                }

                                $max = $max_data;
                                $min = $min_data;
                                
                                // min max
                                $pdf->SetXY(69, $increment);
                                $pdf->MultiCell(13,3, $max,0,'C');
                                $pdf->SetXY(69, $increment+3);
                                $pdf->MultiCell(13,3,$min ,0,'C');

                                // judgment
                                if ($datas['hinsei'] !== 'HINSEI') 
                                {
                                    $pdf->SetXY(82, $increment);
                                    $pdf->MultiCell(10,6, $judgment,0,'C');

                                    // remarks
                                    $pdf->SetXY(92, $increment);
                                    $pdf->MultiCell(13,6, $datas['remarks'],0,'C');
                                }
                                else 
                                {
                                    $pdf->SetXY(86, $increment+2);
                                    $pdf->MultiCell(2,2, '',1,'C');

                                    foreach ($checksheet['items'][$i] as $items) 
                                    {
                                        $pdf->SetXY(92, $increment);
                                        $pdf->MultiCell(13,6, $items['remarks'],0,'C');
                                    }
                                }

                                $increment+= 5.7;
                            }

                            $increment = 76;
                            foreach ($checksheet['items'][$i] as $items) 
                            {
                                if ($items['hinsei'] === 'HINSEI') 
                                {
                                    $pdf->SetXY(92, $increment);
                                    $pdf->MultiCell(13,6, $items['remarks'],0,'C');
                                }

                                $increment+= 5.7;
                            }
                        }
                        else if ($indicator == 2)
                        {
                            // trial number
                            $pdf->SetXY(111, 52);
                            $pdf->Write(0, $data['details_data'][$i]['trial_number']);
                            // date
                            $pdf->SetXY(116, 52);
                            $pdf->Write(0, $date_finished[0]);
                            // revision number
                            $pdf->SetXY(135, 52);
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
                                        $judgment = '○';
                                        break;
                                    case 'NG':
                                        $judgment = 'X';
                                        break;
                                    default:
                                        $judgment = '';
                                        break;
                                }

                                $max_data = '';
                                $min_data = '';
                                
                                if ($datas['data'] != '') 
                                {
                                    if ($datas['type'] === 'Min and Max' || $datas['type'] === 'Min and Max and Form Tolerance') 
                                    {
                                        $x = 0;
                                        $data_value = [];
                                    
                                        for ($g = 0; $g < 10; $g++)
                                        {   
                                            if ($datas['data'][$g] !== '-') 
                                            {
                                                if($g % 2 == 1)
                                                {   
                                                    $data_value[$x]['min'] = floatval($datas['data'][$g]);
                                                    $x++;
                                                }
                                                else
                                                {
                                                    $data_value[$x]['max'] = floatval($datas['data'][$g]);
                                                }
                                            }                     
                                        }
                                        
                                        $minmax = max($data_value);

                                        $max_data = $minmax['max'];
                                        $min_data = $minmax['min'];
                                    }
                                    else if ($datas['type'] === 'Actual' || $datas['type'] === 'Material Thickness') 
                                    {
                                        $x = 0;
                                        for ($h=0; $h < 5; $h++) 
                                        { 
                                            if ($datas['data'][$h] !== '-') 
                                            {
                                                $data_value[$x]['max'] = floatval($datas['data'][$h]);
                                                $x++;
                                            }
                                        }

                                        $minmax = max($data_value);

                                        $max_data = $minmax['max'];
                                    }
                                    else 
                                    {
                                        $max_data = 'NG';

                                        if ($datas['judgment'] === 'GOOD') 
                                        {
                                            $max_data = 'OK';
                                        }
                                        else if ($datas['judgment'] === '')
                                        {
                                            $max_data = '';
                                        }
                                    }
                                }

                                $max = $max_data;
                                $min = $min_data;
                                
                                // min max
                                $pdf->SetXY(105, $increment);
                                $pdf->MultiCell(13,3, $max,0,'C');
                                $pdf->SetXY(105, $increment+3);
                                $pdf->MultiCell(13,3, $min,0,'C');

                                // judgment
                                if ($datas['hinsei'] !== 'HINSEI') 
                                {
                                    $pdf->SetXY(118, $increment);
                                    $pdf->MultiCell(10,6, $judgment,0,'C');

                                    $pdf->SetXY(128, $increment);
                                    $pdf->MultiCell(13,6, $datas['remarks'],0,'C');
                                }
                                else 
                                {
                                    $pdf->SetXY(121, $increment+2);
                                    $pdf->MultiCell(2,2, '',1,'C');
                                }

                                $increment+= 5.7;
                            }

                            $increment = 76;
                            foreach ($checksheet['items'][$i] as $items) 
                            {
                                if ($items['hinsei'] === 'HINSEI') 
                                {
                                    $pdf->SetXY(128, $increment);
                                    $pdf->MultiCell(13,6, $items['remarks'],0,'C');
                                }

                                $increment+= 5.7;
                            }
                        }
                        else if ($indicator == 3) 
                        {
                            // trial number
                            $pdf->SetXY(146, 52);
                            $pdf->Write(0, $data['details_data'][$i]['trial_number']);
                            // date
                            $pdf->SetXY(152, 52);
                            $pdf->Write(0, $date_finished[0]);
                            // revision number
                            $pdf->SetXY(171, 52);
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
                                        $judgment = '○';
                                        break;
                                    case 'NG':
                                        $judgment = 'X';
                                        break;
                                    default:
                                        $judgment = '';
                                        break;
                                }

                                $max_data = '';
                                $min_data = '';
                                
                                if ($datas['data'] != '') 
                                {
                                    if ($datas['type'] === 'Min and Max' || $datas['type'] === 'Min and Max and Form Tolerance') 
                                    {
                                        $x = 0;
                                        $data_value = [];
                                    
                                        for ($g = 0; $g < 10; $g++)
                                        {   
                                            if ($datas['data'][$g] !== '-') 
                                            {
                                                if($g % 2 == 1)
                                                {   
                                                    $data_value[$x]['min'] = floatval($datas['data'][$g]);
                                                    $x++;
                                                }
                                                else
                                                {
                                                    $data_value[$x]['max'] = floatval($datas['data'][$g]);
                                                }
                                            }                     
                                        }
                                        
                                        $minmax = max($data_value);

                                        $max_data = $minmax['max'];
                                        $min_data = $minmax['min'];
                                    }
                                    else if ($datas['type'] === 'Actual' || $datas['type'] === 'Material Thickness') 
                                    {
                                        $x = 0;
                                        for ($h=0; $h < 5; $h++) 
                                        { 
                                            if ($datas['data'][$h] !== '-') 
                                            {
                                                $data_value[$x]['max'] = floatval($datas['data'][$h]);
                                                $x++;
                                            }
                                        }

                                        $minmax = max($data_value);

                                        $max_data = $minmax['max'];
                                    }
                                    else 
                                    {
                                        $max_data = 'NG';

                                        if ($datas['judgment'] === 'GOOD') 
                                        {
                                            $max_data = 'OK';
                                        }
                                        else if ($datas['judgment'] === '')
                                        {
                                            $max_data = '';
                                        }
                                    }
                                }

                                $max = $max_data;
                                $min = $min_data;
                                
                                // min max
                                $pdf->SetXY(140, $increment);
                                $pdf->MultiCell(13,3, $max,0,'C');
                                $pdf->SetXY(140, $increment+3);
                                $pdf->MultiCell(13,3, $min,0,'C');

                                // judgment
                                if ($datas['hinsei'] !== 'HINSEI') 
                                {
                                    $pdf->SetXY(153, $increment);
                                    $pdf->MultiCell(10,6, $judgment,0,'C');

                                    $pdf->SetXY(163, $increment);
                                    $pdf->MultiCell(13,6, $datas['remarks'],0,'C');
                                }
                                else 
                                {
                                    $pdf->SetXY(157, $increment+2);
                                    $pdf->MultiCell(2,2, '',1,'C');
                                }

                                $increment+= 5.7;
                            }

                            $increment = 76;
                            foreach ($checksheet['items'][$i] as $items) 
                            {
                                if ($items['hinsei'] === 'HINSEI') 
                                {
                                    $pdf->SetXY(163, $increment);
                                    $pdf->MultiCell(13,6, $items['remarks'],0,'C');
                                }

                                $increment+= 5.7;
                            }
                        }
                    } // end of forloop
                } // end of if
            }
        // }
        
        foreach($files as $file)
        {
            $file_type = explode(".", $file);

            if($file_type[1] == 'pdf')
            {
                $pagecount = $pdf->setSourceFile($location.$file);

                for($i = 0; $i <$pagecount; $i++)
                {
                    $pageId = $pdf->importPage($i + 1);

                    $specs = $pdf->getTemplateSize($pageId);
                    
                    $pdf->AddPage($specs['height'] > $specs['width'] ? 'P' : 'L');
                    $pdf->useTemplate($pageId);
                }
            }
            else 
            {   
                $path = $location.$file;

                list($w, $h) = getimagesize($path);
                $pdf->AddPage($w > $h  ? 'L' : 'P');

                $pdf->Image($path,5,5,280);
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
}