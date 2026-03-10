<?php

namespace App\Controllers;

use App\Http\HttpStatus;
use App\Http\Response\ResponseBuilder;
use App\Models\User;
use App\Services\QuoteService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class QuoteController
{
    public function __construct(private QuoteService $service) {}

    public function list(Request $request, Response $response): Response
    {
        /** @var User $user */
        $user = $request->getAttribute('user');
        $data = ['quotes' => $this->service->list($user)];

        return ResponseBuilder::respondWithData($response, data: $data);
    }

    public function create(Request $request, Response $response): Response
    {
        /** @var User $user */
        $user = $request->getAttribute('user');
        $body = $request->getParsedBody();

        $data = ['quote' => $this->service->create($body, $user)];

        return ResponseBuilder::respondWithData($response, HttpStatus::Created, $data);
    }
}
