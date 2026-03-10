<?php

use Phinx\Seed\AbstractSeed;

class PeopleSeeder extends AbstractSeed
{
    /**
     * Método Phinx
     */
    public function run(): void
    {
        $now = date('Y-m-d H:i:s');
        $data = [
            [
                'full_name' => 'Ciclano de Oliveira',
                'cpf' => '12345678900',
                'email' => 'ciclano@gcondo.com',
                'birth_date' => '1990-01-01',
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'full_name' => 'Fulano de Souza',
                'cpf' => '12345678901',
                'email' => 'fulano@gcondo.com',
                'birth_date' => '1990-01-01',
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'full_name' => 'Beltrano de Souza',
                'email' => 'beltrano@gcondo.com',
                'cpf' => '12345678902',
                'birth_date' => '1990-01-01',
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'full_name' => 'João Pedro Pereira',
                'cpf' => '12345678903',
                'email' => 'joao@gcondo.com',
                'birth_date' => '1990-01-01',
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'full_name' => 'Maria da Silva',
                'cpf' => '12345678904',
                'email' => 'maria@gcondo.com',
                'birth_date' => '1990-01-01',
                'updated_at' => $now,
                'deleted_at' => null,
            ],
        ];

        $this->table('people')->insert($data)->save();
    }

}