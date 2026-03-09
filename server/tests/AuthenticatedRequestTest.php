<?php

declare(strict_types=1);

namespace App\Tests\Integration;

use App\Models\User;
use App\Tests\ApiTestCase;

class AuthenticatedRequestTest extends ApiTestCase
{
    public function test_authenticated_request(): void
    {
        // Seed 1 user direto no banco (senha sempre senha123 para o login do teste)
        User::query()->updateOrCreate(
            ['email' => 'admin@gcondo.com'],
            [
                'name' => 'Administrador',
                'password_hash' => password_hash('senha123', PASSWORD_BCRYPT),
                'role' => 'equipe_interna',
            ]
        );

        $this->login();

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