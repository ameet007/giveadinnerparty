<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Admin;
use App\Banner;
use App\Faq;
use App\Cms;
use App\systemSettings;
use Validator;


class cmsController extends Controller
{
	/*********************start banner code***********************/
    public function banners(Request $request)
	{
		$banner = Banner::get();
		return view('cms.banners.listing')->with(['banners'=>$banner]);
	}
	
	public function addbanner(Request $request, $id=0)
	{
		$data = $request->all();
		$validate = Validator::make($data, [
        'title' => 'required|string|max:191',
		'sub_title' => 'required|string|max:191', 
		'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',	
        'status' => 'required|numeric',		
		]);
		
		if(!$validate->fails())
		{
			$file = $request->file('image');
			$file_name = str_replace(' ','_',time().$file->getClientOriginalName());			
			$destinationPath = 'assets\admin\uploads\banner';				
			$file->move($destinationPath,$file_name);
			
			$data['image'] = $file_name;
			unset($data['_token']);
			Banner::insert($data);
			return redirect('cms/banners')->with(['success'=>'banner successfully created']);
		}
		else
		{
			redirect('cms/banners/add')->withErrors($validate)->withInput();
		}
		
		return view('cms.banners.edit_banner');
	}
	
	public function editbanner(Request $request, $id=0)
	{
		$data = $request->all();
		$validate = Validator::make($data, [
        'title' => 'required|string|max:191', 
		'sub_title' => 'required|string|max:191', 
        'status' => 'required|numeric',		
		]);
		
		if(!$validate->fails())
		{
			$file = $request->file('image');
			if(isset($_FILES['image']['name']) && !empty($_FILES['image']['name']))
			{	
				$file_name = str_replace(' ','_',time().$file->getClientOriginalName());			
				$destinationPath = 'assets\admin\uploads\banner';			
				$file->move($destinationPath,$file_name);
				if(file_exists('assets/admin/uploads/banner/'.$data['old_image']))
				{	
					unlink('assets/admin/uploads/banner/'.$data['old_image']);
				}
			}
			else
			{
				$file_name = $data['old_image'];
			}
			$data['image'] = $file_name;
			unset($data['_token']);
			unset($data['old_image']);
			Banner::where('id',$id)->update($data);
			return redirect('cms/banners')->with(['success'=>'banner successfully created']);
		}
		else
		{
			redirect('cms/banners/add')->withErrors($validate)->withInput();
		}
		
		$banner = Banner::where('id', $id)->first();
		//dd($banner);
		return view('cms.banners.edit_banner')->with(['banner'=>$banner]);
	}
	
	public function deletebanner(Request $request, $id=0)
	{
		$banner = Banner::where('id', $id)->first();	
		unlink('assets/admin/uploads/banner/'.$banner->image);
		Banner::where('id',$id)->delete();
		return redirect('cms/banners')->with(['success'=>'User successfully deleted',]);
	}
	/*********************end banner code***********************/
	
	
	/*********************start FAQ code***********************/
    public function faq(Request $request)
	{
		$faq = Faq::get();
		return view('cms.faq.listing')->with(['faq'=>$faq]);
	}
	
	public function addfaq(Request $request, $id=0)
	{
		$data = $request->all();
		$validate = Validator::make($data, [ 
        'question' => 'required|string|max:191', 
		'answer' => 'required|string', 
        'status' => 'required|numeric',		
		]);
		
		if(!$validate->fails())
		{			
			unset($data['_token']);
			Faq::insert($data);
			return redirect('cms/faq')->with(['success'=>'faq successfully created']);
		}
		else
		{
			redirect('cms/faq/add')->withErrors($validate)->withInput();
		}
		
		return view('cms.faq.edit_faq');
	}
	
	public function editfaq(Request $request, $id=0)
	{
		$data = $request->all();
		$validate = Validator::make($data, [
        'question' => 'required|string|max:191',
		'answer' => 'required|string', 
        'status' => 'required|numeric',		
		]);
		
		if(!$validate->fails())
		{			
			unset($data['_token']);
			Faq::where('id',$id)->update($data);
			return redirect('cms/faq')->with(['success'=>'faq successfully created']);
		}
		else
		{
			redirect('cms/faq/edit')->withErrors($validate)->withInput();
		}
		
		$faq = Faq::where('id', $id)->first();
		//dd($faq);
		return view('cms.faq.edit_faq')->with(['faq'=>$faq]);
	}
	
	public function deletefaq(Request $request, $id=0)
	{
		Faq::where('id',$id)->delete();
		return redirect('cms/faq')->with(['success'=>'User successfully deleted',]);
	}
	/*********************end FAQ code***********************/	
	
	
	/************** Start about us code ****************/
	
	 public function aboutus(Request $request)
	{
		$aboutus = Cms::get();
		return view('cms.aboutus.listing')->with(['aboutus'=>$aboutus]);
	}
	public function aboutusedit(Request $request, $id=0)
	{
		$data = $request->all();
		$validate = Validator::make($data, [
        'title' => 'required|string|max:191', 
		'description' => 'required|string|max:191', 
		]);
		
		if(!$validate->fails())
		{
			$file = $request->file('image');
			if(isset($_FILES['image']['name']) && !empty($_FILES['image']['name']))
			{
				$file_name = str_replace(' ','_',time().$file->getClientOriginalName());			
				$destinationPath = 'assets/admin/uploads/images';			
				$file->move($destinationPath,$file_name);
				if(file_exists('assets/admin/uploads/images/'.$data['old_image']) && !empty($data['old_image']))
				{
					unlink('assets/admin/uploads/images/'.$data['old_image']);
				}
			}
			else
			{
				$file_name = $data['old_image'];
			}
			$data['image'] = $file_name;
			unset($data['_token']);
			unset($data['old_image']);
			Cms::where('id',$id)->update($data);
			return redirect('cms/aboutus')->with(['success'=>'banner successfully created']);
		}
		else
		{
			redirect('cms/aboutus/edit')->withErrors($validate)->withInput();
		}
		
		$aboutus_data = Cms::where('id',1)->first();
		return view('cms.aboutus.edit_aboutus')->with(['aboutus'=>$aboutus_data]);
	}
	/*********************end about us code***********************/
	
}