<?php

use App\Controllers\AuthController;
use App\Controllers\CondominiumController;
use App\Controllers\PersonController;
use App\Controllers\QuoteCategoryController;
use App\Controllers\QuoteController;
use App\Controllers\QuoteStatusController;
use App\Controllers\SupplierCategoryController;
use App\Controllers\SupplierController;
use App\Controllers\UnitController;
use App\Http\Response\ResponseBuilder;
use App\Middleware\RequireAuthMiddleware;
use Slim\Routing\RouteCollectorProxy;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;

return function (App $app) {
    $app->options('/api/{routes:.*}', function (Request $request, Response $response) {
        return $response;
    });

    $app->group('/api', function (RouteCollectorProxy $group) {
        $group->get('', function (Request $request, Response $response) {
            $data = ['message' => 'Welcome to the Gcondo Slim REST API'];
            $response = ResponseBuilder::respondWithData($response, data: $data);
            return $response;
        });

        $group->post('/login', [AuthController::class, 'login']);
        $group->post('/logout', [AuthController::class, 'logout'])->add(RequireAuthMiddleware::class);
        $group->get('/auth/me', [AuthController::class, 'me'])->add(RequireAuthMiddleware::class);

        $group->group('/condominiums', function (RouteCollectorProxy $g) {
            $g->get('', [CondominiumController::class, 'list']);
            $g->get('/{id}', [CondominiumController::class, 'find']);
            $g->post('', [CondominiumController::class, 'create']);
            $g->put('/{id}', [CondominiumController::class, 'update']);
            $g->delete('/{id}', [CondominiumController::class, 'delete']);
        })->add(RequireAuthMiddleware::class);

        $group->group('/units', function (RouteCollectorProxy $g) {
            $g->get('', [UnitController::class, 'list']);
            $g->get('/{id}', [UnitController::class, 'find']);
            $g->post('', [UnitController::class, 'create']);
            $g->put('/{id}', [UnitController::class, 'update']);
            $g->delete('/{id}', [UnitController::class, 'delete']);
        })->add(RequireAuthMiddleware::class);

        $group->group('/people', function (RouteCollectorProxy $g) {
            $g->get('', [PersonController::class, 'list']);
            $g->get('/{id}', [PersonController::class, 'find']);
            $g->post('', [PersonController::class, 'create']);
            $g->put('/{id}', [PersonController::class, 'update']);
            $g->delete('/{id}', [PersonController::class, 'delete']);
        })->add(RequireAuthMiddleware::class);

        $group->get('/supplier-categories', [SupplierCategoryController::class, 'list']);

        $group->group('/suppliers', function (RouteCollectorProxy $g) {
            $g->get('', [SupplierController::class, 'list']);
            $g->get('/{id}', [SupplierController::class, 'find']);
            $g->post('', [SupplierController::class, 'create']);
            $g->put('/{id}', [SupplierController::class, 'update']);
            $g->delete('/{id}', [SupplierController::class, 'delete']);
        })->add(RequireAuthMiddleware::class);

        $group->get('/quote-categories', [QuoteCategoryController::class, 'list'])->add(RequireAuthMiddleware::class);
        $group->get('/quote-statuses', [QuoteStatusController::class, 'list'])->add(RequireAuthMiddleware::class);

        $group->group('/quotes', function (RouteCollectorProxy $g) {
            $g->get('', [QuoteController::class, 'list']);
            $g->post('', [QuoteController::class, 'create']);
        })->add(RequireAuthMiddleware::class);
    });
};
