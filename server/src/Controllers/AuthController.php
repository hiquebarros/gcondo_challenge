<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Http\HttpStatus;
use App\Http\Response\ResponseBuilder;
use App\Models\User;
use App\Services\AuthService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController
{
    public function __construct(private AuthService $authService) {}

    public function login(Request $request, Response $response): Response
    {
        $body = (array) $request->getParsedBody();
        $email = trim((string) ($body['email'] ?? ''));
        $password = (string) ($body['password'] ?? '');

        if ($email === '' || $password === '') {
            $response = ResponseBuilder::respondWithData($response, HttpStatus::ValidationError, null);
            $response->getBody()->rewind();
            $response->getBody()->write(json_encode([
                'statusCode' => HttpStatus::ValidationError->value,
                'error' => ['type' => 'VALIDATION_ERROR', 'description' => 'E-mail e senha são obrigatórios.'],
            ], JSON_PRETTY_PRINT));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(HttpStatus::ValidationError->value);
        }

        $result = $this->authService->login($email, $password);

        $data = [
            'user' => $result['user'],
            'token' => $result['token'],
            'expires_at' => $result['expires_at'],
        ];

        $response = ResponseBuilder::respondWithData($response, HttpStatus::OK, $data);
        return $response->withHeader('Content-Type', 'application/json')->withStatus(HttpStatus::OK->value);
    }

    public function logout(Request $request, Response $response): Response
    {
        $response = ResponseBuilder::respondWithData($response, HttpStatus::OK, ['message' => 'Logout realizado.']);
        return $response->withHeader('Content-Type', 'application/json')->withStatus(HttpStatus::OK->value);
    }

    public function me(Request $request, Response $response): Response
    {
        /** @var User $user */
        $user = $request->getAttribute('user');

        $data = [
            'user' => $user->toArray(),
        ];

        $response = ResponseBuilder::respondWithData($response, HttpStatus::OK, $data);
        return $response->withHeader('Content-Type', 'application/json')->withStatus(HttpStatus::OK->value);
    }
}
