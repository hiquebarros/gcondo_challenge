<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteCategory extends Model
{
    protected $table = 'quote_categories';

    protected $fillable = ['name'];
}
