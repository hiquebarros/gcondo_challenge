<?php

declare(strict_types=1);

namespace App\Http\Response;

use Psr\Http\Message\ResponseInterface as Response;
use Slim\ResponseEmitter as SlimResponseEmitter;

class ResponseEmitter extends SlimResponseEmitter
{
    /**
     * {@inheritdoc}
     */
    public function emit(Response $response): void
    {
        // Use getenv() so CORS works when env is set by Docker/PHP-FPM (where $_ENV may be empty)
        $origin = (string) (getenv('CORS_ALLOWED_ORIGIN') ?: $_ENV['CORS_ALLOWED_ORIGIN'] ?? '');

        $response = $response
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization, X-CSRF-Token')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
            ->withHeader('Access-Control-Allow-Credentials', 'true');

        if (ob_get_contents()) {
            ob_clean();
        }

        parent::emit($response);
    }
}
