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
                'name' => 'Administrador',
                'email' => 'admin@gcondo.com',
                'password_hash' => $passwordHash,
                'role' => 'equipe_interna',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Pessoa de operação 1',
                'email' => 'pessoa_operacao@gcondo.com',
                'password_hash' => $passwordHash,
                'role' => 'pessoa_operacao',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Pessoa de operação 2',
                'email' => 'pessoa_operacao2@gcondo.com',
                'password_hash' => $passwordHash,
                'role' => 'pessoa_operacao',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Coordenador',
                'email' => 'coordenacao@gcondo.com',
                'password_hash' => $passwordHash,
                'role' => 'coordenacao',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
        ];

        $this->table('users')->insert($data)->save();
    }
}
