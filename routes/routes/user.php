<?php

Route::get('/home', function () {
    $users[] = Auth::user();
    $users[] = Auth::guard()->user();
    $users[] = Auth::guard('user')->user();
			
    if (Auth::guard('user')->user()->confirmed == 0 || Auth::guard('user')->user()->about == '' || Auth::guard('user')->user()->hobbies == '' || Auth::guard('user')->user()->photos == '') {
        return view('user.verify');
    } else {
        return view('user.home');
    }
	//return view('user.home');
})->name('home');

