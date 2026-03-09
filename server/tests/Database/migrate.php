<?php

declare(strict_types=1);

use Phinx\Config\Config;
use Phinx\Migration\Manager;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;

$configArray = [
    'paths' => [
        'migrations' => __DIR__ . '/../../db/migrations',
    ],
    'environments' => [
        'default_migration_table' => 'phinxlog',
        'default_environment' => 'testing',
        'testing' => [
            'adapter' => 'sqlite',
            'name' => __DIR__ . '/../database',
        ],
    ],
];

$config = new Config($configArray);

$input = new ArrayInput([]);
$output = new NullOutput();

$manager = new Manager($config, $input, $output);

$environment = 'testing';

$manager->migrate($environment);