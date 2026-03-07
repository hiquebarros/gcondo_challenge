<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    public const ROLE_PESSOA_OPERACAO = 'pessoa_operacao';
    public const ROLE_COORDENACAO = 'coordenacao';
    public const ROLE_EQUIPE_INTERNA = 'equipe_interna';
    
    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password_hash',
        'role'
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function sessions()
    {
        return $this->hasMany(Session::class, 'user_id');
    }

    public function condominiums()
    {
        return $this->belongsToMany(Condominium::class, 'user_condominiuns');
    }
}
