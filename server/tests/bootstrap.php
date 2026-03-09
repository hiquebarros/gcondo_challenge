<?php

require __DIR__ . '/../vendor/autoload.php';

/*
 |-----------------------------------------
 | Testing environment
 |-----------------------------------------
*/

$_ENV['APP_ENV'] = 'testing';
$_ENV['DATABASE_DRIVER'] = 'sqlite';

/*
 |-----------------------------------------
 | Recreate database file
 |-----------------------------------------
*/

$dbFile = __DIR__ . '/database.sqlite3';

if (file_exists($dbFile)) unlink($dbFile);
touch($dbFile);
$_ENV['DATABASE_NAME'] = $dbFile;
touch($dbFile);

/*
 |-----------------------------------------
 | Boot application
 |-----------------------------------------
*/

$app = require __DIR__ . '/../src/bootstrap.php';

$GLOBALS['app'] = $app;

/*
 |-----------------------------------------
 | Run migrations and seeds
 |-----------------------------------------
 */

require __DIR__ . '/Database/migrate.php';
#require __DIR__ . '/Database/seed.php';