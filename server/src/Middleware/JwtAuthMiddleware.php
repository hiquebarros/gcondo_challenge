<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Services\AuthService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class JwtAuthMiddleware implements MiddlewareInterface
{
    public function __construct(private AuthService $authService) {}

    public function process(Request $request, RequestHandler $handler): Response
    {
        $user = null;

        $authHeader = $request->getHeaderLine('Authorization');
        if (str_starts_with($authHeader, 'Bearer ')) {
            $token = trim(substr($authHeader, 7));
            if ($token !== '') {
                $user = $this->authService->getUserFromToken($token);
            }
        }

        $request = $request->withAttribute('user', $user);

        return $handler->handle($request);
    }
}
