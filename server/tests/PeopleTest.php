<?php

declare(strict_types=1);

namespace App\Tests\Integration;

use App\Models\Person;
use App\Models\User;
use App\Tests\ApiTestCase;

class PeopleTest extends ApiTestCase
{
    public function test_sindico_can_create_person(): void
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
            '/api/people',
            [
                'full_name' => 'Pessoa Teste!',
                'cpf' => '12345678900',
                'email' => 'pessoa@teste.com',
                'birth_date' => '1990-01-01',
            ],
            true,
            [
                'Content-Type' => 'application/json',
            ]
        );

        $data = $this->parseJsonResponse($response);
        $this->assertSame(200, $response->getStatusCode(), 'POST /api/people: ' . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $this->assertArrayHasKey('data', $data);
    }

    public function test_sindico_cant_create_person_with_invalid_data(): void
    {
        ## Tentando criar com CPF repetido
        $person = Person::query()->updateOrCreate(
            ['cpf' => '12345678900'],
            [
                'full_name' => 'Pessoa Teste!',
                'email' => 'pessoa@teste.com',
                'birth_date' => '1990-01-01',
            ]
        );

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
            '/api/people',
            [
                'full_name' => 'Pessoa Teste!',
                'cpf' => $person->cpf,
                'email' => 'pessoa@teste.com',
                'birth_date' => '1990-01-01',
            ],
            true,
            [
                'Content-Type' => 'application/json',
            ]
        );

        $this->parseJsonResponse($response);
        $this->assertSame(409, $response->getStatusCode());
    }
}