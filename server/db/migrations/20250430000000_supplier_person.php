<?php

use App\Helpers\PhinxHelper;
use Phinx\Migration\AbstractMigration;

class SupplierPerson extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('supplier_person');

        PhinxHelper::setForeignColumn($table, 'supplier_id', 'suppliers');
        PhinxHelper::setForeignColumn($table, 'person_id', 'people');

        $table->addIndex(['supplier_id', 'person_id'], ['unique' => true]);
        $table->create();
    }
}
