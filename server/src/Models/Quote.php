<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $table = 'quotes';

    protected $fillable = [
        'title',
        'description',
        'amount',
        'supplier_id',
        'condominium_id',
        'quote_category_id',
        'quote_status_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }

    public function quoteCategory()
    {
        return $this->belongsTo(QuoteCategory::class, 'quote_category_id');
    }

    public function quoteStatus()
    {
        return $this->belongsTo(QuoteStatus::class, 'quote_status_id');
    }
}
