<?php

use App\Helpers\PhinxHelper;
use Phinx\Migration\AbstractMigration;

class QuoteStatuses extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('quote_statuses')
            ->addColumn('name', 'string', ['null' => false]);

        PhinxHelper::setDatetimeColumns($table);

        $table->create();
    }
}
