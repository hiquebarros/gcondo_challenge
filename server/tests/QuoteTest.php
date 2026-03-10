<?php

declare(strict_types=1);

namespace App\Tests\Integration;

use App\Models\Condominium;
use App\Models\QuoteCategory;
use App\Models\QuoteStatus;
use App\Models\Supplier;
use App\Models\SupplierAddress;
use App\Models\SupplierCategory;
use App\Models\User;
use App\Tests\ApiTestCase;

class QuoteTest extends ApiTestCase 
{
    public function test_sindico_can_create_quote(): void
    {
        $user = User::query()->updateOrCreate(
            ['email' => 'sindico@gcondo.com'],
            [
                'name' => 'Síndico',
                'password_hash' => password_hash('senha123', PASSWORD_BCRYPT),
                'role' => 'pessoa_operacao',
            ]
        );

        $supplierAddress = SupplierAddress::query()->updateOrCreate(
            ['street' => 'Rua Teste', 'number' => '123', 'complement' => 'Apto 1', 'neighborhood' => 'Bairro Teste', 'city' => 'Cidade Teste', 'state' => 'SP', 'postal_code' => '12345678'],
        );

        $supplierCategory = SupplierCategory::query()->updateOrCreate(
            ['name' => 'Categoria Teste'],
        );

        $supplier = Supplier::query()->updateOrCreate(
            ['legal_name' => 'Fornecedor Teste!', 'cnpj' => '12345678900000', 'email' => 'fornecedor@teste.com'],   
            [
                'trade_name' => 'Fornecedor Teste!',
                'cnpj' => '12345678900000',
                'email' => 'fornecedor@teste.com',
                'supplier_address_id' => $supplierAddress->id,
                'supplier_category_id' => $supplierCategory->id,
            ]
        );

        $condominium = Condominium::query()->updateOrCreate(
            ['name' => 'Condomínio Teste!', 'zip_code' => '00000000', 'url' => 'http://teste.com'],
        );

        $user->condominiums()->attach($condominium->id);

        $quoteCategory = QuoteCategory::query()->updateOrCreate(
            ['name' => 'Categoria Teste'],
        );

        $quoteStatus = QuoteStatus::query()->updateOrCreate(
            ['name' => 'Status Teste'],
        );

        $this->login('sindico@gcondo.com');

        $response = $this->request(
            'POST',
            '/api/quotes',
            [
                'title' => 'Orçamento Teste!',
                'description' => 'Descrição do orçamento',
                'amount' => '100.00',
                'supplier_id' => $supplier->id,
                'condominium_id' => $condominium->id,
                'quote_category_id' => $quoteCategory->id,
                'quote_status_id' => $quoteStatus->id,
            ],
            true,
            [
                'Content-Type' => 'application/json',
            ]
        );

        $data = $this->parseJsonResponse($response);
        $this->assertSame(200, $response->getStatusCode(), 'POST /api/quotes: ' . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $this->assertArrayHasKey('data', $data);
    }
}   