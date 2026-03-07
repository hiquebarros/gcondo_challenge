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
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
        ];

        $this->table('users')->insert($data)->save();
    }
}
