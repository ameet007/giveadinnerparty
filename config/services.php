<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],
    
    'facebook' =>[
                    'client_id' => '246510272516043',
                    'client_secret' => '44aacd5615a7971e9beeafd6cc56ac17',
                    'redirect' =>'http://localhost/giveadinnerparty/public/login/facebook/callback',
                ],

    'twitter' => [
                    'client_id' => '79cYMWSpidWJerEZwONIZu7Px',
                    'client_secret' => 'iGCJID39UKTYTbVj9bV1SyqvjVwIj7Be3xFqLAHTGw5oj7Mkd8',
                    'redirect' => 'http://www.neurons-it.in/dating/public/auth/twitter/callback',
                ],
                
    'google' => [
                    'client_id' => '373918899213-siljct4drecgpe3mu9c8lupc6rpvfedh.apps.googleusercontent.com',
                    'client_secret' => 'An_Et4zvHasBNUjhLc_zCyyK ',
                    'redirect' => 'http://www.neurons-it.in/dating/public/auth/google/callback',
                ],

];
