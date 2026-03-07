<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Http\HttpStatus;
use App\Http\Response\ResponseError;
use App\Http\Response\ResponsePayload;
use App\Models\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Factory\ResponseFactory;

class RequireAuthMiddleware implements MiddlewareInterface
{
    public function __construct(private ResponseFactory $responseFactory) {}

    public function process(Request $request, RequestHandler $handler): Response
    {
        $user = $request->getAttribute('user');

        if (!$user instanceof User) {
            $response = $this->responseFactory->createResponse(HttpStatus::Unauthenticated->value);
            $payload = new ResponsePayload(HttpStatus::Unauthenticated, null, new ResponseError(
                'UNAUTHENTICATED',
                'Autenticação necessária.'
            ));
            $response->getBody()->write(json_encode($payload, JSON_PRETTY_PRINT));
            return $response->withHeader('Content-Type', 'application/json');
        }

        return $handler->handle($request);
    }
}
