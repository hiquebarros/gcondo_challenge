<?php

namespace App\Controllers;

use App\Http\Response\ResponseBuilder;
use App\Models\QuoteCategory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class QuoteCategoryController
{
    public function list(Request $request, Response $response): Response
    {
        $categories = QuoteCategory::orderBy('name')->get();
        $data = ['quote_categories' => $categories];

        return ResponseBuilder::respondWithData($response, data: $data);
    }
}
