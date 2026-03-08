<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Http\HttpStatus;
use App\Http\Response\ResponseError;
use App\Http\Response\ResponsePayload;
use App\Services\AuthService;
use App\Models\Session;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Factory\ResponseFactory;

class CsrfMiddleware implements MiddlewareInterface
{
    private const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

    public function __construct(
        private ResponseFactory $responseFactory,
        private AuthService $authService
    ) {}

    public function process(Request $request, RequestHandler $handler): Response
    {
        if (in_array($request->getMethod(), self::SAFE_METHODS, true)) {
            return $handler->handle($request);
        }

        $path = rtrim($request->getUri()->getPath(), '/') ?: '/'; //remove /api from path if exists
        $path = str_replace('/api', '', $path);
        
        if ($path === '/login') {
            return $handler->handle($request);
        }

        $session = $request->getAttribute('session');

        if (!$session instanceof Session) {
            return $this->jsonResponse(HttpStatus::Unauthenticated, 'Sessão inválida ou expirada.');
        }

        $csrfHeader = $request->getHeaderLine('X-CSRF-Token');

        if ($csrfHeader === '' || !$this->authService->validateCsrf($session, $csrfHeader)) {
            return $this->jsonResponse(HttpStatus::InsufficientPrivileges, 'Token CSRF inválido.');
        }

        return $handler->handle($request);
    }

    private function jsonResponse(HttpStatus $status, string $message): Response
    {
        $response = $this->responseFactory->createResponse($status->value);
        $payload = new ResponsePayload(
            $status,
            null,
            new ResponseError('CSRF_ERROR', $message)
        );
        $response->getBody()->write(json_encode($payload, JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
