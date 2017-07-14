<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Country;
use App\Banner;
class homeController extends Controller
{
	public function index()
	{		
		$banner = Banner::where('status',1)->get();
		$country = Country::get();
	    return view('welcome')->with(['country_list'=>$country,'banners'=>$banner,]);
	}
}
