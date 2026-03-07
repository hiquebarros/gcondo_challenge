<?php

use App\Helpers\PhinxHelper;
use Phinx\Migration\AbstractMigration;

class SupplierCategories extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('supplier_categories')
            ->addColumn('name', 'string', ['null' => false]);

        PhinxHelper::setDatetimeColumns($table);

        $table->create();
    }
}
