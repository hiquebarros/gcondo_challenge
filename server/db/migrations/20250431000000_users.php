<?php

use App\Helpers\PhinxHelper;
use Phinx\Migration\AbstractMigration;

class Users extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('users')
            ->addColumn('name', 'string', ['null' => false])
            ->addColumn('email', 'string', ['null' => false])
            ->addColumn('password_hash', 'string', ['null' => false])
            ->addIndex('email', ['unique' => true]);

        PhinxHelper::setDatetimeColumns($table);

        $table->create();
    }
}
