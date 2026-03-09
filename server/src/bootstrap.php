<?php

use App\Http\Error\ErrorHandler;
use App\Middleware\CsrfMiddleware;
use App\Middleware\SessionMiddleware;
use Carbon\Carbon;
use DI\Container;
use Dotenv\Dotenv;
use Slim\Factory\AppFactory;
use Illuminate\Database\Capsule\Manager as Capsule;

require __DIR__ . '/../vendor/autoload.php';

$env = $_ENV['APP_ENV'] ?? $_SERVER['APP_ENV'] ?? 'local';

$envFile = $env === 'testing'
    ? '.env.testing'
    : '.env.dev';

$dotenv = Dotenv::createImmutable(dirname(__DIR__), $envFile);
$dotenv->safeLoad();

if ($env !== 'testing') {
    $dotenv->required([
        'DATABASE_DRIVER',
        'DATABASE_HOST',
        'DATABASE_PORT',
        'DATABASE_NAME',
        'DATABASE_USERNAME',
        'DATABASE_PASSWORD',
        'CORS_ALLOWED_ORIGIN',
    ]);
}

$container = new Container();

$container->set('database', function () {
    $capsule = new Capsule;

    $capsule->addConnection(require __DIR__ . '/config/database.php');
    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    return $capsule;
});

$container->set('pdo', function (Container $container) {

    $capsule = $container->get('database');

    return $capsule->getConnection()->getPdo();
});

AppFactory::setContainer($container);

$app = AppFactory::create();

$app->addBodyParsingMiddleware();

$app->addRoutingMiddleware();

// Session must run before Csrf (Slim LIFO: last added runs first)
$app->add(CsrfMiddleware::class);
$app->add(SessionMiddleware::class);

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
