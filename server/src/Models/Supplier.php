<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $table = 'suppliers';

    protected $fillable = [
        'legal_name',
        'trade_name',
        'cnpj',
        'email',
        'supplier_address_id',
        'supplier_category_id',
    ];

    public function category()
    {
        return $this->belongsTo(SupplierCategory::class, 'supplier_category_id');
    }

    public function address()
    {
        return $this->belongsTo(SupplierAddress::class, 'supplier_address_id');
    }

    public function people()
    {
        return $this->belongsToMany(Person::class, 'supplier_person');
    }
}
