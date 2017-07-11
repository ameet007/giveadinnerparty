<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\User;
use Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Hash;
use Mail;
use App\Userimages;

class userController extends Controller
{
	
	public function myaccount(Request $request, $id=0)
	{
		return view('user.account.my-account');
	}
	
	public function notifications(Request $request, $id=0)
	{
		return view('user.account.notifications');
	}
	
	public function paymentmethod(Request $request, $id=0)
	{
		return view('user.account.payment-method');
	}
	
	public function hostingoption(Request $request, $id=0)
	{
		return view('user.account.hosting-option');
	}
	
	public function security(Request $request, $id=0)
	{
		if($request->isMethod('post'))
		{
			$data = $request->all();
			$validate = Validator::make($data, [
			'old_password' => 'required|min:6|',
			'new_password' => 'required|min:6',				
			'comfirm_password' => 'required|min:6|same:new_password',			
			]);
			
			if(!$validate->fails())
		    {
				$login_user = Auth::guard('user')->user();
				if(!Hash::check($data['old_password'], $login_user->password))
				{
					$request->session()->flash('flash_message', '<div class="alert alert-danger"><span class="glyphicon glyphicon-remove"></span><em> old password invalid.</em></div>');
					return redirect('user/security');
				}
				else
				{				
					$data['password'] = bcrypt($data['new_password']);
					unset($data['_token']);
					unset($data['old_password']);
					unset($data['new_password']);
					unset($data['comfirm_password']);
					User::where('id',$login_user->id)->update($data);
					$request->session()->flash('flash_message', '<div class="alert alert-success"><span class="glyphicon glyphicon-ok"></span><em> password has been changed successfully.</em></div>');
					return redirect('user/security');
				}	
			}
			else
			{
				return redirect('user/security')->withErrors($validate)->withInput();
			}
			
		}
		
		//echo Auth::user()->password;
		return view('user.account.security');
	}
	
	public function myevents(Request $request, $id=0)
	{
		return view('user.my-events');
	}
	
	public function inbox(Request $request, $id=0)
	{
		return view('user.inbox');
	}
	
	
	public function imageupload(Request $request, $id=0)
	{
		if($request->isMethod('post'))
		{	
			$login_user = Auth::guard('user')->user();
			$data = $request->all();
			$file = $request->file('image');
			$file_name = str_replace(' ','_',time().$file->getClientOriginalName());			
			$destinationPath = 'assets\admin\uploads\users';				
			$file->move($destinationPath,$file_name);
			
			unset($data['_token']); 
			$data['image'] = $file_name;
			$data['user_id'] = $login_user->id;
			$data['default'] = 0;
			Userimages::insert($data);
			
			$user_data['photos'] = 1;
			User::where('id',$login_user->id)->update($user_data);
		}
	}
	
	public function registeration(Request $request, $id=0)
	{
		if($request->isMethod('post'))
		{
			$data = $request->all();
			
			$validate = Validator::make($data, [
			'name' => 'required|string|max:191',
			'email' => 'required|email|max:191|unique:users',
			'last_name' => 'required|string|max:191',
			'password' => 'required|min:6',
			//'dob'=>'required|date',
			'gender' => 'required|string|max:191',
		  ]);
		    if(!$validate->fails())
		    {
				unset($data['_token']);
				$data['password'] = bcrypt($data['password']);
				$data['dob'] = $data['birthmonth'].'/'.$data['birthday'].'/'.$data['birthyear'];
				$data['confirmed'] = 0;
				$data['confirmation_code'] = str_shuffle("1234567890");
				unset($data['birthmonth']);
				unset($data['birthday']);
				unset($data['birthyear']);
				$user = User::create($data)->id;
				$authUser = User::where('id',$user)->first();
				Auth::guard('user')->login($authUser);
				
				Mail::send('emails.email_confirmation', ['user' => $authUser], function ($message) use($authUser)
				{
					$message->to($authUser->email, $authUser->name.' '.$authUser->last_name)->subject('confirm your email!');        
				});				
				
				return redirect('/');				
		    }
			else
			{
				return redirect('/');
			}
		}
	}
	/*----------- send email varification code ------------*/
	public function sendemailvarificationcode(Request $request)
	{
		$login_user = Auth::guard('user')->user();
		
		Mail::send('emails.email_confirmation', ['user' => $login_user], function ($message) use($login_user)
        {
			$message->to($login_user->email, $login_user->name.' '.$login_user->last_name)->subject('confirm your email!');        
        });
		
		$request->session()->flash('flash_message', '<div class="alert alert-success"><span class="glyphicon glyphicon-ok"></span><em> email verification link has been sent to your email account.</em></div>');
		return redirect('user/home');        		
	}
	/*---------- end email varification code --------------*/
	
	
	/*----------- send email varification code ------------*/
	public function verify_email(Request $request, $code)
	{
		$user = User::where('confirmation_code',$code)->first();
		if(count($user)>0)
		{
			$data['confirmed'] = 1;
			User::where('id',$user->id)->update($data);
			return redirect('user/home');			
		}
		else
		{
			return redirect('/');
		}	
	}
	/*---------- end email varification code --------------*/
	
	/* ------------- update user ---------------------*/
    public function updateuser(Request $request, $id=0)
	{
		$login_user = Auth::guard('user')->user();
		if($request->isMethod('post'))
		{
			$data = $request->all();
			unset($data['_token']);
			User::where('id',$login_user->id)->update($data);
			return redirect('user/home');
		}
		
	}
  /*--------------end update user -----------------*/
	
    /* ------------- update user ---------------------*/
    public function ajaxResponse(Request $request, $id=0)
	{
		if($request->isMethod('post'))
		{
			$data = $request->all();
			unset($data['_token']);
			User::where('id',$_POST['id'])->update($data);
		}
		
	}
  /*--------------end update user -----------------*/
}
