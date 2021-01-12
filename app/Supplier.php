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
    
}
