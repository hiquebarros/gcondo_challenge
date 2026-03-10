<?php

namespace App\Controllers;

use App\Http\Response\ResponseBuilder;
use App\Models\QuoteStatus;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class QuoteStatusController
{
    public function list(Request $request, Response $response): Response
    {
        $statuses = QuoteStatus::orderBy('name')->get();
        $data = ['quote_statuses' => $statuses];

        return ResponseBuilder::respondWithData($response, data: $data);
    }
}
