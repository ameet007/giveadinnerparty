<?php

Route::get('/home', function () {
    $users[] = Auth::user();
    $users[] = Auth::guard()->user();
    $users[] = Auth::guard('charity')->user();

    //dd($users);

    return view('charity.home');
})->name('home');

