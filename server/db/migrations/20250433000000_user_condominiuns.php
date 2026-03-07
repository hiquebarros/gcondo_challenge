<?php

use App\Helpers\PhinxHelper;
use Phinx\Migration\AbstractMigration;

class UserCondominiuns extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('user_condominiuns');

        PhinxHelper::setForeignColumn($table, 'user_id', 'users');  
        PhinxHelper::setForeignColumn($table, 'condominium_id', 'condominiums');

        $table->addIndex(['user_id', 'condominium_id'], ['unique' => true]);

        $table->create();
    }
}