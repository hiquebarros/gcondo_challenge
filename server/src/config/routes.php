<?php

use App\Controllers\CondominiumController;
use App\Controllers\PersonController;
use App\Controllers\SupplierCategoryController;
use App\Controllers\SupplierController;
use App\Controllers\UnitController;
use App\Http\Response\ResponseBuilder;
use Slim\Routing\RouteCollectorProxy;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;

return function (App $app) {
    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    $app->get('/', function (Request $request, Response $response) {
        $data = ['message' => 'Welcome to the Gcondo Slim REST API'];

        $response = ResponseBuilder::respondWithData($response, data: $data);

        return $response;
    });

    $app->group('/condominiums', function (RouteCollectorProxy $group) {
        $group->get('', [CondominiumController::class, 'list']);
        $group->get('/{id}', [CondominiumController::class, 'find']);
        $group->post('', [CondominiumController::class, 'create']);
        $group->put('/{id}', [CondominiumController::class, 'update']);
        $group->delete('/{id}', [CondominiumController::class, 'delete']);
    });

    $app->group('/units', function (RouteCollectorProxy $group) {
        $group->get('', [UnitController::class, 'list']);
        $group->get('/{id}', [UnitController::class, 'find']);
        $group->post('', [UnitController::class, 'create']);
        $group->put('/{id}', [UnitController::class, 'update']);
        $group->delete('/{id}', [UnitController::class, 'delete']);
    });

    $app->group('/people', function (RouteCollectorProxy $group) {
        $group->get('', [PersonController::class, 'list']);
        $group->get('/{id}', [PersonController::class, 'find']);
        $group->post('', [PersonController::class, 'create']);
        $group->put('/{id}', [PersonController::class, 'update']);
        $group->delete('/{id}', [PersonController::class, 'delete']);
    });

    $app->get('/supplier-categories', [SupplierCategoryController::class, 'list']);

    $app->group('/suppliers', function (RouteCollectorProxy $group) {
        $group->get('', [SupplierController::class, 'list']);
        $group->get('/{id}', [SupplierController::class, 'find']);
        $group->post('', [SupplierController::class, 'create']);
        $group->put('/{id}', [SupplierController::class, 'update']);
        $group->delete('/{id}', [SupplierController::class, 'delete']);
    });
};
