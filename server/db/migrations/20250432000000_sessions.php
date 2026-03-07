<?php

use App\Helpers\PhinxHelper;
use Phinx\Migration\AbstractMigration;

class Sessions extends AbstractMigration
{
    public function change()
    {
        $table = $this->table('sessions');

        PhinxHelper::setForeignColumn($table, 'user_id', 'users');
        $table->addColumn('session_token', 'string', ['null' => false])
            ->addColumn('csrf_token', 'string', ['null' => false])
            ->addColumn('expires_at', 'datetime', ['null' => false])
            ->addIndex('session_token', ['unique' => true])
            ->create();
    }
}
