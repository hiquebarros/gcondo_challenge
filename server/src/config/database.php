<?php

$driver = $_ENV['DATABASE_DRIVER'] ?? 'mysql';

if ($driver === 'sqlite') {
    return [
        'driver' => 'sqlite',
        'database' => __DIR__ . '/../../tests/database.sqlite3',
        'prefix' => '',
    ];
}

return [
    'driver' => 'mysql',
    'host' => $_ENV['DATABASE_HOST'] ?? '127.0.0.1',
    'port' => $_ENV['DATABASE_PORT'] ?? 3306,
    'database' => $_ENV['DATABASE_NAME'] ?? 'app',
    'username' => $_ENV['DATABASE_USERNAME'] ?? 'root',
    'password' => $_ENV['DATABASE_PASSWORD'] ?? '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
];