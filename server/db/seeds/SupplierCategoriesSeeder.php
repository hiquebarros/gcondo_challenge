<?php

use Phinx\Seed\AbstractSeed;

class SupplierCategoriesSeeder extends AbstractSeed
{
    public function run(): void
    {
        $now = date('Y-m-d H:i:s');

        $data = [
            ['name' => 'Manutenção predial', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Limpeza e conservação', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Segurança e portaria', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Elétrica e hidráulica', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Obras e reformas', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Administrativo e outros', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
        ];

        $this->table('supplier_categories')->insert($data)->save();
    }
}
