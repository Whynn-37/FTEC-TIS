<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithColumnWidths;

class TrialEvaluationResultExport implements WithEvents, WithColumnWidths
{
    // ...

    /**
     * @return array
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class    => function(AfterSheet $event) {
                $border_with_center_value = [
                    'borders' => [
                        'outline' => ['borderStyle' => 'thin'],
                        'color' => ['argb' => '000000'],
                    ],
                    'alignment' => [
                        'vertical'     => 'center',
                        'horizontal'   => 'center',
                    ]
                ];
                
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

                $part_name_cell = 'H3:J4';
                $event->sheet->getDelegate()->getStyle($part_name_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($part_name_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($part_name_cell);
                $event->sheet->getDelegate()->setCellValue('H3', 'PART NAME:');

                $part_name_value_cell = 'K3:M4';
                $event->sheet->getDelegate()->getStyle($part_name_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($part_name_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($part_name_value_cell);

                $supplier_cell = 'N3:P4';
                $event->sheet->getDelegate()->getStyle($supplier_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($supplier_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($supplier_cell);
                $event->sheet->getDelegate()->setCellValue('N3', 'SUPPLIER:');

                $supplier_value_cell = 'Q3:T4';
                $event->sheet->getDelegate()->getStyle($supplier_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($supplier_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($supplier_value_cell);

                $revision_number_cell = 'U3:W4';
                $event->sheet->getDelegate()->getStyle($revision_number_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($revision_number_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($revision_number_cell);
                $event->sheet->getDelegate()->setCellValue('U3', 'REV. NO:');

                $revision_mumber_value_cell = 'X3:Y4';
                $event->sheet->getDelegate()->getStyle($revision_mumber_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($revision_mumber_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($revision_mumber_value_cell);

                $date_cell = 'B5:E6';
                $event->sheet->getDelegate()->getStyle($date_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($date_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($date_cell);
                $event->sheet->getDelegate()->setCellValue('B5', 'DATE:');

                $date_value_cell = 'F5:G6';
                $event->sheet->getDelegate()->getStyle($date_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($date_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($date_value_cell);

                $temp_cell = 'H5:J6';
                $event->sheet->getDelegate()->getStyle($temp_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($temp_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($temp_cell);
                $event->sheet->getDelegate()->setCellValue('H5', 'TEMP.:');

                $temp_value_cell = 'K5:M6';
                $event->sheet->getDelegate()->getStyle($temp_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($temp_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($temp_value_cell);

                $trial_app_cell = 'N5:P6';
                $event->sheet->getDelegate()->getStyle($trial_app_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($trial_app_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($trial_app_cell);
                $event->sheet->getDelegate()->setCellValue('N5', 'TEMP.:');

                $trial_app_value_cell = 'Q5:T6';
                $event->sheet->getDelegate()->getStyle($trial_app_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($trial_app_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($trial_app_value_cell);

                $judgment_cell = 'U5:W6';
                $event->sheet->getDelegate()->getStyle($judgment_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($judgment_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($judgment_cell);
                $event->sheet->getDelegate()->setCellValue('U5', 'JUDGMENT.:');

                $judgment_value_cell = 'X5:Y6';
                $event->sheet->getDelegate()->getStyle($judgment_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($judgment_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($judgment_value_cell);

                // third row
                $time_cell = 'B7:E8';
                $event->sheet->getDelegate()->getStyle($time_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($time_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($time_cell);
                $event->sheet->getDelegate()->setCellValue('B7', 'TIME:');

                $time_value_cell = 'F7:G8';
                $event->sheet->getDelegate()->getStyle($time_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($time_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($time_value_cell);

                $humidity_cell = 'H7:J8';
                $event->sheet->getDelegate()->getStyle($humidity_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($humidity_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($humidity_cell);
                $event->sheet->getDelegate()->setCellValue('H7', 'HUMIDITY:');

                $humidity_value_cell = 'K7:M8';
                $event->sheet->getDelegate()->getStyle($humidity_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($humidity_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($humidity_value_cell);

                $die_remarks_cell = 'N7:P8';
                $event->sheet->getDelegate()->getStyle($die_remarks_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($die_remarks_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($die_remarks_cell);
                $event->sheet->getDelegate()->setCellValue('H7', 'DIE REMARKS:');

                $die_remarks_value_cell = 'Q7:T8';
                $event->sheet->getDelegate()->getStyle($die_remarks_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($die_remarks_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($die_remarks_value_cell);

                $trial_stage_cell = 'U7:W8';
                $event->sheet->getDelegate()->getStyle($trial_stage_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($trial_stage_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($trial_stage_cell);
                $event->sheet->getDelegate()->setCellValue('U7', 'TRIAL STAGE:');

                $trial_stage_value_cell = 'X7:Y8';
                $event->sheet->getDelegate()->getStyle($trial_stage_value_cell)->applyFromArray($border_with_center_value);
                $event->sheet->getDelegate()->getStyle($trial_stage_value_cell)->getFont('Calibri')->setSize(12)->setBold(true);
                $event->sheet->getDelegate()->mergeCells($trial_stage_value_cell);
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
        ];
    }
}
