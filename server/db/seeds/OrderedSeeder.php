<?php

use Phinx\Seed\AbstractSeed;

class OrderedSeeder extends AbstractSeed
{
    /**
     * Executa os seeders na ordem: User -> People -> Condominium -> demais.
     */
    public function run(): void
    {
        $adapter = $this->getAdapter();

        $seeders = [
            UsersSeeder::class,
            PeopleSeeder::class,
            CondominiumSeeder::class,
            QuoteCategoriesSeeder::class,
            QuoteStatusesSeeder::class,
            SupplierCategoriesSeeder::class,
        ];

        foreach ($seeders as $class) {
            $seeder = new $class();
            $seeder->setAdapter($adapter);
            $seeder->run();
        }
    }
}
