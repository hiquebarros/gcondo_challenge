<?php

use App\Helpers\PhinxHelper;
use Phinx\Migration\AbstractMigration;

class SupplierAddresses extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('supplier_addresses')
            ->addColumn('street', 'string', ['null' => false])
            ->addColumn('number', 'string', ['limit' => 20])
            ->addColumn('complement', 'string')
            ->addColumn('neighborhood', 'string')
            ->addColumn('city', 'string', ['null' => false])
            ->addColumn('state', 'string', ['limit' => 2])
            ->addColumn('country', 'string')
            ->addColumn('postal_code', 'string', ['limit' => 8]);

        PhinxHelper::setDatetimeColumns($table);

        $table->create();
    }
}
