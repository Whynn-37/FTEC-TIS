<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\Exportable;

class TrialEvaluationResultExport implements WithEvents, WithColumnWidths
{
    private $data;
    use Exportable;

    public function __construct($data)
    {
        $this->data  = $data;
    }

    /**
     * @return array
     */
    public function registerEvents(): array
    {
        // dd($this->data);
        return 
        [
            AfterSheet::class    => function(AfterSheet $event) 
            {
                $border_with_center_value = 
                [
                    'borders' => 
                    [
                        'outline'   => ['borderStyle' => 'thin'],
                        'color'     => ['argb' => '000000'],
                    ],
                    'alignment' => 
                    [
                        'vertical'     => 'center',
                        'horizontal'   => 'center',
                    ]
                ];

                $event->sheet->getDelegate()->getRowDimension('15')->setRowHeight(35);

                // first row
                $trial_evaluation_result_cell = 'B2:Y2';
                $event->sheet->getDelegate()->getStyle($trial_evaluation_result_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($trial_evaluation_result_cell)->getFont('Calibri')->setSize(22)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($trial_evaluation_result_cell);
                $event->sheet->getDelegate()->setCellValue('B2', 'TRIAL EVALUATION RESULT');

                // second row
                $part_number_cell = 'B3:E4';
                $event->sheet->getDelegate()->getStyle($part_number_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($part_number_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($part_number_cell);
                $event->sheet->getDelegate()->setCellValue('B3', 'PART NO.:');

                $part_number_value_cell = 'F3:G4';
                $event->sheet->getDelegate()->getStyle($part_number_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($part_number_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($part_number_value_cell);
                $event->sheet->getDelegate()->setCellValue('F3', $this->data['details']['part_number']);
                
                $part_name_cell = 'H3:J4';
                $event->sheet->getDelegate()->getStyle($part_name_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($part_name_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($part_name_cell);
                $event->sheet->getDelegate()->setCellValue('H3', 'PART NAME:');

                $part_name_value_cell = 'K3:M4';
                $event->sheet->getDelegate()->getStyle($part_name_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($part_name_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($part_name_value_cell);
                $event->sheet->getDelegate()->setCellValue('K3', $this->data['details']['part_name']);

                $supplier_cell = 'N3:P4';
                $event->sheet->getDelegate()->getStyle($supplier_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($supplier_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($supplier_cell);
                $event->sheet->getDelegate()->setCellValue('N3', 'SUPPLIER:');

                $supplier_value_cell = 'Q3:T4';
                $event->sheet->getDelegate()->getStyle($supplier_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($supplier_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($supplier_value_cell);
                $event->sheet->getDelegate()->setCellValue('Q3', $this->data['details']['supplier_name']);

                $revision_number_cell = 'U3:W4';
                $event->sheet->getDelegate()->getStyle($revision_number_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($revision_number_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($revision_number_cell);
                $event->sheet->getDelegate()->setCellValue('U3', 'REV. NO:');

                $revision_number_value_cell = 'X3:Y4';
                $event->sheet->getDelegate()->getStyle($revision_number_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($revision_number_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($revision_number_value_cell);
                $event->sheet->getDelegate()->setCellValue('X3', $this->data['details']['revision_number']);

                $date_cell = 'B5:E6';
                $event->sheet->getDelegate()->getStyle($date_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($date_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($date_cell);
                $event->sheet->getDelegate()->setCellValue('B5', 'DATE:');

                $date_value_cell = 'F5:G6';
                $event->sheet->getDelegate()->getStyle($date_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($date_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($date_value_cell);
                $event->sheet->getDelegate()->setCellValue('F5', $this->data['details']['date_finished']);

                $temp_cell = 'H5:J6';
                $event->sheet->getDelegate()->getStyle($temp_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($temp_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($temp_cell);
                $event->sheet->getDelegate()->setCellValue('H5', 'TEMP.:');

                $temp_value_cell = 'K5:M6';
                $event->sheet->getDelegate()->getStyle($temp_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($temp_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($temp_value_cell);
                $event->sheet->getDelegate()->setCellValue('K5', $this->data['details']['temperature']);

                $trial_app_cell = 'N5:P6';
                $event->sheet->getDelegate()->getStyle($trial_app_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($trial_app_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($trial_app_cell);
                $event->sheet->getDelegate()->setCellValue('N5', 'TRIAL APPLICATION:');

                $trial_app_value_cell = 'Q5:T6';
                $event->sheet->getDelegate()->getStyle($trial_app_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($trial_app_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($trial_app_value_cell);
                $event->sheet->getDelegate()->setCellValue('Q5', $this->data['details']['inspection_reason']);

                $judgment_cell = 'U5:W6';
                $event->sheet->getDelegate()->getStyle($judgment_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($judgment_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($judgment_cell);
                $event->sheet->getDelegate()->setCellValue('U5', 'JUDGMENT:');

                $judgment_value_cell = 'X5:Y6';
                $event->sheet->getDelegate()->getStyle($judgment_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($judgment_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($judgment_value_cell);
                $event->sheet->getDelegate()->setCellValue('X5', $this->data['details']['judgment']);

                // third row
                for ($i=0; $i < count($this->data['takt_time']); $i++) 
                { 
                    $time_sum[] = $this->data['takt_time'][$i]['total_takt_time'];
                }

                $time_cell = 'B7:E8';
                $event->sheet->getDelegate()->getStyle($time_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($time_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($time_cell);
                $event->sheet->getDelegate()->setCellValue('B7', 'TIME:');

                $time_value_cell = 'F7:G8';
                $event->sheet->getDelegate()->getStyle($time_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($time_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($time_value_cell);
                $event->sheet->getDelegate()->setCellValue('F7', round(array_sum($time_sum)/1440, 2) . 'DAYS');

                $humidity_cell = 'H7:J8';
                $event->sheet->getDelegate()->getStyle($humidity_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($humidity_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($humidity_cell);
                $event->sheet->getDelegate()->setCellValue('H7', 'HUMIDITY:');

                $humidity_value_cell = 'K7:M8';
                $event->sheet->getDelegate()->getStyle($humidity_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($humidity_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($humidity_value_cell);
                $event->sheet->getDelegate()->setCellValue('K7', $this->data['details']['humidity']);

                $die_remarks_cell = 'N7:P8';
                $event->sheet->getDelegate()->getStyle($die_remarks_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($die_remarks_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($die_remarks_cell);
                $event->sheet->getDelegate()->setCellValue('N7', 'DIE REMARKS:');

                $die_remarks_value_cell = 'Q7:T8';
                $event->sheet->getDelegate()->getStyle($die_remarks_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($die_remarks_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($die_remarks_value_cell);
                $event->sheet->getDelegate()->setCellValue('Q7', $this->data['details']['die_class']);

                $trial_stage_cell = 'U7:W8';
                $event->sheet->getDelegate()->getStyle($trial_stage_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($trial_stage_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($trial_stage_cell);
                $event->sheet->getDelegate()->setCellValue('U7', 'TRIAL STAGE:');

                // ordinal suffix
                $ends = array('TH','ST','ND','RD','TH','TH','TH','TH','TH','TH');
                if (($this->data['details']['trial_number'] %100) >= 11 && ($this->data['details']['trial_number']%100) <= 13)
                    $abbreviation = $this->data['details']['trial_number']. 'TH';
                else
                    $abbreviation = $this->data['details']['trial_number']. $ends[$this->data['details']['trial_number'] % 10];

                $trial_stage_value_cell = 'X7:Y8';
                $event->sheet->getDelegate()->getStyle($trial_stage_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($trial_stage_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($trial_stage_value_cell);
                $event->sheet->getDelegate()->setCellValue('x7', $abbreviation);

                // fourth row
                $inspectors_cell = 'B9:E12';
                $event->sheet->getDelegate()->getStyle($inspectors_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($inspectors_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($inspectors_cell);
                $event->sheet->getDelegate()->setCellValue('B9', 'INSPECTOR:');

                $inspectors_value_cell = 'F9:G12';
                $event->sheet->getDelegate()->getStyle($inspectors_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($inspectors_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($inspectors_value_cell);
                $event->sheet->getDelegate()->setCellValue('F9', $this->data['approval']['inspect_by']);

                $evaluated_by_cell = 'H9:M9';
                $event->sheet->getDelegate()->getStyle($evaluated_by_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($evaluated_by_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($evaluated_by_cell);
                $event->sheet->getDelegate()->setCellValue('H9', 'EVALUATED BY:');

                $evaluated_by_value_cell = 'H10:M12';
                $event->sheet->getDelegate()->getStyle($evaluated_by_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($evaluated_by_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($evaluated_by_value_cell);
                $event->sheet->getDelegate()->setCellValue('H10', $this->data['approval']['evaluated_by']);

                $checked_by_cell = 'N9:S9';
                $event->sheet->getDelegate()->getStyle($checked_by_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($checked_by_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($checked_by_cell);
                $event->sheet->getDelegate()->setCellValue('N9', 'CHECKED BY:');

                $checked_by_value_cell = 'N10:S12';
                $event->sheet->getDelegate()->getStyle($checked_by_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($checked_by_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($checked_by_value_cell);
                $event->sheet->getDelegate()->setCellValue('N10', $this->data['approval']['evaluated_by']);

                $approved_by_cell = 'T9:Y9';
                $event->sheet->getDelegate()->getStyle($approved_by_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($approved_by_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($approved_by_cell);
                $event->sheet->getDelegate()->setCellValue('T9', 'APPROVED BY:');

                $approved_by_value_cell = 'T10:Y12';
                $event->sheet->getDelegate()->getStyle($approved_by_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($approved_by_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($approved_by_value_cell);
                $event->sheet->getDelegate()->setCellValue('T10', $this->data['approval']['approved_by']);

                // fifth row
                $number_cell = 'B13:C14';
                $event->sheet->getDelegate()->getStyle($number_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($number_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($number_cell);
                $event->sheet->getDelegate()->setCellValue('B13', 'NO.');

                $page_cell = 'D13:D14';
                $event->sheet->getDelegate()->getStyle($page_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($page_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($page_cell);
                $event->sheet->getDelegate()->setCellValue('D13', 'PAGE');

                $tools_cell = 'E13:E14';
                $event->sheet->getDelegate()->getStyle($tools_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($tools_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($tools_cell);
                $event->sheet->getDelegate()->setCellValue('E13', 'TOOLS');

                $coordinates_cell = 'F13:F14';
                $event->sheet->getDelegate()->getStyle($coordinates_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($coordinates_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($coordinates_cell);
                $event->sheet->getDelegate()->setCellValue('F13', 'COORDINATES');

                $specifications_cell = 'G13:G14';
                $event->sheet->getDelegate()->getStyle($specifications_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($specifications_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($specifications_cell);
                $event->sheet->getDelegate()->setCellValue('G13', 'SPECIFICATIONS');

                $tolerance_cell = 'H13:I13';
                $event->sheet->getDelegate()->getStyle($tolerance_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($tolerance_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($tolerance_cell);
                $event->sheet->getDelegate()->setCellValue('H13', 'TOLERANCE');

                $upper_cell = 'H14';
                $event->sheet->getDelegate()->getStyle($upper_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($upper_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->setCellValue('H14', 'UPPER');

                $lower_cell = 'I14';
                $event->sheet->getDelegate()->getStyle($lower_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($lower_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->setCellValue('I14', 'LOWER');

                $type_cell = 'J13:J14';
                $event->sheet->getDelegate()->getStyle($type_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($type_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($type_cell);
                $event->sheet->getDelegate()->setCellValue('J13', 'TYPE');

                $point_area_cell = 'K13:K14';
                $event->sheet->getDelegate()->getStyle($point_area_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($point_area_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($point_area_cell);
                $event->sheet->getDelegate()->setCellValue('K13', 'POINT AREA');

                $sample_cell = 'L13:U13';
                $event->sheet->getDelegate()->getStyle($sample_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($sample_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($sample_cell);
                $event->sheet->getDelegate()->setCellValue('L13', 'SAMPLE');

                $number_one_cell = 'L14:M14';
                $event->sheet->getDelegate()->getStyle($number_one_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($number_one_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($number_one_cell);
                $event->sheet->getDelegate()->setCellValue('L14', '1');

                $number_two_cell = 'N14:O14';
                $event->sheet->getDelegate()->getStyle($number_two_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($number_two_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($number_two_cell);
                $event->sheet->getDelegate()->setCellValue('N14', '2');

                $number_three_cell = 'P14:Q14';
                $event->sheet->getDelegate()->getStyle($number_three_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($number_three_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($number_three_cell);
                $event->sheet->getDelegate()->setCellValue('P14', '3');

                $number_four_cell = 'R14:S14';
                $event->sheet->getDelegate()->getStyle($number_four_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($number_four_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($number_four_cell);
                $event->sheet->getDelegate()->setCellValue('R14', '4');

                $number_five_cell = 'T14:U14';
                $event->sheet->getDelegate()->getStyle($number_five_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($number_five_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($number_five_cell);
                $event->sheet->getDelegate()->setCellValue('T14', '5');

                $judgment_cell = 'V13:V14';
                $event->sheet->getDelegate()->getStyle($judgment_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($judgment_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($judgment_cell);
                $event->sheet->getDelegate()->setCellValue('V13', 'JUDGMENT');

                $remarks_cell = 'W13:Y14';
                $event->sheet->getDelegate()->getStyle($remarks_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($remarks_cell)->getFont('Calibri')->setSize(10)->setBold(false);
                $event->sheet->getDelegate()->mergeCells($remarks_cell);
                $event->sheet->getDelegate()->setCellValue('W13', 'REMARKS');

                for ($i=0; $i < count($this->data['datas']); $i++) 
                { 
                    for ($z=0; $z < count($this->data['items']); $z++) 
                    { 
                        if ($i === $z) 
                        {
                            if ($this->data['items'][$i][0]) 
                            {
                                $data[] = 
                                [
                                    'tools'         => $this->data['items'][$i]['tools'],
                                    'specification' => $this->data['items'][$i]['specification'],
                                    'type'          => $this->data['items'][$i]['type'],
                                    'upper_limit'   => $this->data['items'][$i]['upper_limit'],
                                    'lower_limit'   => $this->data['items'][$i]['lower_limit'],
                                    'coordinates'   => $this->data['datas'][$i][0]['coordinates'],
                                    'data'          => explode(",",$this->data['datas'][$i][0]['data']),
                                    'judgment'      => $this->data['datas'][$i][0]['judgment'],
                                    'remarks'       => $this->data['datas'][$i][0]['remarks'],
                                ];
                            }
                            else
                            {
                                for ($q=0; $q < count($this->data['datas'][$i]); $q++) 
                                { 
                                    $data[] = 
                                    [
                                        'tools'         => $this->data['items'][$i]['tools'],
                                        'specification' => $this->data['items'][$i]['specification'],
                                        'type'          => $this->data['items'][$i]['type'],
                                        'upper_limit'   => $this->data['items'][$i]['upper_limit'],
                                        'lower_limit'   => $this->data['items'][$i]['lower_limit'],
                                        'coordinates'   => $this->data['datas'][$i][$q]['coordinates'],
                                        'data'          => explode(",",$this->data['datas'][$i][$q]['data']),
                                        'judgment'      => $this->data['datas'][$i][$q]['judgment'],
                                        'remarks'       => $this->data['datas'][$i][$q]['remarks'],
                                    ];
                                }
                            }
                        }
                    }
                }

                $row = 15;
                $number = 1;

                foreach ($data as $value) 
                {
                    $number_value_cell = 'B'.$row.':C'.$row;
                    $event->sheet->getDelegate()->getStyle($number_value_cell)->applyFromArray($border_with_center_value);
                    $event->sheet->getDelegate()->getStyle($number_value_cell)->getFont('Calibri')->setSize(11)->setBold(false);
                    $event->sheet->getDelegate()->mergeCells($number_value_cell);
                    $event->sheet->getDelegate()->setCellValue('B'.$row, $number);

                    $page_value_cell = 'D'.$row;
                    $event->sheet->getDelegate()->getStyle($page_value_cell)->applyFromArray($border_with_center_value);
                    $event->sheet->getDelegate()->getStyle($page_value_cell)->getFont('Calibri')->setSize(11)->setBold(false);
                    $event->sheet->getDelegate()->getStyle($page_value_cell)->getAlignment()->setWrapText(true);
                    $event->sheet->getDelegate()->setCellValue('D'.$row, 1);

                    $tools_value_cell = 'E'.$row;
                    $event->sheet->getDelegate()->getStyle($tools_value_cell)->applyFromArray($border_with_center_value);
                    $event->sheet->getDelegate()->getStyle($tools_value_cell)->getFont('Calibri')->setSize(11)->setBold(false);
                    $event->sheet->getDelegate()->getStyle($tools_value_cell)->getAlignment()->setWrapText(true);
                    $event->sheet->getDelegate()->setCellValue('E'.$row, $value['tools']);

                    $coordinates_value_cell = 'F'.$row;
                    $event->sheet->getDelegate()->getStyle($coordinates_value_cell)->applyFromArray($border_with_center_value);
                    $event->sheet->getDelegate()->getStyle($coordinates_value_cell)->getFont('Calibri')->setSize(11)->setBold(false);
                    $event->sheet->getDelegate()->getStyle($coordinates_value_cell)->getAlignment()->setWrapText(true);
                    $event->sheet->getDelegate()->setCellValue('F'.$row, $value['coordinates']);

                    $specifications_value_cell = 'G'.$row;
                    $event->sheet->getDelegate()->getStyle($specifications_value_cell)->applyFromArray($border_with_center_value);
                    $event->sheet->getDelegate()->getStyle($specifications_value_cell)->getFont('Calibri')->setSize(11)->setBold(false);
                    $event->sheet->getDelegate()->getStyle($specifications_value_cell)->getAlignment()->setWrapText(true);
                    $event->sheet->getDelegate()->setCellValue('G'.$row, $value['specification']);

                    $tolerance_upper_value_cell = 'H'.$row;
                    $event->sheet->getDelegate()->getStyle($tolerance_upper_value_cell)->applyFromArray($border_with_center_value);
                    $event->sheet->getDelegate()->getStyle($tolerance_upper_value_cell)->getFont('Calibri')->setSize(11)->setBold(false);
                    $event->sheet->getDelegate()->getStyle($tolerance_upper_value_cell)->getAlignment()->setWrapText(true);
                    $event->sheet->getDelegate()->setCellValue('H'.$row, $value['upper_limit']);

                    $tolerance_lower_value_cell = 'I'.$row;
                    $event->sheet->getDelegate()->getStyle($tolerance_lower_value_cell)->applyFromArray($border_with_center_value);
                    $event->sheet->getDelegate()->getStyle($tolerance_lower_value_cell)->getFont('Calibri')->setSize(11)->setBold(false);
                    $event->sheet->getDelegate()->getStyle($tolerance_lower_value_cell)->getAlignment()->setWrapText(true);
                    $event->sheet->getDelegate()->setCellValue('I'.$row, $value['lower_limit']);

                    $type_value_cell = 'J'.$row;
                    $event->sheet->getDelegate()->getStyle($type_value_cell)->applyFromArray($border_with_center_value);
                    $event->sheet->getDelegate()->getStyle($type_value_cell)->getFont('Calibri')->setSize(11)->setBold(false);
                    $event->sheet->getDelegate()->getStyle($type_value_cell)->getAlignment()->setWrapText(true);
                    $event->sheet->getDelegate()->setCellValue('J'.$row, $value['type']);

                    $point_area_value_cell = 'K'.$row;
                    $event->sheet->getDelegate()->getStyle($point_area_value_cell)->applyFromArray($border_with_center_value);
                    $event->sheet->getDelegate()->getStyle($point_area_value_cell)->getFont('Calibri')->setSize(11)->setBold(false);
                    $event->sheet->getDelegate()->getStyle($point_area_value_cell)->getAlignment()->setWrapText(true);
                    $event->sheet->getDelegate()->setCellValue('K'.$row, '');

                    $letter = 'L';
                    $indication = 0;
                    $increment = 0;
                    $data_value = '';
                    
                    for ($c=0; $c < 10; $c++) 
                    {
                        if (count($value['data']) === 10)
                        {
                            $data_value = $value['data'][$c];
                        }
                        else
                        {
                            if($indication === 0)
                            {
                                $indication = 1;
                                $data_value = $value['data'][$increment++];
                            }
                            else
                            {
                                $indication = 0;
                                $data_value = '';
                            }
                        }

                        $sample_one_value_cell1 = $letter.$row;
                        $event->sheet->getDelegate()->getStyle($sample_one_value_cell1)->applyFromArray($border_with_center_value);
                        $event->sheet->getDelegate()->getStyle($sample_one_value_cell1)->getFont('Calibri')->setSize(11)->setBold(false);
                        $event->sheet->getDelegate()->getStyle($sample_one_value_cell1)->getAlignment()->setWrapText(true);
                        $event->sheet->getDelegate()->setCellValue($letter.$row, $data_value);

                        $letter++;
                    }
                    
                    $judgment_value_cell2 = 'V'.$row;
                    $event->sheet->getDelegate()->getStyle($judgment_value_cell2)->applyFromArray($border_with_center_value);

                    if ($value['judgment'] === 'NG')
                        $event->sheet->getDelegate()->getStyle($judgment_value_cell2)->getFont('Calibri')->setSize(11)->setBold(false)->getColor()->setRGB('FF0000');
                    else
                        $event->sheet->getDelegate()->getStyle($judgment_value_cell2)->getFont('Calibri')->setSize(11)->setBold(false);
                        
                    $event->sheet->getDelegate()->getStyle($judgment_value_cell2)->getAlignment()->setWrapText(true);
                    $event->sheet->getDelegate()->setCellValue('V'.$row, $value['judgment']);

                    $remarks_value_cell = 'W'.$row.':Y'.$row;
                    $event->sheet->getDelegate()->getStyle($remarks_value_cell)->applyFromArray($border_with_center_value);
                    $event->sheet->getDelegate()->getStyle($remarks_value_cell)->getFont('Calibri')->setSize(11)->setBold(false);
                    $event->sheet->getDelegate()->mergeCells($remarks_value_cell);
                    $event->sheet->getDelegate()->setCellValue('W'.$row, $value['remarks']);

                    $row ++;
                    $number ++;
                }
            },
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 3,
            'B' => 3,
            'C' => 3,   
            'D' => 4.5,
            'E' => 12,
            'F' =>  12,
            'G' =>  24,
            'K' =>  10,
            'X' =>  12,
            'Y' =>  24,
        ];
    }
}
