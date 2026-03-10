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
        $params = $request->getQueryParams();
        $filters = [
            'quote_category_id' => trim($params['quote_category_id'] ?? ''),
            'quote_status_id' => trim($params['quote_status_id'] ?? ''),
            'condominium_id' => trim($params['condominium_id'] ?? ''),
            'supplier_id' => trim($params['supplier_id'] ?? ''),
        ];
        $data = ['quotes' => $this->service->list($user, $filters)];

        return ResponseBuilder::respondWithData($response, data: $data);
    }

    public function find(Request $request, Response $response, array $args): Response
    {
        /** @var User $user */
        $user = $request->getAttribute('user');
        $data = ['quote' => $this->service->find((int) $args['id'], $user)];

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

    public function update(Request $request, Response $response, array $args): Response
    {
        /** @var User $user */
        $user = $request->getAttribute('user');
        $body = $request->getParsedBody();

        $data = ['quote' => $this->service->update((int) $args['id'], $body, $user)];

        return ResponseBuilder::respondWithData($response, data: $data);
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        /** @var User $user */
        $user = $request->getAttribute('user');
        $this->service->delete((int) $args['id'], $user);

        return ResponseBuilder::respondWithData($response, HttpStatus::OK, []);
    }
}
