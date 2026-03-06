<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $table = 'people';

    protected $fillable = [
        'full_name',
        'cpf',
        'email',
        'birth_date'
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];
}
