<?php

declare(strict_types=1);

namespace App\Tests\Integration;

use App\Models\Person;
use App\Models\SupplierCategory;
use App\Models\User;
use App\Tests\ApiTestCase;

class SupplierTest extends ApiTestCase
{
    public function test_sindico_can_create_supplier(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'sindico@gcondo.com'],
            [
                'name' => 'Síndico',
                'password_hash' => password_hash('senha123', PASSWORD_BCRYPT),
                'role' => 'pessoa_operacao',
            ]
        );

        $person = Person::query()->updateOrCreate(
            ['email' => 'pessoa@teste.com'],
            [
                'full_name' => 'Pessoa Teste!',
                'cpf' => '12345678900',
                'email' => 'pessoa@teste.com',
                'birth_date' => '1990-01-01',
            ]
        );

        $supplierCategory = SupplierCategory::query()->updateOrCreate(
            ['name' => 'Categoria Teste'],
        );

        $this->login('sindico@gcondo.com');

        $response = $this->request(
            'POST',
            '/api/suppliers',
            [
                'legal_name' => 'Fornecedor Teste!',
                'cnpj' => '12345678900000',
                'email' => 'fornecedor@teste.com',
                'supplier_category_id' => $supplierCategory->id,
                'person_ids' => [$person->id],
                'address' => [
                    'street' => 'Rua Teste',
                    'number' => '123',
                    'complement' => 'Apto 1',
                    'neighborhood' => 'Bairro Teste',
                    'city' => 'Cidade Teste',
                    'state' => 'SP',
                    'postal_code' => '12345678',
                ],
            ],
            true,
            [
                'Content-Type' => 'application/json',
            ]
        );

        $data = $this->parseJsonResponse($response);
        $this->assertSame(200, $response->getStatusCode(), 'POST /api/suppliers: ' . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $this->assertArrayHasKey('data', $data);
    }
}