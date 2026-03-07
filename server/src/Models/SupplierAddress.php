<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplierAddress extends Model
{
    protected $table = 'supplier_addresses';

    protected $fillable = [
        'street',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state',
        'country',
        'postal_code',
    ];

    public function supplier()
    {
        return $this->hasOne(Supplier::class, 'supplier_address_id');
    }
}
