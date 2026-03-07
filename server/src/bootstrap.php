<?php

use App\Http\Error\ErrorHandler;
use App\Middleware\JwtAuthMiddleware;
use App\Services\AuthService;
use Carbon\Carbon;
use DI\Container;
use Dotenv\Dotenv;
use Slim\Factory\AppFactory;
use Illuminate\Database\Capsule\Manager as Capsule;

require __DIR__ . '/../vendor/autoload.php';

// Required to production environment, but not to local development
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

$dotenv->required([
    'DATABASE_DRIVER',
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_NAME',
    'DATABASE_USERNAME',
    'DATABASE_PASSWORD',

    'CORS_ALLOWED_ORIGIN',
    'JWT_SECRET',
]);

$container = new Container();

$container->set('database', function () {
    $capsule = new Capsule;

    $capsule->addConnection(require __DIR__ . '/config/database.php');
    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    return $capsule;
});

$container->set(AuthService::class, function () {
    return new AuthService((string) getenv('JWT_SECRET'));
});

AppFactory::setContainer($container);

$app = AppFactory::create();

$app->addBodyParsingMiddleware();

$app->addRoutingMiddleware();

// JWT auth: last added runs first (LIFO), sets user from Authorization: Bearer <token>
$app->add(JwtAuthMiddleware::class);

$errorMiddleware = $app->addErrorMiddleware(true, true, true);

$callableResolver = $app->getCallableResolver();
$responseFactory = $app->getResponseFactory();

$errorHandler = new ErrorHandler($callableResolver, $responseFactory);

$errorMiddleware->setDefaultErrorHandler($errorHandler);

// Register routes
$routes = require __DIR__ . '/config/routes.php';
$routes($app);

// Connect to database
$container->get('database');

return $app;
