<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Http\HttpStatus;
use App\Http\Response\ResponseBuilder;
use App\Services\AuthService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class AuthController
{
    private const COOKIE_MAX_AGE_DAYS = 7;

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
            'csrf_token' => $result['csrf_token'],
            'expires_at' => $result['expires_at'],
        ];

        $response = ResponseBuilder::respondWithData($response, HttpStatus::OK, $data);
        $response = $response->withHeader('Content-Type', 'application/json')->withStatus(HttpStatus::OK->value);

        $cookieValue = sprintf(
            '%s=%s; Path=/; HttpOnly; SameSite=Strict; Max-Age=%d',
            AuthService::getSessionCookieName(),
            $result['session_token'],
            self::COOKIE_MAX_AGE_DAYS * 86400
        );
        $response = $response->withAddedHeader('Set-Cookie', $cookieValue);

        return $response;
    }

    public function logout(Request $request, Response $response): Response
    {
        $session = $request->getAttribute('session');

        if ($session !== null) {
            $this->authService->logout($session->session_token);
        }

        $response = ResponseBuilder::respondWithData($response, HttpStatus::OK, ['message' => 'Logout realizado.']);
        $response = $response->withHeader('Content-Type', 'application/json')->withStatus(HttpStatus::OK->value);

        $clearCookie = sprintf(
            '%s=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
            AuthService::getSessionCookieName()
        );
        return $response->withAddedHeader('Set-Cookie', $clearCookie);
    }

    public function me(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        $session = $request->getAttribute('session');

        $data = [
            'user' => $user->toArray(),
            'csrf_token' => $session->csrf_token,
        ];

        $response = ResponseBuilder::respondWithData($response, HttpStatus::OK, $data);
        return $response->withHeader('Content-Type', 'application/json')->withStatus(HttpStatus::OK->value);
    }
}
