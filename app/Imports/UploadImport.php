<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets; 
class UploadImport implements ToCollection, WithMultipleSheets
{
    
    private $data = [];
    private $sheet;
    /**
    * @param Collection $collection
    */

    public function __construct($sheet)
    {
        $this->sheet = $sheet;
    }

    public function sheets(): array
    {
        return [
            $this->sheet => $this,
        ];
    } 

    public function collection(Collection $collection)
    {
        $this->data = $collection;
    }

    public function getData()
    {
        return $this->data;
    }

}
