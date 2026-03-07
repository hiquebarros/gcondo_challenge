<?php

use App\Helpers\PhinxHelper;
use Phinx\Migration\AbstractMigration;

class QuoteCategories extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('quote_categories')
            ->addColumn('name', 'string', ['null' => false]);

        PhinxHelper::setDatetimeColumns($table);

        $table->create();
    }
}
