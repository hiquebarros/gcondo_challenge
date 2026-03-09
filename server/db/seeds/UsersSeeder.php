<?php

use Phinx\Seed\AbstractSeed;
use PDO;

class UsersSeeder extends AbstractSeed
{
    /**
     * Método Phinx
     */
    public function run(): void
    {
        $this->seedUsers($this->getAdapter()->getConnection());
    }

    /**
     * Método para rodar manualmente com PDO nos testes
     */
    public function seedUsers(PDO $pdo): void
    {
        $now = date('Y-m-d H:i:s');
        $passwordHash = password_hash('senha123', PASSWORD_BCRYPT);

        $data = [
            [
                'name' => 'Administrador',
                'email' => 'admin@gcondo.com',
                'password_hash' => $passwordHash,
                'role' => 'equipe_interna',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Pessoa de operação 1',
                'email' => 'pessoa_operacao@gcondo.com',
                'password_hash' => $passwordHash,
                'role' => 'pessoa_operacao',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ],
            [
                'name' => 'Pessoa de operação 2',
                'email' => 'pessoa_operacao2@gcondo.com',
                'password_hash' => $passwordHash,
                'role' => 'pessoa_operacao',
                'created_at' => $now,
                'updated_at' => $now,
                'deleted_at' => null,
            ]
        ];

        // Inserção direta via PDO
        $stmt = $pdo->prepare("
            INSERT INTO users 
                (name, email, password_hash, role, created_at, updated_at, deleted_at)
            VALUES (:name, :email, :password_hash, :role, :created_at, :updated_at, :deleted_at)
        ");

        foreach ($data as $row) {
            $stmt->execute($row);
        }
    }
}