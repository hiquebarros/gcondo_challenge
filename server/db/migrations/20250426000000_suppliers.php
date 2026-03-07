<?php

use App\Helpers\PhinxHelper;
use Phinx\Migration\AbstractMigration;

class Suppliers extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('suppliers')
            ->addColumn('legal_name', 'string', ['null' => false])
            ->addColumn('trade_name', 'string')
            ->addColumn('cnpj', 'string', ['limit' => 14, 'null' => false])
            ->addColumn('email', 'string', ['null' => false]);

        PhinxHelper::setForeignColumn($table, 'supplier_address_id', 'supplier_addresses', true);
        PhinxHelper::setForeignColumn($table, 'supplier_category_id', 'supplier_categories');
        PhinxHelper::setForeignColumn($table, 'created_by_condominium_id', 'condominiums');
        PhinxHelper::setDatetimeColumns($table);

        $table->create();
    }
}
