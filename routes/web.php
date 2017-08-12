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
Route::get('user/verify_facebook', 'userController@redirectToFacebook');
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
        Route::any('/offers', 'offerController@listing');
        Route::any('/offer/add', 'offerController@addoffer');
        Route::any('/offer/edit/{id}', 'offerController@editoffer');
        Route::any('/offer/delete/{id}', 'offerController@deleteoffer');
        Route::any('/cms', 'cmsController@cms_listing');
        Route::any('/cms/edit/{id}', 'cmsController@edit_cms');
		Route::any('/cms/add', 'cmsController@add_cms');
		
        Route::any('/faq', 'cmsController@faq');
        Route::any('/faq/add', 'cmsController@addfaq');
        Route::any('/faq/edit/{id}', 'cmsController@editfaq');
        Route::any('/faq/delete/{id}', 'cmsController@deletefaq');
        Route::any('/banners', 'cmsController@banners');
        Route::any('/banners/add', 'cmsController@addbanner');
        Route::any('/banners/edit/{id}', 'cmsController@editbanner');
        Route::any('/banners/delete/{id}', 'cmsController@deletebanner');
        Route::any('/charity', 'charityController@charity');
        Route::any('/charity/add', 'charityController@addcharity');
        Route::any('/charity/edit/{id}', 'charityController@editcharity');
        Route::any('/charity/delete/{id}', 'charityController@deletecharity');
		Route::any('/charity/weekly_payout', 'charityController@charityWeeklyPayout');
		Route::any('/charity/transaction_report', 'charityController@transactionReport');
		Route::any('/charity/edit_weekly_payout/{id}', 'charityController@editWeeklyPayout');
			
        Route::any('/seo', 'cmsController@seo');
        Route::any('/seo/add', 'cmsController@addseo');
        Route::any('/seo/edit/{id}', 'cmsController@editseo');
        Route::any('/seo/delete/{id}', 'cmsController@deleteseo');
        Route::any('/document_download/{file}', 'adminController@documentdownload');
        Route::any('/delete_document/{file}', 'adminController@deletedocument');
        Route::get('/events', 'adminController@viewEvents');
        Route::any('/events/status/{id}', 'adminController@statusEvents');
		
		Route::any('/tickets/{args?}', 'ticketController@ticket_listing');
		Route::any('/ticket/status_change/{id}', 'ticketController@change_ticket_status');
		Route::any('/ticket/edit/{id}', 'ticketController@edit_ticket');
		Route::any('/users/close_requests','adminController@closeRequest');
    });
});
Route::any('admin/verify_id/{id}', 'adminController@verifyid');
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
        Route::any('/public_profile', 'userController@public_profile');
        Route::any('/invite_friends', 'userController@invite_friends');
        Route::any('/compose', 'userController@compose');
        Route::any('/chat', 'userController@chat');
        Route::any('/edit_profile', 'userController@edit_profile');
        Route::any('/create_event', 'userController@create_event');
		
		Route::any('/edit_event/{id}', 'userController@edit_event');
		
        Route::any('/host_verification', 'userController@hostverification');
        Route::any('/send_email_verification_code', 'userController@sendemailvarificationcode');
        Route::any('/verify_email/{code}', 'userController@verify_email');
        Route::any('/image_upload', 'userController@imageupload');
        Route::any('/update_user', 'userController@updateuser');
        Route::get('/getEventDetails', 'userController@getEventDetails');
        Route::post('/search_event', 'userController@search_event');
        Route::any('/ajax_user_update', 'userController@ajaxResponse');
        Route::any('/my_account', 'userController@myaccount');
        Route::any('/notifications', 'userController@notifications');
        Route::any('/payment_method', 'userController@paymentmethod');
        Route::any('/hosting_option', 'userController@hostingoption');
        Route::any('/security', 'userController@security');
        Route::any('/my_events', 'userController@myevents');
        Route::any('/inbox', 'chatController@getInbox');
        Route::any('/public_profile', 'userController@public_profile');
        Route::any('/invite_friends', 'userController@invite_friends');
        Route::any('/invite_friend_payment/{event}/{friend_id}', 'userController@invite_friend_payment');
        Route::any('/compose', 'userController@compose');
        Route::any('/chat/{id}', 'chatController@getChatHistory');
        Route::post('/sendMessage/{id}', 'chatController@sendMessage');
        Route::any('/edit_profile', 'userController@edit_profile');
        Route::any('/create_event', 'userController@create_event');
        Route::any('/host_verification', 'userController@hostverification');
        Route::any('/send_email_verification_code', 'userController@sendemailvarificationcode');
        Route::any('/verify_email/{code}', 'userController@verify_email');
        Route::any('/image_upload', 'userController@imageupload');
        Route::any('/update_user', 'userController@updateuser');
        Route::get('/getEventDetails', 'userController@getEventDetails');
        Route::post('/search_event', 'userController@search_event');
        Route::any('/paypal_verify', 'userController@paypalverify');
        Route::any('/paypal_success_verify', 'userController@paypal_success_verify');
        Route::any('/invite_user_for_event', 'userController@inviteuserforevent');
        Route::any('/write_review', 'userController@write_review');
        Route::get('/your_hosting', 'userController@yourHosting');
        Route::get('/my_active_event', 'userController@myActiveEvent');
        Route::get('/my_ended_event', 'userController@myEndedEvent');
        Route::post('/getUpdatedConversation/{id}', 'chatController@getUpdatedConversation');
        Route::any('/write_review', 'userController@write_review');
        Route::any('/update_review', 'userController@update_review');
        Route::any('/reply_for_review', 'userController@reply_for_review');
        Route::get('/event/host/{id}', 'userController@hostEventDetails');
        Route::get('/event/guest/{id}', 'userController@guestEventDetails');
        Route::get('/follow/{id}','userController@followUser');
		
		Route::any('/friend_payment_link', 'userController@friend_payment_link');
		Route::any('/book_event_ticket/{id}', 'userController@book_event_ticket');
		
		Route::any('/request_for_tickets', 'userController@request_for_tickets');
		Route::any('/requested_tickets', 'userController@requested_ticket');
		
		Route::any('/events_following', 'userController@events_following');
		Route::any('/events_attending', 'userController@events_attending');
		Route::any('/events_attended', 'userController@events_attended');
		
		Route::any('/transaction_history', 'userController@transactionHistory');
		
		Route::any('/close_account', 'userController@closeAccount');
		
		Route::any('/approve_tickets', 'userController@approveTicket');
		Route::any('/cancel_tickets', 'userController@cancelTicket');
    });
	
	Route::any('/get_single_event_data', 'userController@get_single_event_data');
    Route::any('/event_payment/{user_id}/{event_id}', 'userController@event_payment');
    Route::any('/success_event_payment', 'userController@success_event_payment');
	Route::any('/success_friend_payment', 'userController@success_friend_payment');
    Route::any('/cancel_event_payment', 'userController@cancel_event_payment');
    Route::any('/profile/{id}', 'userController@user_profile');
});

Route::group(['prefix' => 'charity'], function ()
{
  Route::get('/login', 'CharityAuth\LoginController@showLoginForm');
  Route::post('/login', 'CharityAuth\LoginController@login');
  Route::post('/logout', 'CharityAuth\LoginController@logout');

  Route::get('/register', 'CharityAuth\RegisterController@showRegistrationForm');
  Route::post('/register', 'CharityAuth\RegisterController@register');

  Route::post('/password/email', 'CharityAuth\ForgotPasswordController@sendResetLinkEmail');
  Route::post('/password/reset', 'CharityAuth\ResetPasswordController@reset');
  Route::get('/password/reset', 'CharityAuth\ForgotPasswordController@showLinkRequestForm');
  Route::get('/password/reset/{token}', 'CharityAuth\ResetPasswordController@showResetForm');
  Route::group(['middleware' => 'charity'], function()
  {
		Route::any('/edit_profile', 'charityController@edit_charity_profile');
		Route::any('/weekly_payout', 'charityController@weeklypayout');
		Route::any('/transaction_report', 'charityController@transaction_report');
  });
  
});


Route::post('ipn/notify', 'userController@postNotify');
Route::post('user/registeration', 'userController@registeration');

Route::post('ipn/notify','userController@postNotify');
Route::post('user/registeration', 'userController@registeration');

//********************** Contact Us ***********************\\
Route::get('/contact', 'userController@contact');
Route::post('/contact', 'userController@contactus');
Route::get('/admin/contactus', 'userController@contactlist');
Route::any('/admin/contactus/delete/{id}', 'userController@deletecontact');
//********************* End Contact Us *********************\\


//********************** About Us ***********************\\
Route::get('/about-us', 'userController@index');

Route::get('/faq', 'homeController@faq');
//************ genrate weekly payout ***********//
Route::get('/genrate_weekly_payout', 'charityController@genrate_weekly_payout');
