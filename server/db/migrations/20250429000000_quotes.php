<?php

use App\Helpers\PhinxHelper;
use Phinx\Migration\AbstractMigration;

class Quotes extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('quotes')
            ->addColumn('title', 'string', ['null' => false])
            ->addColumn('description', 'text')
            ->addColumn('amount', 'decimal', ['precision' => 12, 'scale' => 2]);

        PhinxHelper::setForeignColumn($table, 'supplier_id', 'suppliers');
        PhinxHelper::setForeignColumn($table, 'condominium_id', 'condominiums');
        PhinxHelper::setForeignColumn($table, 'quote_category_id', 'quote_categories');
        PhinxHelper::setForeignColumn($table, 'quote_status_id', 'quote_statuses');
        PhinxHelper::setDatetimeColumns($table);

        $table->create();
    }
}
