<?php
use App\user;
Route::get('/home', function () {
	
    $users[] = Auth::user();
    $users[] = Auth::guard()->user();
    $users[] = Auth::guard('user')->user();
			
    if (Auth::guard('user')->user()->confirmed == 0 || Auth::guard('user')->user()->about == '' || Auth::guard('user')->user()->hobbies == '' || Auth::guard('user')->user()->photos == '') {
        return view('user.verify');
    }
	else
	{
		$events = User::leftJoin('events', 'users.id', '=', 'events.user_id')
			->leftJoin('charities', 'charities.id', '=', 'events.charity_id')
			->where('events.event_date', '>=', date('m/d/Y'))
			->where('events.user_id', '!=', Auth::guard('user')->user()->id)
			->select('events.*', 'users.name','charities.title as charity_name','charities.logo')->get();
        return view('user.home')->with(['events'=>$events]);
    }
	//return view('user.home');
})->name('home');

