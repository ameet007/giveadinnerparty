<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Country;
use App\Banner;
use App\User;
use App\Faq;
class homeController extends Controller
{
	public function index()
	{		
		$banner = Banner::where('status',1)->get();
		$country = Country::get();
		$events = User::rightJoin('events','users.id','=','events.user_id')->where('events.event_date','>=',date('m/d/Y'))->get();
	    return view('welcome')->with(['country_list'=>$country,'banners'=>$banner,'events'=>$events,]);
	}
	
	public function faq(Request $request)
	{
		$country = Country::get();
		$faq = Faq::where('status','1')->get();
		return view('faq')->with(['country_list' => $country,'faq_data' => $faq,]);
	}
}
