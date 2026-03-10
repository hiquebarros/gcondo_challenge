<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteStatus extends Model
{
    protected $table = 'quote_statuses';

    protected $fillable = ['name'];
}
