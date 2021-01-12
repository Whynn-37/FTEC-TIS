<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = ['supplier_code', 'supplier_name'];

    public function storeSupplier($result)
    {
        Supplier::truncate();
        return Supplier::insert($result);
    }

    public function getSupplier($supplier_code)
    {
        return Supplier::where('supplier_code',$supplier_code)
        ->select('supplier_name')
        ->first();
    }
    
    public function loadSupplier()
    {
        return Supplier::get();
    }

    public function updateOrCreateSupplier($data)
    {
        //return ChecksheetItem::find($id)->update($data);

        return Supplier::updateOrCreate(
            [   
                'supplier_code'     => $data['supplier_code'],
            ],
            [
                'supplier_name'     => $data['supplier_name'],
            ]
        );
    }
}
