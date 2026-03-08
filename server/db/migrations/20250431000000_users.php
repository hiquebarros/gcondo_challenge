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
            ->addColumn('role', 'enum', ['values' => ['pessoa_operacao', 'equipe_interna'], 'null' => false, 'default' => 'pessoa_operacao'])
            ->addIndex('email', ['unique' => true]);

        PhinxHelper::setDatetimeColumns($table);

        $table->create();
    }
}
