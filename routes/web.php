<?php

/*
  |--------------------------------------------------------------------------
  | Web Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register web routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | contains the "web" middleware group. Now create something great!
  |
 */

Route::any('/', 'homeController@index');

Route::get('login/facebook', 'UserAuth\LoginController@redirectToProvider');
Route::get('login/facebook/callback', 'UserAuth\LoginController@handleProviderCallback');

Route::group(['prefix' => 'admin'], function () {
    Route::get('/login', 'AdminAuth\LoginController@showLoginForm');
    Route::post('/login', 'AdminAuth\LoginController@login');
    Route::get('/logout', 'AdminAuth\LoginController@logout');

    Route::get('/register', 'AdminAuth\RegisterController@showRegistrationForm');
    Route::post('/register', 'AdminAuth\RegisterController@register');

    Route::post('/password/email', 'AdminAuth\ForgotPasswordController@sendResetLinkEmail');
    Route::post('/password/reset', 'AdminAuth\ResetPasswordController@reset');
    Route::get('/password/reset', 'AdminAuth\ForgotPasswordController@showLinkRequestForm');
    Route::get('/password/reset/{token}', 'AdminAuth\ResetPasswordController@showResetForm');
    Route::group(['middleware' => 'admin'], function() {
    Route::get('/users', 'adminController@viewUsers');
    Route::any('/users/edit/{id?}', 'adminController@editUsers');
    Route::any('/users/add', 'adminController@addUsers');
    Route::any('/users/delete/{id}', 'adminController@deleteUsers');
    Route::get('/admins', 'adminController@viewAdmins');
    Route::any('/admins/edit/{id?}', 'adminController@editAdmins');
    Route::any('/admins/add', 'adminController@addAdmins');
    Route::any('/admins/delete/{id}', 'adminController@deleteAdmins');

    Route::get('/company', 'adminController@viewCompany');
    Route::any('/company/edit/{id?}', 'adminController@editCompany');
    });
});

Route::group(['prefix' => 'staff'], function () {
    Route::get('/login', 'StaffAuth\LoginController@showLoginForm');
    Route::post('/login', 'StaffAuth\LoginController@login');
    Route::post('/logout', 'StaffAuth\LoginController@logout');

    Route::get('/register', 'StaffAuth\RegisterController@showRegistrationForm');
    Route::post('/register', 'StaffAuth\RegisterController@register');

    Route::post('/password/email', 'StaffAuth\ForgotPasswordController@sendResetLinkEmail');
    Route::post('/password/reset', 'StaffAuth\ResetPasswordController@reset');
    Route::get('/password/reset', 'StaffAuth\ForgotPasswordController@showLinkRequestForm');
    Route::get('/password/reset/{token}', 'StaffAuth\ResetPasswordController@showResetForm');
});

Route::group(['prefix' => 'user'], function () {
    Route::get('/login', 'UserAuth\LoginController@showLoginForm');
    Route::post('/login', 'UserAuth\LoginController@login');
    Route::get('/logout', 'UserAuth\LoginController@logout');

    Route::get('/register', 'UserAuth\RegisterController@showRegistrationForm');
    Route::post('/register', 'UserAuth\RegisterController@register');

    Route::post('/password/email', 'UserAuth\ForgotPasswordController@sendResetLinkEmail');
    Route::post('/password/reset', 'UserAuth\ResetPasswordController@reset');
    Route::get('/password/reset', 'UserAuth\ForgotPasswordController@showLinkRequestForm');
    Route::get('/password/reset/{token}', 'UserAuth\ResetPasswordController@showResetForm');
    // by naseem
    Route::group(['middleware' => 'user'], function () {
    Route::any('/ajax_user_update', 'userController@ajaxResponse');
    Route::any('/my_account', 'userController@myaccount');
    Route::any('/notifications', 'userController@notifications');
    Route::any('/payment_method', 'userController@paymentmethod');
    Route::any('/hosting_option', 'userController@hostingoption');
    Route::any('/security', 'userController@security');
    Route::any('/my_events', 'userController@myevents');
    Route::any('/inbox', 'userController@inbox');
		
	Route::any('/send_email_verification_code', 'userController@sendemailvarificationcode');
	Route::any('/verify_email/{code}', 'userController@verify_email');
	
	Route::any('/image_upload', 'userController@imageupload');
	Route::any('/update_user', 'userController@updateuser');
		
    });
});
Route::post('user/registeration', 'userController@registeration');

Route::group(['prefix' => 'cms'], function () {
    Route::group(['middleware' => 'admin'], function () {
        Route::any('/banners', 'cmsController@banners');
        Route::any('/banners/add', 'cmsController@addbanner');
        Route::any('/banners/edit/{id}', 'cmsController@editbanner');
        Route::any('/banners/delete/{id}', 'cmsController@deletebanner');


        Route::any('/faq', 'cmsController@faq');
        Route::any('/faq/add', 'cmsController@addfaq');
        Route::any('/faq/edit/{id}', 'cmsController@editfaq');
        Route::any('/faq/delete/{id}', 'cmsController@deletefaq');

        Route::any('/aboutus', 'cmsController@aboutus');
        Route::any('/aboutus/edit/{id}', 'cmsController@aboutusedit');
    });
});

Route::group(['prefix' => 'offer'], function ()
{
	Route::group(['middleware' => 'admin'], function ()
	{
		Route::any('/listing', 'offerController@listing');
		Route::any('/add', 'offerController@addoffer');
		Route::any('/edit/{id}', 'offerController@editoffer');
		Route::any('/delete/{id}', 'offerController@deleteoffer');
	});
});
