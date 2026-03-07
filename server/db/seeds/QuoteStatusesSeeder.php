<?php

use Phinx\Seed\AbstractSeed;

class QuoteStatusesSeeder extends AbstractSeed
{
    public function run(): void
    {
        $now = date('Y-m-d H:i:s');

        $data = [
            ['name' => 'Rascunho', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Enviado', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Em análise', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Aprovado', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Reprovado', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
            ['name' => 'Cancelado', 'created_at' => $now, 'updated_at' => $now, 'deleted_at' => null],
        ];

        $this->table('quote_statuses')->insert($data)->save();
    }
}
