<?php

use Phinx\Seed\AbstractSeed;
use App\Models\User;

class CondominiumSeeder extends AbstractSeed
{
    public function run(): void
    {
        $now = date('Y-m-d H:i:s');
        $data = [
            [
                'name' => 'Ufizzi Galerria',
                'zip_code' => '95566000',
                'url' => 'ufizzi-galeria.com',
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Vila Jardim',
                'zip_code' => '91566000',
                'url' => 'vila-jardim.com',
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Jardim das Flores',
                'zip_code' => '19364000',
                'url' => 'jardim-das-flores.com',
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Residencial das Palmeiras',
                'zip_code' => '93452280',
                'url' => 'residencial-das-palmeiras.com',
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Condomínio dos Sonhos',
                'zip_code' => '93452280',
                'url' => 'condominio-dos-sonhos.com',
                'updated_at' => $now,
                'deleted_at' => null,
            ],
        ];

        $this->table('condominiums')->insert($data)->save();

        $sindicoId = $this->fetchRow('SELECT id FROM users WHERE email = "sindico@gcondo.com"')['id'];
        $sindico2Id = $this->fetchRow('SELECT id FROM users WHERE email = "sindico2@gcondo.com"')['id'];

        $condominiumIds = $this->fetchAll('SELECT id FROM condominiums');
        $condominiumIds = array_map(function($item) {
            return $item['id'];
        }, $condominiumIds);

        $this->table('user_condominiuns')->insert([
            [
                'user_id' => $sindicoId,
                'condominium_id' => $condominiumIds[0],
            ],
            [
                'user_id' => $sindicoId,
                'condominium_id' => $condominiumIds[1],
            ],
            [
                'user_id' => $sindico2Id,
                'condominium_id' => $condominiumIds[2],
            ],
            [
                'user_id' => $sindico2Id,
                'condominium_id' => $condominiumIds[3],
            ],
            [
                'user_id' => $sindicoId,
                'condominium_id' => $condominiumIds[4],
            ],
        ])->save();
    }

}