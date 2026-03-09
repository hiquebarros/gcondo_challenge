<?php

declare(strict_types=1);

namespace App\Tests;

use Psr\Http\Message\ResponseInterface;
use Slim\App;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Factory\UriFactory;
use Slim\Psr7\Request;

abstract class ApiTestCase extends \PHPUnit\Framework\TestCase
{
    private static ?App $app = null;

    /** @var array{csrf_token: string, cookie: string} */
    private static ?array $auth = null;

    protected static function app(): App
    {
        if (self::$app === null) {
            self::$app = require __DIR__ . '/../src/bootstrap.php';
        }
        return self::$app;
    }

    /**
     * Login and store CSRF + cookie for subsequent requests.
     * Uses user from UsersSeeder: admin@gcondo.com / senha123
     */
    protected function login(): void
    {
        if (self::$auth !== null) {
            return;
        }
        $response = $this->request('POST', '/api/login', [
            'email' => 'admin@gcondo.com',
            'password' => 'senha123',
        ]);
        $responseBody = (string) $response->getBody();
        self::assertSame(200, $response->getStatusCode(), 'Login falhou: ' . $responseBody);
        $body = json_decode((string) $response->getBody(), true);
        self::assertArrayHasKey('data', $body);
        self::assertArrayHasKey('csrf_token', $body['data']);
        $csrfToken = $body['data']['csrf_token'];
        $setCookie = $response->getHeaderLine('Set-Cookie');
        self::assertNotEmpty($setCookie, 'Login must return Set-Cookie');
        // Cookie header deve ser só name=value; o Set-Cookie traz "name=value; Path=...; HttpOnly..."
        $cookieForRequest = trim(explode(';', $setCookie)[0]);
        self::$auth = ['csrf_token' => $csrfToken, 'cookie' => $cookieForRequest];
    }

    /**
     * Perform an API request. For mutating methods (POST/PUT/DELETE) after login, pass auth: true to send cookie + CSRF.
     *
     * @param array<string, mixed>|null $body
     * @param array<string, string>     $headers
     */
    protected function request(
        string $method,
        string $path,
        ?array $body = null,
        bool $auth = false,
        array $headers = []
    ): ResponseInterface {
        $app = self::app();
        $uri = (new UriFactory())->createUri('http://localhost' . $path);
        $request = (new ServerRequestFactory())->createServerRequest($method, $uri);

        if ($body !== null && in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
            $stream = (new StreamFactory())->createStream(json_encode($body));
            $request = $request->withBody($stream)->withHeader('Content-Type', 'application/json');
        }

        foreach ($headers as $name => $value) {
            $request = $request->withHeader($name, $value);
        }

        if ($auth && self::$auth !== null) {
            $request = $request->withHeader('Cookie', self::$auth['cookie'])
                ->withHeader('X-CSRF-Token', self::$auth['csrf_token']);
            // PSR-7: requisição construída em código não preenche getCookieParams() pelo header; o middleware lê getCookieParams()
            $cookiePair = explode('=', self::$auth['cookie'], 2);
            if (count($cookiePair) === 2) {
                $request = $request->withCookieParams([trim($cookiePair[0]) => trim($cookiePair[1])]);
            }
        }

        return $app->handle($request);
    }

    protected static function resetAuth(): void
    {
        self::$auth = null;
    }

    /** @return array{data?: array, error?: array, statusCode?: int} */
    protected function parseJsonResponse(ResponseInterface $response): array
    {
        $decoded = json_decode((string) $response->getBody(), true);
        return is_array($decoded) ? $decoded : [];
    }
}
