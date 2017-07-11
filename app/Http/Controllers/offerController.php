<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use app\Offers;

class offerController extends Controller
{
    public function offers(Request $request)
	{
		$offer_data = Offers::get();
		return view('offers.listing')->with(['offer_data'=>$offer_data]);
	}
}
