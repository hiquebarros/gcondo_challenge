<?php

namespace App\Controllers;

use App\Http\HttpStatus;
use App\Http\Response\ResponseBuilder;
use App\Services\SupplierService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class SupplierController
{
    public function __construct(private SupplierService $service) {}

    public function list(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();

        $filters = [
            'legal_name' => trim($params['legal_name'] ?? ''),
            'cnpj' => trim($params['cnpj'] ?? ''),
            'email' => trim($params['email'] ?? ''),
            'supplier_category_id' => trim($params['supplier_category_id'] ?? ''),
        ];

        $data = ['suppliers' => $this->service->list($filters)];

        $response = ResponseBuilder::respondWithData($response, data: $data);

        return $response;
    }

    public function find(Request $request, Response $response, array $args): Response
    {
        $data = ['supplier' => $this->service->find((int) $args['id'])];

        $response = ResponseBuilder::respondWithData($response, data: $data);

        return $response;
    }

    public function create(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();

        $data = ['supplier' => $this->service->create($body)];

        $response = ResponseBuilder::respondWithData($response, HttpStatus::Created, $data);

        return $response;
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $body = $request->getParsedBody();

        $data = ['supplier' => $this->service->update((int) $args['id'], $body)];

        $response = ResponseBuilder::respondWithData($response, data: $data);

        return $response;
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $deleted = $this->service->delete((int) $args['id']);

        $status = $deleted ? HttpStatus::OK : HttpStatus::ServerError;

        $response = ResponseBuilder::respondWithData($response, $status);

        return $response;
    }
}
