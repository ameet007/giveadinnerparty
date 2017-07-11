<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Charity;
use Validator;

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
		'logo' => 'required|image|mimes:jpeg,png,jpg|max:2048',	
		'description' => 'required|string|max:191',
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
		//'logo' => 'required|image|mimes:jpeg,png,jpg|max:2048',	
		'description' => 'required|string|max:191',
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

}
