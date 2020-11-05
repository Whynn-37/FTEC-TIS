<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class UploadImport implements ToCollection
{
    private $data = [];
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        $this->data = $collection;
    }

    public function get_data()
    {
        return $this->data;
    }
}
