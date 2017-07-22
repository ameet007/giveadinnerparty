<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Charity;
use Validator;
use Illuminate\Support\Facades\Auth;
use App\charity_report;
class charityController extends Controller
{
    /****charity listing****/
	public function charity(Request $request)
	{
		$charity = Charity::get();
		return view('admin.charity.listing')->with(['charity'=>$charity]);
	}
	/****charity listing****/
	
	 /****charity add****/
	public function addcharity(Request $request)
	{
		$data = $request->all();
		$validate = Validator::make($data, [
        'title' => 'required|string|max:191',
		'email' => 'required|email|max:191|unique:charities',
        'password' => 'required|min:6',
		'logo' => 'required|image|mimes:jpeg,png,jpg|max:2048',	
		'description' => 'required|string',
		'reference' => 'required|string|max:191',
		'website' => 'required|string|max:191',
        'status' => 'required|numeric',		
		]);
		
		if(!$validate->fails())
		{
			$file = $request->file('logo');
			$file_name = str_replace(' ','_',time().$file->getClientOriginalName());			
			$destinationPath = 'assets\admin\uploads\charity';				
			$file->move($destinationPath,$file_name);
			
			$data['logo'] = $file_name;
			unset($data['_token']);
			$data['password'] = bcrypt($data['password']);
			Charity::insert($data);
			return redirect('admin/charity')->with(['success'=>'banner successfully created']);
		}
		else
		{
			redirect('admin/charity/add')->withErrors($validate)->withInput();
		}
		
		return view('admin.charity.edit_charity');
	}
	/****charity add****/
	/****edit charity***/
	public function editcharity(Request $request, $id=0)
	{
		$data = $request->all();
		$validate = Validator::make($data, [
        'title' => 'required|string|max:191',
		'email' => 'required|email|max:191|unique:charities,email,'.$id,	
		'description' => 'required|string',
		'reference' => 'required|string|max:191',
		'website' => 'required|string|max:191',
        'status' => 'required|numeric',		
		]);

		if(!$validate->fails())
		{
			$file = $request->file('logo');
			if(isset($_FILES['logo']['name']) && !empty($_FILES['logo']['name']))
			{	
				$file_name = str_replace(' ','_',time().$file->getClientOriginalName());			
				$destinationPath = 'assets\admin\uploads\charity';			
				$file->move($destinationPath,$file_name);
				if(file_exists('assets/admin/uploads/charity/'.$data['old_image']))
				{	
					unlink('assets/admin/uploads/charity/'.$data['old_image']);
				}
			}
			else
			{
				$file_name = $data['old_image'];
			}
			$data['logo'] = $file_name;
			unset($data['_token']);
			unset($data['old_image']);
			
			if(!empty($data['password']))
			{
			  $data['password'] = bcrypt($data['password']);
			}
			else{
			  unset($data['password']);
			}
			Charity::where('id',$id)->update($data);
			return redirect('admin/charity')->with(['success'=>'charity successfully created']);
		}
		else
		{
			redirect('admin/charity/edit/'.$id)->withErrors($validate)->withInput();
		}
		
		$charity = Charity::where('id', $id)->first();
		//dd($banner);
		return view('admin.charity.edit_charity')->with(['charity'=>$charity]);
	}
	/****edit charity***/
	
	/****delete charity****/
	public function deletecharity(Request $request, $id=0)
	{
		$charity = Charity::where('id', $id)->first();	
		if(file_exists('assets/admin/uploads/charity/'.$charity->logo))
		{	
			unlink('assets/admin/uploads/charity/'.$charity->logo);
		}
		Charity::where('id',$id)->delete();
		return redirect('admin/charity')->with(['success'=>'User successfully deleted',]);
	}
	/****delete charity****/
	
	
	public function edit_charity_profile(Request $request, $id=0)
	{		
		$login_charity = Auth::guard('charity')->user();
		if($request->isMethod('post'))
		{
			$data = $request->all();
			$validate = Validator::make($data, [
			'title' => 'required|string|max:191',
			'email' => 'required|email|max:191|unique:charities,email,'.$login_charity->id,	
			'description' => 'required|string',
			'reference' => 'required|string|max:191',
			'website' => 'required|string|max:191',
			'status' => 'required|numeric',		
			]);

			if(!$validate->fails())
			{
				$file = $request->file('logo');
				if(isset($_FILES['logo']['name']) && !empty($_FILES['logo']['name']))
				{
					$file_name = str_replace(' ','_',time().$file->getClientOriginalName());			
					$destinationPath = 'assets\admin\uploads\charity';			
					$file->move($destinationPath,$file_name);
					if(file_exists('assets/admin/uploads/charity/'.$data['old_image']))
					{	
						unlink('assets/admin/uploads/charity/'.$data['old_image']);
					}
				}
				else
				{
					$file_name = $data['old_image'];
				}
				$data['logo'] = $file_name;
				unset($data['_token']);
				unset($data['old_image']);
				unset($data['email']);
				if(!empty($data['password']))
				{
				  $data['password'] = bcrypt($data['password']);
				}
				else{
				  unset($data['password']);
				}
				Charity::where('id',$login_charity->id)->update($data);
				return redirect('charity/home')->with(['success'=>'charity updated successfully']);
			}
			else
			{
				redirect('charity/home')->withErrors($validate)->withInput();
			}
		}	
		
		$charity = Charity::where('id', $login_charity->id)->first();		
		return view('charity.edit_charity')->with(['charity'=>$charity]);
	}
	
	 /****charity listing****/
	public function weeklypayout(Request $request)
	{
		
		 $report_data = charity_report::leftJoin('charities', 'charity_reports.charity_id', '=', 'charities.id')
                        ->where('charities.id', 1)
						->select('charity_reports.*','charities.title')->get();	
						
		  return view('charity.weekly_payout')->with(['report_data'=>$report_data]);
	}
	/****charity listing****/

}
