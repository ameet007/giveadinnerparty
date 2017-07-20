<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Country;
use App\Banner;
use App\user;
class homeController extends Controller
{
	public function index()
	{		
		$banner = Banner::where('status',1)->get();
		$country = Country::get();
		$events = User::rightJoin('events','users.id','=','events.user_id')->where('events.event_date','>=',date('m/d/Y'))->get();
	    return view('welcome')->with(['country_list'=>$country,'banners'=>$banner,'events'=>$events,]);
	}
}
