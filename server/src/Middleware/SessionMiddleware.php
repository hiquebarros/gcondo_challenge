<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Services\AuthService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class SessionMiddleware implements MiddlewareInterface
{
    public function __construct(private AuthService $authService) {}

    public function process(Request $request, RequestHandler $handler): Response
    {
        $cookies = $request->getCookieParams();
        $sessionToken = $cookies[AuthService::getSessionCookieName()] ?? null;

        $session = null;
        $user = null;

        if ($sessionToken !== null && $sessionToken !== '') {
            $session = $this->authService->getSessionFromToken($sessionToken);
            if ($session !== null) {
                $user = $session->user;
            }
        }

        $request = $request
            ->withAttribute('session', $session)
            ->withAttribute('user', $user);

        return $handler->handle($request);
    }
}
