<?php

$configs = [
    // Configure base site
    'app.name' => getenv('COCKPIT_SITE_NAME'),
    'site_url' => getenv('COCKPIT_SITE_URL'),

    // Session configuration
    'session.name' => 'cockpit',
    'sec-key' => getenv('COCKPIT_SECRET_KEY'),

    // Assume english
    'languages' => [
        'en' => 'English'
    ],

    // CORS configuration
    'cors' => [
        'allowedHeaders' => 'X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding, Cockpit-Token',
        'allowedMethods' => 'PUT, POST, GET, OPTIONS, DELETE',
        'allowedOrigins' => getenv('COCKPIT_SITE_ORIGIN'),
        'maxAge' => 1000,
        'allowCredentials' => 'true',
        'exposedHeaders' => 'true'
    ],
];

// MongoDB connection configuration
if (getenv('COCKPIT_EXTERNAL_DATABASE') == true) {
    $configs['database'] = [
        'server' => getenv('COCKPIT_DATABASE_SERVER'),
        'options' => [
            'db' => getenv('COCKPIT_DATABASE_NAME')
        ]
    ];
}

// Mailer connection configuration
if (getenv('COCKPIT_MAILER') == true) {
    $configs['mailer'] = [
        'from' => getenv('COCKPIT_MAILER_FROM'),
        'transport' => 'smtp',
        'host' => getenv('COCKPIT_MAILER_HOST'),
        'user' => getenv('COCKPIT_MAILER_USER'),
        'password' => getenv('COCKPIT_MAILER_PASSWORD'),
        'port' => getenv('COCKPIT_MAILER_PORT'),
        'auth' => true,
        // Valid values are: '', 'tls', or 'ssl'
        'encryption' => getenv('COCKPIT_MAILER_ENCRYPTION')
    ];
}

// Detektivo configuration
if (getenv('DETEKTIVO_ENABLED') == true) {
    $configs['detektivo'] = [
        'engine' => 'algolia',
        'app_id' => getenv('DETEKTIVO_APP_ID'),
        'api_key' => getenv('DETEKTIVO_API_KEY')
    ];
}

return $configs;
