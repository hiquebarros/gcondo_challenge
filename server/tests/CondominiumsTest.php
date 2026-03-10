<?php

declare(strict_types=1);

namespace App\Tests\Integration;

use App\Models\User;
use App\Tests\ApiTestCase;

class CondominiumsTest extends ApiTestCase
{
    public function test_sindico_can_create_condominium(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'sindico@gcondo.com'],
            [
                'name' => 'Síndico',
                'password_hash' => password_hash('senha123', PASSWORD_BCRYPT),
                'role' => 'pessoa_operacao',
            ]
        );

        $this->login('sindico@gcondo.com');

        $response = $this->request(
            'POST',
            '/api/condominiums',
            [
                'name' => 'Condomínio Teste!',
                'zip_code' => '00000000',
                'url' => 'http://teste.com',
            ],
            true,
            [
                'Content-Type' => 'application/json',
            ]
        );

        $data = $this->parseJsonResponse($response);
        $this->assertSame(200, $response->getStatusCode(), 'POST /api/condominiums: ' . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $this->assertArrayHasKey('data', $data);
    }
}