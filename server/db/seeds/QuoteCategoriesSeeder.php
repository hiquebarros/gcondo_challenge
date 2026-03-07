<?php

use Phinx\Seed\AbstractSeed;

class QuoteCategoriesSeeder extends AbstractSeed
{
    public function run(): void
    {
        $now = date('Y-m-d H:i:s');

        $data = [
            ['name' => 'Manutenção preventiva', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Manutenção corretiva', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Obra ou reforma', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Contratação recorrente', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Compra pontual', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
        ];

        $this->table('quote_categories')->insert($data)->save();
    }
}
