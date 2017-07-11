<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Offers;
use Validator;
class offerController extends Controller
{
	/******offers listing start*******/
    public function listing(Request $request)
	{
		$offer_data = Offers::get();
		return view('admin.offers.listing')->with(['offer_data'=>$offer_data]);
	}
	/******offers listing end*****/
	
	/******offers listing start*******/
    public function addoffer(Request $request)
	{
		$data = $request->all();
		$validate = Validator::make($data, [
        'title' => 'required|string|max:191',
		'rule' => 'required|numeric', 
		'from_date' => 'required',	
		'to_date' => 'required',
        'status' => 'required|numeric',		
		]);		
		
		if(!$validate->fails())
		{			
			unset($data['_token']);
			Offers::insert($data);
			return redirect('admin/offer/offers')->with(['success'=>'Offer successfully created']);
		}
		else
		{
			redirect('admin/offer/add')->withErrors($validate)->withInput();
		}
		
		
		return view('admin.offers.edit_offer');
	}
	/******offers listing end*****/
	
	/***********edit offer*******/
	public function editoffer(Request $request, $id=0)
	{
		$data = $request->all();
		$validate = Validator::make($data, [
        'title' => 'required|string|max:191',
		'rule' => 'required|numeric', 
		'from_date' => 'required',	
		'to_date' => 'required',
        'status' => 'required|numeric',		
		]);	
		
		if(!$validate->fails())
		{			
			unset($data['_token']);
			Offers::where('id',$id)->update($data);
			return redirect('admin/offers')->with(['success'=>'offer successfully updated']);
		}
		else
		{
			redirect('admin/offer/edit/'.$id)->withErrors($validate)->withInput();
		}
		
		$offer_data = Offers::where('id', $id)->first();
		return view('admin.offers.edit_offer')->with(['offer_data'=>$offer_data]);
	}	
	/**********edit ofer ********/
	
	/*****delete offer ***/
	public function deleteoffer(Request $request, $id=0)
	{		
		Offers::where('id',$id)->delete();
		return redirect('admin/offers')->with(['success'=>'User successfully deleted',]);
	}	
	/*****delete offer *****/
}
