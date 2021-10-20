<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for all database work. Of course
    | you may use many connections at once using the Database library.
    |
    */

    'default' => env('DB_CONNECTION', 'mysql'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Here are each of the database connections setup for your application.
    | Of course, examples of configuring each database platform that is
    | supported by Laravel is shown below to make development simple.
    |
    |
    | All database work in Laravel is done through the PHP PDO facilities
    | so make sure you have the driver for your particular database of
    | choice installed on your machine before you begin development.
    |
    */

    'connections' => [

        'sqlite' => [
            'driver' => 'sqlite',
            'url' => env('DATABASE_URL'),
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
        ],

        'mysql' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            // 'strict' => true,
            'strict' => false,//full group by
            'engine' => null,
            'options'   => [
                PDO::ATTR_EMULATE_PREPARES => true
            ],
            // 'options' => extension_loaded('pdo_mysql') ? array_filter([
            //     PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
            // ]) : [],
        ],
        'mysqlR' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST_R', env('DB_HOST', '127.0.0.1')),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            // 'strict' => true,
            'strict' => false,//full group by
            'engine' => null,
            'options'   => [
                PDO::ATTR_EMULATE_PREPARES => true
            ],
            // 'options' => extension_loaded('pdo_mysql') ? array_filter([
            //     PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
            // ]) : [],
        ],

        'mysqlQpr200' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST_QPR200', '127.0.0.1'),
            'port' => env('DB_PORT_QPR200', '3306'),
            'database' => env('DB_DATABASE_QPR200', 'forge'),
            'username' => env('DB_USERNAME_QPR200', 'forge'),
            'password' => env('DB_PASSWORD_QPR200', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            // 'strict' => true,
            'strict' => false,//full group by
            'engine' => null,
            'options'   => [
                PDO::ATTR_EMULATE_PREPARES => true
            ],
        ],

        'mysqlJST' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST_JST', '127.0.0.1'),
            'port' => env('DB_PORT_JST', '3306'),
            'database' => env('DB_DATABASE_JST', 'forge'),
            'username' => env('DB_USERNAME_JST', 'forge'),
            'password' => env('DB_PASSWORD_JST', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            // 'strict' => true,
            'strict' => false,//full group by
            'engine' => null,
            'options'   => [
                PDO::ATTR_EMULATE_PREPARES => true
            ],
        ],

        'mysqlASIA' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST_ASIA', '127.0.0.1'),
            'port' => env('DB_PORT_ASIA', '3306'),
            'database' => env('DB_DATABASE_ASIA', 'forge'),
            'username' => env('DB_USERNAME_ASIA', 'forge'),
            'password' => env('DB_PASSWORD_ASIA', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            // 'strict' => true,
            'strict' => false,//full group by
            'engine' => null,
            'options'   => [
                PDO::ATTR_EMULATE_PREPARES => true
            ],
        ],

        'mysqlROY' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST_ROY', '127.0.0.1'),
            'port' => env('DB_PORT_ROY', '3306'),
            'database' => env('DB_DATABASE_ROY', 'forge'),
            'username' => env('DB_USERNAME_ROY', 'forge'),
            'password' => env('DB_PASSWORD_ROY', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            // 'strict' => true,
            'strict' => false,//full group by
            'engine' => null,
            'options'   => [
                PDO::ATTR_EMULATE_PREPARES => true
            ],
        ],

        'mysqlVNPAY' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST_VNPAY', '127.0.0.1'),
            'port' => env('DB_PORT_VNPAY', '3306'),
            'database' => env('DB_DATABASE_VNPAY', 'forge'),
            'username' => env('DB_USERNAME_VNPAY', 'forge'),
            'password' => env('DB_PASSWORD_VNPAY', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            // 'strict' => true,
            'strict' => false,//full group by
            'engine' => null,
            'options'   => [
                PDO::ATTR_EMULATE_PREPARES => true
            ],
        ],

        'mysqlRM' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST_RM', '127.0.0.1'),
            'port' => env('DB_PORT_RM', '3306'),
            'database' => env('DB_DATABASE_RM', 'forge'),
            'username' => env('DB_USERNAME_RM', 'forge'),
            'password' => env('DB_PASSWORD_RM', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            // 'strict' => true,
            'strict' => false,//full group by
            'engine' => null,
            'options'   => [
                PDO::ATTR_EMULATE_PREPARES => true
            ],
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],

        'sqlsrv' => [
            'driver' => 'sqlsrv',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', 'localhost'),
            'port' => env('DB_PORT', '1433'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
        ],

        'mongodb' => [
            'driver'   => 'mongodb',
            'host'     => env('MONGODB_HOST', ''),
            'port'     => env('MONGODB_PORT', '27017'),
            'database' => env('MONGODB_DATABASE', ''),
            'username' => env('MONGODB_USERNAME', ''),
            'password' => env('MONGODB_PASSWORD', ''),
        ],


    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run in the database.
    |
    */

    'migrations' => 'migrations',

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer body of commands than a typical key-value system
    | such as APC or Memcached. Laravel makes it easy to dig right in.
    |
    */

    'redis' => [

        'client' => env('REDIS_CLIENT', 'phpredis'),

        'options' => [
            'cluster' => env('REDIS_CLUSTER', 'redis'),
            'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
        ],

        'default' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
        ],

        'cache' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_CACHE_DB', '1'),
        ],

    ],

];
