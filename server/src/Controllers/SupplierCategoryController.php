<?php

namespace App\Controllers;

use App\Http\Response\ResponseBuilder;
use App\Models\SupplierCategory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class SupplierCategoryController
{
    public function list(Request $request, Response $response): Response
    {
        $data = ['supplier_categories' => SupplierCategory::all()];

        $response = ResponseBuilder::respondWithData($response, data: $data);

        return $response;
    }
}
