<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\events;
use App\Admin;
use App\systemSettings;
use Validator;
use Crypt;
use Illuminate\Support\Facades\Auth;
use App\charity_report;
use App\accountClose;

/* -------------Manage Users----------------- */
class adminController extends Controller
{
  public function viewUsers(){
    $user = User::get();
    return view('admin.users.users')->with([
      'users'=>$user,
    ]);
}

  public function addUsers(Request $request, $id=0){
    if($request->isMethod('get')){
      return view('admin.users.edit_users');
    }
    if($request->isMethod('post')){
      $data = $request->all();
      $validate = Validator::make($data, [
        'name' => 'required|string|max:191',
        'email' => 'required|email|max:191|unique:users',
        'last_name' => 'required|string|max:191',
        'password' => 'required|min:6',
        'dob'=>'required|date',
        'gender' => 'required|string|max:191',
        'is_disabled' => 'required|numeric|max:1|min:0',
      ]);
      if(!$validate->fails()){
        unset($data['_token']);
        $data['password'] = bcrypt($data['password']);
        $data['confirmed'] = 1;
        User::insert($data);
        return redirect('admin/users')->with([
          'success'=>'User successfully created',
        ]);
      }
      else{
        return redirect('admin/users/add')->withErrors($validate)->withInput();
      }
    }
  }

  public function editUsers(Request $request, $id=0){
    if($request->isMethod('get')){
      $user = User::where('id',$id)->first();
      return view('admin.users.edit_users')->with([
        'user'=>$user,
      ]);
    }
    if($request->isMethod('post')){
      $data = $request->all();
      $validate = Validator::make($data, [
        'name' => 'required|string|max:191',
        'email' => 'required|email|max:191|unique:users,email,'.$id,
        'last_name' => 'required|string|max:191',
        'dob'=>'required|date',
        'gender' => 'required|string|max:191',
        'is_disabled' => 'required|numeric|max:1|min:0',
      ]);
      if(!$validate->fails()){
        unset($data['_token']);
        if(!EMPTY($data['password'])){
          $data['password'] = bcrypt($data['password']);
        }
        else{
          unset($data['password']);
        }
        $data['confirmed'] = 1;
        User::where('id',$id)->update($data);
        return redirect('admin/users')->with([
          'success'=>'User successfully updated',
        ]);
      }
      else{
        return redirect('admin/users/edit/'.$id)->withErrors($validate)->withInput();
      }
    }
  }

  public function deleteUsers(Request $request, $id){
    User::where('id',$id)->delete();
    return redirect('admin/users')->with(['success'=>'User successfully deleted',]);
  }

  
  public function documentdownload(Request $request, $file = 0) {
        if ($request->isMethod('get')) 
		{
             $file_path = public_path('assets/admin/uploads/users').'/'.$file;
			return response()->download($file_path);
        }
    }
	
	public function deletedocument(Request $request, $file = 0)
	{
        if ($request->isMethod('get'))
		{	
			unlink('assets/admin/uploads/users/'.$file);
			return  back();
        }
    }
	
	public function verifyid(Request $request, $id = 0)
	{
        if($request->isMethod('get')) 
		{            
			$user_id = Crypt::decrypt($id);
			
			$user = User::where('id',$user_id)->first();
			if(count($user)>0)
			{	
				$authUser = Admin::where('id', 1)->first();
				Auth::guard('admin')->login($authUser);
				
				return view('admin.users.verify_id')->with(['user'=>$user,]);
			}
			else
			{
				return redirect('/');
			}
        }
		if($request->isMethod('post'))
		{
			$user_id = Crypt::decrypt($id);
			$data = $request->all();
			unset($data['_token']);
			User::where('id',$user_id)->update($data);
			return redirect('admin/users')->with(['success'=>'User successfully updated',]);
		}
    }
  /* -------------Manage Users----------------- */

  /* -------------Manage Admins----------------- */


  public function viewAdmins(){
    $admin = Admin::get();
    return view('admin.admins.admins')->with([
      'admins'=>$admin,
    ]);
  }

  public function addAdmins(Request $request, $id=0){
    if($request->isMethod('get')){
      return view('admin.admins.edit_admins');
    }
    if($request->isMethod('post')){
      $data = $request->all();
      $validate = Validator::make($data, [
        'name' => 'required|string|max:191',
        'email' => 'required|email|max:191|unique:users',
        'password' => 'required|min:6',
      ]);
      if(!$validate->fails()){
        unset($data['_token']);
        $data['password'] = bcrypt($data['password']);
        Admin::insert($data);
        return redirect('admin/admins')->with([
          'success'=>'Admin successfully created',
        ]);
      }
      else{
        return redirect('admin/admins/add')->withErrors($validate)->withInput();
      }
    }
  }

  public function editAdmins(Request $request, $id=0){
    if($request->isMethod('get')){
      $admin = Admin::where('id',$id)->first();
      return view('admin.admins.edit_admins')->with([
        'admin'=>$admin,
      ]);
    }
    if($request->isMethod('post')){
      $data = $request->all();
      $validate = Validator::make($data, [
        'name' => 'required|string|max:191',
        'email' => 'required|email|max:191|unique:admins,email,'.$id,
      ]);
      if(!$validate->fails()){
        unset($data['_token']);
        if(!EMPTY($data['password'])){
          $data['password'] = bcrypt($data['password']);
        }
        else{
          unset($data['password']);
        }
        Admin::where('id',$id)->update($data);
        return redirect('admin/admins')->with([
          'success'=>'Admin successfully updated',
        ]);
      }
      else{
        return redirect('admin/admins/edit/'.$id)->withErrors($validate)
                                          ->withInput();
      }
    }
  }

  public function deleteAdmins(Request $request, $id){
    Admin::where('id',$id)->delete();
    return redirect('admin/admins')->with([
      'success'=>'Admin successfully deleted',
    ]);
  }

  /* -------------Manage Admins----------------- */

  /* -------------Manage Company Details----------------- */

  public function viewCompany(){
    $company = systemSettings::get();
    return view('admin.system_settings.companyDetails')->with([
      'company'=>$company,
    ]);
  }

  public function editCompany(Request $request, $id=0){
    if($request->isMethod('get')){
      $company = systemSettings::where('id',$id)->first();
      return view('admin.system_settings.edit_companyDetails')->with([
        'company'=>$company,
      ]);
    }
    if($request->isMethod('post')){
      $data = $request->all();
      $validate = Validator::make($data, [
        'company_name' => 'required|string|max:191',
        'address1' => 'required|string|max:191',
        'address2' => 'required|string|max:191',
        'address3' => 'required|string|max:191',
        'telephone' => 'required|numeric',
        'fax' => 'required|numeric',
        'facebook' => 'required|url',
        'twitter' => 'required|url',
        'linkedIn' => 'required|url',
      ]);
      if(!$validate->fails()){
        unset($data['_token']);
        if(ISSET($_FILES['company_logo']) && !EMPTY($_FILES['company_logo']['name'])){
          $destination = public_path().'/assets/admin/uploads/images/'.$_FILES['company_logo']['name'];
          $image_url = url('/').'/assets/admin/uploads/images/'.$_FILES['company_logo']['name'];
          if(file_exists($destination))
		  {
			unlink($destination);
          }
          move_uploaded_file($_FILES['company_logo']['tmp_name'],$destination);
          $data['company_logo'] = $image_url;
        }
        else{
          unset($data['company_logo']);
        }
        systemSettings::where('id',$id)->update($data);
        return redirect('admin/company')->with([
          'success'=>'Admin successfully updated',
        ]);
      }
      else
	  {
        return redirect('admin/company/edit/'.$id)->withErrors($validate)->withInput();
      }
    }
  }

  /* -------------Manage Company Details----------------- */
  
 
  /* -------------Manage Events----------------- */

  public function viewEvents(){
    $events = events::leftJoin('users','users.id','=','events.user_id')->select('users.name','events.*')->get();
    return view('admin/events/events')->with([
        'events'=>$events,
      ]);
  }
  
  
  public function statusEvents(Request $request,  $id){
    events::where('id',$id)->update([
        'status'=>$request->input('status'),
        
    ]);
    return redirect('admin/events')->with(['success'=>'Status changed successfully']);
  }
  /* -------------End Manage  Events----------------- */
  
  /* start close account code */
	public function closeRequest(Request $request)
	{
		$close_query = accountClose::join('users','users.id','account_closes.user_id')->get();    
		//dd($close_query);	
		return view('admin.users.account_close')->with('users',$close_query);
	}
  /* end close account code */	
  
 }
