<?php

use Phinx\Seed\AbstractSeed;

class UsersSeeder extends AbstractSeed
{
    public function run(): void
    {
        $now = date('Y-m-d H:i:s');
        $passwordHash = password_hash('senha123', PASSWORD_BCRYPT);

        $data = [
            [
                'name' => 'Vinicius Santos',
                'email' => 'vinicius@gcondo.com',
                'password_hash' => $passwordHash,
                'role' => 'equipe_interna',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Síndico Da Silva',
                'email' => 'sindico@gcondo.com',
                'password_hash' => $passwordHash,
                'role' => 'pessoa_operacao',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Síndico dos santos',
                'email' => 'sindico2@gcondo.com',
                'password_hash' => $passwordHash,
                'role' => 'pessoa_operacao',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ]
        ];

        $this->table('users')->insert($data)->save();
    }

}