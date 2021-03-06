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
use App\Country;
use App\events;
use App\Charity;
use Socialite;
use App\social_logins;
use PayPal;
use Crypt;
use Srmklive\PayPal\Services\ExpressCheckout;
use Srmklive\PayPal\Services\AdaptivePayments;
use App\transactions;
use App\reviews;
use App\friends;
use App\contact;
use App\invitefriend;
use App\followed_users;
use App\invite_users;
use App\tickets;
use App\notifications;
use DB;
use App\accountClose;
use App\Cms;
class userController extends Controller {

    public function myaccount(Request $request, $id = 0) {
        return view('user.account.my-account');
    }

    public function notifications(Request $request, $id = 0) 
	{		
		$login_user = Auth::guard('user')->user();
       
		$update_data['is_seen'] = 1;
		notifications::where(['user_id'=>$login_user->id,'is_seen'=>'0'])->update($update_data);		
		$notifications = notifications::where('user_id','=',$login_user->id)->get();
		
		/*$notifications = DB::table('notifications')
            ->join('users', 'notifications.another_user', '=', 'users.id')
            ->join('events', 'notifications.event_id', '=', 'events.id')
			->where('notifications.user_id','=',$login_user->id)
            ->select('notifications.*', 'users.name as action_user_name', 'events.title as event_title' )
            ->get();*/
		//dd($notifications);
		return view('user.account.notifications')->with(['notifications'=>$notifications]);
    }

    public function paymentmethod(Request $request, $id = 0){
        $login_user = Auth::guard('user')->user();
        if ($request->isMethod('post')) {
            $data = $request->all();
            $validate = Validator::make($data, [
                        'paypal_email' => 'required',
            ]);
            if (!$validate->fails()) {
                unset($data['_token']);
                User::where('id', $login_user->id)->update($data);
                $request->session()->flash('flash_message', '<div class="alert alert-success"><span class="glyphicon glyphicon-ok"></span><em>Paypal email has been updated successfully.</em></div>');
                return redirect('user/payment_method');
            } else {
                return redirect('user/payment_method')->withErrors($validate)->withInput();
            }
        }

        return view('user.account.payment-method')->with(['user' => $login_user]);
        ;
    }

    public function hostingoption(Request $request, $id = 0) {
        return view('user.account.hosting-option');
    }

    public function security(Request $request, $id = 0) {
        if($request->isMethod('post')) {
            $data = $request->all();
            $validate = Validator::make($data, [
                        'old_password' => 'required|min:6|',
                        'new_password' => 'required|min:6',
                        'comfirm_password' => 'required|min:6|same:new_password',
            ]);

            if(!$validate->fails()) {
                $login_user = Auth::guard('user')->user();
                if (!Hash::check($data['old_password'], $login_user->password)) {
                    $request->session()->flash('flash_message', '<div class="alert alert-danger"><span class="glyphicon glyphicon-remove"></span><em> old password invalid.</em></div>');
                    return redirect('user/security');
                } else {
                    $data['password'] = bcrypt($data['new_password']);
                    unset($data['_token']);
                    unset($data['old_password']);
                    unset($data['new_password']);
                    unset($data['comfirm_password']);
                    User::where('id', $login_user->id)->update($data);
                    $request->session()->flash('flash_message', '<div class="alert alert-success"><span class="glyphicon glyphicon-ok"></span><em> password has been changed successfully.</em></div>');
                    return redirect('user/security');
                }
            } else {
                return redirect('user/security')->withErrors($validate)->withInput();
            }
        }
        return view('user.account.security');
    }

    public function myevents(Request $request, $id = 0) {
        $users = array();
        $userList = followed_users::where('follower_id',Auth::guard('user')->user()->id)->get();
        foreach($userList as $item){
            $users[] = $item->followed_id;
        }
        //dd($users);
        $followed_events = events::leftJoin('users','users.id','=','events.user_id')
                ->leftJoin('charities','charities.id','=','events.charity_id')
                ->whereIn('events.user_id',$users)
                ->where('events.event_date','>=',date('m/d/Y'))
                ->where([
                    'users.is_disabled'=>0,
                    'events.status'=>1
                    ])
                ->select('users.name','users.last_name','users.dob','events.*','charities.*')
                ->get();
        //dd( $followed_events);
        
		$events_ids = array();
		
		$dob = Auth::guard('user')->user()->dob;
		$age = date('Y')-date('Y',strtotime($dob));
		$suggested_events_by_location = events::leftJoin('users','users.id','=','events.user_id')
                ->leftJoin('charities','charities.id','=','events.charity_id')
                //->where('events.min_age','<=',$age)
				//->where('events.max_age','>=',$age)
                ->where([
                    'users.is_disabled'=>0,
                    'events.status'=>1
                    ])
                ->select('users.name','users.last_name','users.dob','events.*','charities.*')
                ->get();		
		
		foreach($suggested_events_by_location as $events_by_location)
		{
			$events_ids[] = $events_by_location->id;
		}
		
		$dob = Auth::guard('user')->user()->dob;
		$age = date('Y')-date('Y',strtotime($dob));
		$suggested_events_by_age = events::leftJoin('users','users.id','=','events.user_id')
                ->leftJoin('charities','charities.id','=','events.charity_id')
                ->where('events.min_age','<=',$age)
				->where('events.max_age','>=',$age)
                ->where([
                    'users.is_disabled'=>0,
                    'events.status'=>1
                    ])
                ->select('users.name','users.last_name','users.dob','events.*','charities.*')
                ->get();
		foreach($suggested_events_by_age as $events_by_age)
		{
			$events_ids[] = $events_by_age->id;
		}
		//dd($events_ids);
		
		$suggested_events = events::leftJoin('users','users.id','=','events.user_id')
                ->leftJoin('charities','charities.id','=','events.charity_id')
                ->whereIn('events.id',$events_ids)
                ->where('events.event_date','>=',date('m/d/Y'))
                ->where([
                    'users.is_disabled'=>0,
                    'events.status'=>1
                    ])
                ->select('users.name','users.last_name','users.dob','events.*','charities.*')
                ->get();
		
		return view('user.my-events')->with([
            'followed_events'=>$followed_events,
			'suggested_events'=>$suggested_events
        ]);
    }

    public function inbox(Request $request, $id = 0) {
        return view('user.inbox');
    }

    public function imageupload(Request $request, $id = 0) {
        if ($request->isMethod('post')) {
            $login_user = Auth::guard('user')->user();
            $data = $request->all();
            $file = $request->file('image');
            $file_name = str_replace(' ', '_', time() . $file->getClientOriginalName());
            $destinationPath = 'assets\admin\uploads\users';
            $file->move($destinationPath, $file_name);

            unset($data['_token']);
            $data['image'] = $file_name;
            $data['user_id'] = $login_user->id;
            $data['default'] = 0;
            Userimages::insert($data);

            $user_data['photos'] = 1;
            User::where('id', $login_user->id)->update($user_data);
        }
    }

    public function registeration(Request $request, $id = 0) {
        if ($request->isMethod('post')) {
            $data = $request->all();

            $validate = Validator::make($data, [
                        'name' => 'required|string|max:191',
                        'email' => 'required|email|max:191|unique:users',
                        'last_name' => 'required|string|max:191',
                        'password' => 'required|min:6',
                        'gender' => 'required|string|max:191',
            ]);
            if (!$validate->fails()) {
                unset($data['_token']);
                $data['password'] = bcrypt($data['password']);
                $data['dob'] = $data['birthmonth'] . '/' . $data['birthday'] . '/' . $data['birthyear'];
                $data['confirmed'] = 0;
                $data['confirmation_code'] = str_shuffle("1234567890");
                unset($data['birthmonth']);
                unset($data['birthday']);
                unset($data['birthyear']);
                $user = User::create($data)->id;
                $authUser = User::where('id', $user)->first();
                Auth::guard('user')->login($authUser);

                Mail::send('emails.email_confirmation', ['user' => $authUser], function ($message) use($authUser) {
                    $message->to($authUser->email, $authUser->name . ' ' . $authUser->last_name)->subject('confirm your email!');
                });
                return redirect('/');
            } else {
                return redirect('/');
            }
        }
    }

    /* ----------- send email varification code ------------ */

    public function sendemailvarificationcode(Request $request) {
        $login_user = Auth::guard('user')->user();
        Mail::send('emails.email_confirmation', ['user' => $login_user], function ($message) use($login_user) {
            $message->to($login_user->email, $login_user->name . ' ' . $login_user->last_name)->subject('confirm your email!');
        });

        $request->session()->flash('flash_message', '<div class="alert alert-success"><span class="glyphicon glyphicon-ok"></span><em> email verification link has been sent to your email account.</em></div>');
        return redirect('user/home');
    }

    /* ---------- end email varification code -------------- */


    /* ----------- send email varification code ------------ */

    public function verify_email(Request $request, $code) {
        $user = User::where('confirmation_code', $code)->first();
        if (count($user) > 0) {
            $data['confirmed'] = 1;
            User::where('id', $user->id)->update($data);
            return redirect('user/home');
        } else {
            return redirect('/');
        }
    }

    /* ---------- end email varification code -------------- */

    /* ------------- update user --------------------- */

    public function updateuser(Request $request, $id = 0) {
        $login_user = Auth::guard('user')->user();
        if ($request->isMethod('post')) {
            $data = $request->all();
            unset($data['_token']);
            User::where('id', $login_user->id)->update($data);
            return redirect('user/home');
        }
    }

    /* --------------end update user ----------------- */

    /* ------------- update user --------------------- */

    public function ajaxResponse(Request $request, $id = 0) {
        if ($request->isMethod('post')) {
            $data = $request->all();
            unset($data['_token']);
            User::where('id', $_POST['id'])->update($data);
        }
    }

    /* --------------end update user ----------------- */

    public function public_profile(Request $request, $id = 0)
	{
        if($request->isMethod('get'))
		{
            $user = Auth::guard('user')->user();
            $social_login = social_logins::where('user_id', $user->id)->first();
            $upcomint_events = User::rightJoin('events', 'users.id', '=', 'events.user_id')->where('events.event_date', '>=', date('m/d/Y'))->get();
            $reviews = User::rightJoin('reviews', 'users.id', '=', 'reviews.post_id')->where('reviews.reply_id', 0)->get();
            $user_events = events::where('user_id', $user->id)->get();
            $friends = friends::where('user_id', $user->id)->get();  //->orWhere('friend_id', $user->id)->get();
			
			$user_images = Userimages::where('user_id','=',$user->id)->get();
			//dd($user_images);
            return view('user/public_profile')->with(['user' => $user, 'social_login' => $social_login, 'upcoming_events' => $upcomint_events, 'reviews' => $reviews, 'user_events' => $user_events, 'friend' => $friends, 'user_images'=>$user_images]);
        }
    }
	
    public function user_profile(Request $request, $id = 0)
	{
        if ($request->isMethod('get')) {
            $user = User::where('id', $id)->get()->first(); //Auth::guard('user')->user();			
            $social_login = social_logins::where('user_id', $id)->first();
			
            $upcomint_events = User::leftJoin('events', 'users.id', '=', 'events.user_id')
			->leftJoin('charities', 'charities.id', '=', 'events.charity_id')
			->where('events.event_date', '>=', date('m/d/Y'))
			->select('events.*', 'users.name','charities.title as charity_name','charities.logo')->get();
           
			//dd($upcomint_events);
       	   $reviews = User::rightJoin('reviews', 'users.id', '=', 'reviews.post_id')->where('reviews.reply_id', 0)->get();
           $user_events = events::where('user_id', $id)->get();
           $friends = array();  //friends::where('user_id', $id)->get();
           return view('user/profile')->with(['user' => $user, 'social_login' => $social_login, 'upcoming_events' => $upcomint_events, 'reviews' => $reviews, 'user_events' => $user_events, 'friend' => $friends]);
        }
    }

    public function write_review(Request $request, $id = 0) {
        if ($request->isMethod('post')) {
            $data = $request->all();
            $validate = Validator::make($data, [
                'review' => 'required|string|max:1000',
            ]);

            if (!$validate->fails()) {
                $user = Auth::guard('user')->user();

                $user_reviews = reviews::where('user_id', $user->id)->where('event', $data['event'])->get();
                if (count($user_reviews) > 0) {
                    return redirect('user/profile/' . base64_decode($data['post_id']));
                } else {
                    unset($data['_token']);
                    $data['post_id'] = base64_decode($data['post_id']);
                    $data['user_id'] = $user->id;
                    $data['status'] = 0;
                    $data['created_at'] = date('Y-m-d h:m:s');
                    reviews::insert($data);
                    return redirect('user/profile/' . base64_decode($data['post_id']));
                }
            } else {
                return redirect('user/profile/' . base64_decode($data['post_id']))->withErrors($validate)->withInput();
            }
        }
    }

    public function reply_for_review(Request $request, $id = 0) {
        if ($request->isMethod('post')) {
            $data = $request->all();
            $user = Auth::guard('user')->user();
            unset($data['_token']);
            $data['post_id'] = $data['post_id'];
            $data['user_id'] = $user->id;
            $data['status'] = 0;
            $data['created_at'] = date('Y-m-d h:m:s');
            reviews::insert($data);
            return redirect('user/profile/' . $data['post_id']);
        }
    }

    public function update_review(Request $request, $id = 0) {
        if ($request->isMethod('post')) {
            $data = $request->all();
            //print_r($data);
            $id = $data['id'];
            unset($data['_token']);
            unset($data['id']);
            reviews::where('id', $id)->update($data);
        }
    }

    public function invite_friends(Request $request, $id = 0) {
        if ($request->isMethod('get')) {
            $user = Auth::guard('user')->user();
            $events = User::rightJoin('events', 'users.id', '=', 'events.user_id')
                            ->where('events.event_date', '>=', date('m/d/Y'))
							->where('events.user_id', $user->id)->get();

            return view('user/invite_users')->with(['events' => $events,]);
        }
        if ($request->isMethod('post'))
		{
            $data = $request->all();
            $user = Auth::guard('user')->user();
            $validate = Validator::make($data, ['friend_email' => 'required|string', 'event_id' => 'required|string',]);
            if (!$validate->fails()) {
                unset($data['_token']);

                $friend_email = $data['friend_email'];
                $event_id = $data['event_id'];
                $invite_friend_data = invitefriend::where('friend_email', $friend_email)
                                ->where('event_id', $event_id)->get()->first();

                if (count($invite_friend_data) == 0)
				{
                    $data['user_id'] = $user->id;
                    $data['created_at'] = date('Y-m-d h:m:s');
                    $last_friend_id = invitefriend::insert($data);
                    $invite_friend_data = invitefriend::where('id', $last_friend_id)->get()->first();
                }

                $event = events::where('id', $data['event_id'])->get()->first();
                //dd($event);				
                Mail::send('emails.invite_friend', ['user' => $user, 'event' => $event, 'friend' => $invite_friend_data], function($message) use($friend_email) {
                    $message->to($friend_email, 'give a dinner party')->subject('your friend invite you to a dinner party');
                });

                return redirect('user/invite_friends')->with(['success' => "$friend_email invited successfully"]);
            } else {
                redirect('user/invite_friends')->withErrors($validate)->withInput();
            }
        }
    }
    
    public function compose(Request $request, $id = 0) {
        if ($request->isMethod('get')) {
            return view('user/message/compose');
        }
    }

    public function chat(Request $request, $id = 0) {
        if ($request->isMethod('get')) {
            return view('user/message/chat');
        }
    }

    public function edit_profile(Request $request, $id = 0) {
        if ($request->isMethod('get')) {
            return view('user/edit_profile');
        }
    }

    public function create_event(Request $request, $id = 0) {
        if ($request->isMethod('get'))
		{
		    $country = Country::get();
            $login_user = Auth::guard('user')->user();
            $past_events = events::where('user_id', $login_user->id)->get();
            $charities = Charity::get();
            return view('user/events/create_event')->with([
                        'country_list' => $country,
                        'past_events' => $past_events,
                        'charities' => $charities,
            ]);
        } else if ($request->isMethod('post')) {
            $data = $request->all();

            $validate = Validator::make($data, [
                        'title' => 'required|string|max:191',
                        'description' => 'required|string',
                        'event_date' => 'required|date',
                        'start_time_1' => 'required|numeric',
                        'start_time_2' => 'required|numeric',
                        'end_time_1' => 'required|numeric',
                        'end_time_2' => 'required|numeric',
                        'street' => 'required|string|max:191',
                        'city' => 'required|string|max:191',
                        'county' => 'string|max:191',
                        'country' => 'required|string|max:191',
                        'postal_code' => 'required|string|max:191',
                        'drink_preferences' => 'required|string|max:191',
                        'own_drinks' => 'required|string|max:191',
                        'drinks_included' => 'required|string|max:191',
                        'food_included' => 'required|string|max:191',
                        'food_type' => 'required|string|max:191',
                        'open_to' => 'required|string|max:191',
                        'guest_gender' => 'required|string|max:191',
                        'min_age' => 'required|numeric',
                        'max_age' => 'required|numeric',
                        'orientation' => 'required|string|max:191',
                        'dress_code' => 'required|string|max:191',
                        'setting' => 'required|string|max:191',
                        'seating' => 'string|max:191',
                        'min_guests' => 'required|numeric',
                        'max_guests' => 'required|numeric',
                        'ticket_price' => 'required|numeric',
                        'charity_id' => 'required|numeric',
                        'charity_cut' => 'required|numeric',
                        'reference_number' => 'required|string|max:191',
                        'welcome_note' => 'required|string|max:191',
            ]);
            if (!$validate->fails()) {
                unset($data['_token']);
                $data['start_time'] = $data['start_time_1'] . ':' . $data['start_time_2'];
                $data['end_time'] = $data['end_time_1'] . ':' . $data['end_time_2'];
                unset($data['start_time_1']);
                unset($data['start_time_2']);
                unset($data['end_time_1']);
                unset($data['end_time_2']);
                unset($data['agree']);
                unset($data['confirm']);
                $data['food_drink_type'] = json_encode($data['food_drink_type']);
                $data['user_id'] = Auth::guard('user')->user()->id;
                $data['status'] = 1;
                $event_id = events::insert($data);
				
				/* start send user notification */
				$login_user = Auth::guard('user')->user();
				$userList = followed_users::where('follower_id',$login_user->id)->get();
				if(count($userList)>0)
				{	
					foreach($userList as $item)
					{						
						//$users[] = $item->followed_id;
						$notification['user_id'] = $item->followed_id;
						$notification['another_user'] = $login_user->id;
						$notification['notification'] = '<strong>'.$login_user->name.'</strong> launching a new event  <strong>'.$data['title'].'</strong>';//'invited you to his';
						$notification['event_id'] = $event_id;
						$notification['notification_type'] = 'event';
						$notification['is_seen'] = 0;
						$notification['created_at'] = date('Y-m-d h:m:s');
						notifications::insert($notification);
					}
				}	
				/* end send user notification */
				
				
                return redirect('/user/my_events')->with('success', 'Event Successfully Created!');
            } else {
                return redirect('/user/create_event')->withInput()->withErrors($validate);
            }
        }		
    }

	public function edit_event(Request $request, $id = 0) {
        if ($request->isMethod('get')) {
            $country = Country::get();
            $login_user = Auth::guard('user')->user();
            $past_events = events::where('user_id', $login_user->id)->get();
            $charities = Charity::get();
			$events_details = events::where('user_id', $login_user->id)->where('id',$id)->first();            
			//dd($events_details);
			return view('user/events/edit_event')->with([
                        'country_list' => $country,
                        'past_events' => $past_events,
                        'charities' => $charities,
						'events_details' => $events_details,
            ]);
        } else if ($request->isMethod('post')) {
            $data = $request->all();

            $validate = Validator::make($data, [
                        'title' => 'required|string|max:191',
                        'description' => 'required|string',
                        'event_date' => 'required|date',
                        'start_time_1' => 'required|numeric',
                        'start_time_2' => 'required|numeric',
                        'end_time_1' => 'required|numeric',
                        'end_time_2' => 'required|numeric',
                        'street' => 'required|string|max:191',
                        'city' => 'required|string|max:191',
                        'county' => 'string|max:191',
                        'country' => 'required|string|max:191',
                        'postal_code' => 'required|string|max:191',
                        'drink_preferences' => 'required|string|max:191',
                        'own_drinks' => 'required|string|max:191',
                        'drinks_included' => 'required|string|max:191',
                        'food_included' => 'required|string|max:191',
                        'food_type' => 'required|string|max:191',
                        'open_to' => 'required|string|max:191',
                        'guest_gender' => 'required|string|max:191',
                        'min_age' => 'required|numeric',
                        'max_age' => 'required|numeric',
                        'orientation' => 'required|string|max:191',
                        'dress_code' => 'required|string|max:191',
                        'setting' => 'required|string|max:191',
                        'seating' => 'string|max:191',
                        'min_guests' => 'required|numeric',
                        'max_guests' => 'required|numeric',
                        'ticket_price' => 'required|numeric',
                        'charity_id' => 'required|numeric',
                        'charity_cut' => 'required|numeric',
                        'reference_number' => 'required|string|max:191',
                        'welcome_note' => 'required|string|max:191',
            ]);
            if (!$validate->fails()) {
                unset($data['_token']);
                $data['start_time'] = $data['start_time_1'] . ':' . $data['start_time_2'];
                $data['end_time'] = $data['end_time_1'] . ':' . $data['end_time_2'];
                unset($data['start_time_1']);
                unset($data['start_time_2']);
                unset($data['end_time_1']);
                unset($data['end_time_2']);
                unset($data['agree']);
                unset($data['confirm']);
                $data['food_drink_type'] = json_encode($data['food_drink_type']);
               // $data['user_id'] = Auth::guard('user')->user()->id;
                //$data['status'] = 1;
                 events::where('id',$id)->update($data);
                return redirect('/user/my_events')->with('success', 'Event Successfully Created!');
            } else {
                return redirect('/user/edit_event/'.$id)->withInput()->withErrors($validate);
            }
        }
    }
	
    public function hostverification(Request $request, $id = 0) {
        if ($request->isMethod('post')) {
            $data = $request->all();

            if ($data['upload'] == 'idupload') {
                $validate = Validator::make($data, [
                            'id_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                ]);

                if (!$validate->fails()) {
                    $file = $request->file('id_proof');

                    if (isset($_FILES['id_proof']['name']) && !empty($_FILES['id_proof']['name'])) {
                        $file_name = str_replace(' ', '_', time() . $file->getClientOriginalName());
                        $destinationPath = 'assets\admin\uploads\users';
                        $file->move($destinationPath, $file_name);
                        if (file_exists('assets/admin/uploads/users/' . $data['old_file']) && !empty($data['old_file'])) {
                            unlink('assets/admin/uploads/users/' . $data['old_file']);
                        }
                        $full_path = 'assets/admin/uploads/users/' . $file_name;
                    } else {
                        $full_path = "";
                        $file_name = $data['old_file'];
                    }

                    unset($data['_token']);
                    unset($data['old_file']);
                    unset($data['upload']);
                    $data['id_proof'] = $file_name;
                    $login_user = Auth::guard('user')->user();
                    User::where('id', $login_user->id)->update($data);

                    if (!empty($full_path)) {
                        Mail::send('emails.id_proof', ['user' => $login_user], function ($message) use($full_path) {
                            $message->to('phpdeveloper70@gmail.com', 'admin')->subject('ID Proof for Approve');
                            $message->attach($full_path);
                        });
                    }

                    $request->session()->flash('flash_message', '<div class="alert alert-success"><span class="glyphicon glyphicon-ok"></span><em> your document has been successfully uploaded.</em></div>');
                    return redirect('user/host_verification');
                } else {
                    redirect('user/host_verification')->withErrors($validate)->withInput();
                }
            }

            if ($data['upload'] == 'addressupload') {
                $validate = Validator::make($data, [
                            'address_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                ]);

                if (!$validate->fails()) {
                    $file = $request->file('address_proof');
                    if (isset($_FILES['address_proof']['name']) && !empty($_FILES['address_proof']['name'])) {
                        $file_name = str_replace(' ', '_', time() . $file->getClientOriginalName());
                        $destinationPath = 'assets\admin\uploads\users';
                        $file->move($destinationPath, $file_name);
                        if (file_exists('assets/admin/uploads/users/' . $data['old_file']) && !empty($data['old_file'])) {
                            unlink('assets/admin/uploads/users/' . $data['old_file']);
                        }
                    } else {
                        $file_name = $data['old_file'];
                    }

                    unset($data['_token']);
                    unset($data['old_file']);
                    unset($data['upload']);
                    $data['address_proof'] = $file_name;
                    $login_user = Auth::guard('user')->user();
                    User::where('id', $login_user->id)->update($data);

                    $request->session()->flash('flash_message', '<div class="alert alert-success"><span class="glyphicon glyphicon-ok"></span><em> your document has been successfully uploaded.</em></div>');
                    return redirect('user/host_verification');
                } else {
                    redirect('user/host_verification')->withErrors($validate)->withInput();
                }
            }
        }
        $user = Auth::guard('user')->user();
        $social_login = social_logins::where('user_id', $user->id)->first(); //social_logins
        return view('user.account.host_verify')->with(['user' => $user, 'social_login' => $social_login]);
    }

    public function redirectToFacebook(Request $request, $id = 0) {
        return Socialite::driver('facebook')->redirect();
    }

    public function getEventDetails(Request $request) {
        $event = events::where(['id' => $request->input('event_id'), 'user_id' => Auth::guard('user')->user()->id])->first();
        return json_encode($event);
    }

    public function search_event(Request $request) {
        $filtered_users = array();
        $logged_in_id = Auth::guard('user')->user()->id;
		
		$postcode = $request->input('postcode_town');
		
        $users = User::where([
                    'is_disabled' => 0,
                    'confirmed' => 1,
                    'photos' => 1,
                ])->whereNotIn('id', array($logged_in_id))
				->where('postcode','like','%'.$postcode.'%')
				->orWhere('town','like','%'.$postcode.'%')->get();

        /*if($request->input('distance') != '' && $request->input('distance') != 'Any') {
            $user_post = Auth::guard('user')->user()->postcode;
            foreach ($users as $user)
			{
                $postcode1 = preg_replace('/\s+/', '', $user_post);
                $postcode2 = preg_replace('/\s+/', '', $user->postcode);
                $url = "http://maps.googleapis.com/maps/api/distancematrix/json?origins=$postcode1&destinations=$postcode2&mode=driving&language=en-EN&sensor=false";
                $data = @file_get_contents($url);
                $result = json_decode($data, true);
                if ($result['status'] == "OK" && $result['rows'][0]['elements'][0]['status'] == "OK")
				{
                    $distance_value = $result['rows'][0]['elements'][0]['distance']['text'];
                    $distance_value_array = explode(' ', $distance_value);
                    if ($distance_value_array[1] == 'm')
					{
                        $distance_value = $distance_value_array[0] / 1000;
                    }
					else
					{
                        $distance_value = $distance_value_array[0];
                    }
                    if ($distance_value <= $request->input('distance')) {
                        $filtered_users[] = $user->id;
                    }
                }
            }
        } else {
            foreach ($users as $user) {
                $filtered_users[] = $user->id;
            }
        }
		*/
		
		foreach ($users as $user)
		{
            $filtered_users[] = $user->id;
        }
        if ($request->has('age1')) {
            $users = User::where([
                        'is_disabled' => 0,
                        'confirmed' => 1,
                        'photos' => 1,
                    ])->whereIn('id', $filtered_users)->get();
            $filtered_users1 = array();
            foreach ($users as $user) {
                $dob = explode('/', $user->dob);
                if (date('Y') - $dob[2] <= $request->input('age2') && date('Y') - $dob[2] >= $request->input('age1')) {
                    $filtered_users1[] = $user->id;
                }
            }
            unset($filtered_users);
            $filtered_users = $filtered_users1;
            unset($filtered_users1);
        }
        if ($request->has('gender') && $request->input('gender') != "Don't Mind") {
            $users = User::where([
                        'is_disabled' => 0,
                        'confirmed' => 1,
                        'photos' => 1,
                        'gender' => $request->input('gender'),
                    ])->whereIn('id', $filtered_users)->get();
            $filtered_users1 = array();
            foreach ($users as $user) {
                $filtered_users1[] = $user->id;
            }
            unset($filtered_users);
            $filtered_users = $filtered_users1;
            unset($filtered_users1);
        }
        if ($request->has('status') && $request->input('status') != "Don't Mind") {
            $users = User::where([
                        'is_disabled' => 0,
                        'confirmed' => 1,
                        'photos' => 1,
                        'status' => $request->input('status'),
                    ])->whereIn('id', $filtered_users)->get();
            $filtered_users1 = array();
            foreach ($users as $user) {
                $filtered_users1[] = $user->id;
            }
            unset($filtered_users);
            $filtered_users = $filtered_users1;
            unset($filtered_users1);
        }
        if ($request->has('sexuality') && $request->input('sexuality') != "Don't Mind") {
            $users = User::where([
                        'is_disabled' => 0,
                        'confirmed' => 1,
                        'photos' => 1,
                        'sexuality' => $request->input('sexuality'),
                    ])->whereIn('id', $filtered_users)->get();
            $filtered_users1 = array();
            foreach ($users as $user) {
                $filtered_users1[] = $user->id;
            }
            unset($filtered_users);
            $filtered_users = $filtered_users1;
            unset($filtered_users1);
        }
        if ($request->has('ethnicity') && $request->input('ethnicity') != "Don't Mind") {
            $users = User::where([
                        'is_disabled' => 0,
                        'confirmed' => 1,
                        'photos' => 1,
                        'ethnicity' => $request->input('ethnicity'),
                    ])->whereIn('id', $filtered_users)->get();
            $filtered_users1 = array();
            foreach ($users as $user) {
                $filtered_users1[] = $user->id;
            }
            unset($filtered_users);
            $filtered_users = $filtered_users1;
            unset($filtered_users1);
        }
        if ($request->has('education') && $request->input('education') != "Don't Mind") {
            $users = User::where([
                        'is_disabled' => 0,
                        'confirmed' => 1,
                        'photos' => 1,
                        'education' => $request->input('education'),
                    ])->whereIn('id', $filtered_users)->get();
            $filtered_users1 = array();
            foreach ($users as $user) {
                $filtered_users1[] = $user->id;
            }
            unset($filtered_users);
            $filtered_users = $filtered_users1;
            unset($filtered_users1);
        }
        if ($request->has('religion') && $request->input('religion') != "Don't Mind") {
            $users = User::where([
                        'is_disabled' => 0,
                        'confirmed' => 1,
                        'photos' => 1,
                        'religion' => $request->input('religion'),
                    ])->whereIn('id', $filtered_users)->get();
            $filtered_users1 = array();
            foreach ($users as $user) {
                $filtered_users1[] = $user->id;
            }
            unset($filtered_users);
            $filtered_users = $filtered_users1;
            unset($filtered_users1);
        }
        if ($request->has('hobbies') && count($request->input('hobbies')) != 0) {
            $users = User::where([
                        'is_disabled' => 0,
                        'confirmed' => 1,
                        'photos' => 1,
                    ])->whereIn('id', $filtered_users)->get();
            $filtered_users1 = array();
            foreach($users as $user) {
                for ($i = 0; $i < count($request->input('hobbies')); $i++) {
                    if (strpos($user->hobbies, $request->input('hobbies')[$i]) > 0) {
                        $filtered_users1[] = $user->id;
                        break;
                    }
                }
            }
            unset($filtered_users);
            $filtered_users = $filtered_users1;
            unset($filtered_users1);
        }

        if ($request->has('languages') && count($request->input('languages')) != 0) {
            $users = User::where([
                        'is_disabled' => 0,
                        'confirmed' => 1,
                        'photos' => 1,
                    ])->whereIn('id', $filtered_users)->get();
            $filtered_users1 = array();
            foreach ($users as $user) {
                for ($i = 0; $i < count($request->input('languages')); $i++) {
                    if (strpos($user->spoken_languages, $request->input('languages')[$i]) > 0) {
                        $filtered_users1[] = $user->id;
                        break;
                    }
                }
            }
            unset($filtered_users);
            $filtered_users = $filtered_users1;
            unset($filtered_users1);
        }
        //print_r($filtered_users);
        //exit;
        if (count($filtered_users) > 0) {           
            $users = User::whereIn('id', $filtered_users)->where('id' ,'!=' ,$logged_in_id)->get();
            //dd($users);
            return view('user/ajax_filter_users')->with(['users' => $users,]);
        } else {
            exit;
        }
    }

    public function paypalverify(Request $request, $id = 0) {
        $login_user = Auth::guard('user')->user();
        $provider = new AdaptivePayments;     // To use adaptive payments.
        $provider = PayPal::setProvider('adaptive_payments');
        $data = ['receivers' => [
                    [
                    'email' => $login_user->paypal_email,
                    'amount' => 0.1,
                    'primary' => false,
                ],
            ],
            'payer' => 'EACHRECEIVER',
            'return_url' => url('user/paypal_success_verify'),
            'cancel_url' => url('user/host_verification'),
        ];
        $response = $provider->createPayRequest($data);
        $redirect_url = $provider->getRedirectUrl('approved', $response['payKey']);
        return redirect($redirect_url);
    }

    public function paypal_success_verify(Request $request, $id = 0) {
        $login_user = Auth::guard('user')->user();
        $data['paypal_confirm'] = 1;
        User::where('id', $login_user->id)->update($data);
        return redirect('user/host_verification');
    }

    public function paypalsentboxverify(Request $request, $id = 0)
	{
        $provider = new ExpressCheckout;     // To use adaptive payments.
        $provider = PayPal::setProvider('express_checkout');
        $data['items'] = [
                [
                'name' => 'Product 1',
                'price' => 1,
                'qty' => 1
            ]
        ];
        $data['invoice_id'] = 1;
        $data['invoice_description'] = "Order #1 Invoice";
        $data['return_url'] = url('/payment/success');
        $data['cancel_url'] = url('/cart');
        $data['total'] = 1;
        $response = $provider->setExpressCheckout($data);
        $response = $provider->setExpressCheckout($data, true);
        return redirect($response['paypal_link']);
    }
	
	/* start invite user for event */
	
    public function inviteuserforevent(Request $request)
	{
		if ($request->isMethod('post')) 
		{
            $data = $request->all();
			
			$user_id = $data['friend_id'];
			$event_id = $data['event_id'];
			$login_user = Auth::guard('user')->user();   // login user
			
			$user = User::where('id', $user_id)->first();  // user who invite
			$events = events::where('id', $event_id)->first(); // event data
			
			$invite_friend_data = invite_users::where('friend_id', $user_id)
                                ->where('event_id', $event_id)->get()->first();
			if(count($invite_friend_data)==0)
			{
				$insert_data['user_id'] = $login_user->id;
				$insert_data['event_id'] = $event_id;
				$insert_data['friend_id'] = $user_id;
				$insert_data['transaction_id'] = "";
				$insert_data['created_at'] = date('Y-m-d h:m:s');
				invite_users::insert($insert_data);
			
				$notification['user_id'] = $user_id;
				$notification['another_user'] = $login_user->id;
				$notification['notification'] = '<strong>'.$login_user->name.'</strong> invited you to his <strong>'.$events->title.'</strong> Gathering';//'invited you to his';
				$notification['event_id'] = $event_id;
				$notification['notification_type'] = 'invite';
				$notification['is_seen'] = 0;
				$notification['created_at'] = date('Y-m-d h:m:s');
				notifications::insert($notification);
			}
			
			Mail::send('emails.send_payment_link_for _event', ['login_user' => $login_user, 'invite_user' => $user, 'event' => $events], function ($message) use($user) {
				$message->to($user->email, 'giveadinnerparty.com')->subject('Invitation for a dinner party');
			});
		}	
    }
	
	public function event_payment(Request $request, $user_id = 0, $event_id = 0)
	{
        if($request->isMethod('get'))
		{
            $user = User::where('id', Crypt::decrypt($user_id))->first();  // user who invite
            $events = events::where('id', Crypt::decrypt($event_id))->first(); // event data
			
			$qty = 1;
			$booking_fee = 6.25;
			
            $provider = new AdaptivePayments;     // To use adaptive payments.
            $provider = PayPal::setProvider('adaptive_payments');
            $data = ['receivers' => [
                        [
                        'email' => $user->email,
                        'amount' => 0.01, //($events->ticket_price+$booking_fee)*$qty,
                        'description' => $events->title,
                        'primary' => false,
                    ],
                ],
                'payer' => 'EACHRECEIVER',
                'return_url' => url('user/success_event_payment'),
                'cancel_url' => url('user/cancel_event_payment'),
            ];
            $response = $provider->createPayRequest($data);
            $redirect_url = $provider->getRedirectUrl('approved', $response['payKey']);

            if(isset($response['payKey']) && !empty($response['payKey']))
			{
                $tr_data['payKey'] = $response['payKey'];
                $tr_data['transaction_id'] = '';
                $tr_data['user_id'] = $user->id;
                $tr_data['event_id'] = $events->id;
                $tr_data['amount'] = $events->ticket_price;
                $tr_data['status'] = '';
                $transaction_id = transactions::insertGetId($tr_data);
				
				$user_data['transaction_id'] = $transaction_id;
                invite_users::where('friend_id', $user->id)
				->where('event_id',$events->id)->update($user_data);
				
                $request->session()->put('payKey', $response['payKey']);
                return redirect($redirect_url);
            } 
			else
			{
                return redirect('');
            }
        }
    }
	
	public function success_event_payment(Request $request, $id = 0)
	{
        $key = $request->session()->get('payKey');
        $provider = new AdaptivePayments;     // To use adaptive payments.
        $provider = PayPal::setProvider('adaptive_payments');
        $response = $provider->getPaymentDetails($key);
		
        if ($response['status'] == 'COMPLETED')
		{
            $data['transaction_id'] = $response['paymentInfoList']['paymentInfo'][0]['senderTransactionId'];
            $data['status'] = $response['status'];
            transactions::where('payKey', $key)->update($data);
			
			$transactions = transactions::where('payKey',$key)->first();
			$invite_user = invite_users::where('transaction_id',$transactions->id)->first();			
			$event_data = events::where('id',$invite_user->event_id)->first();
			
			$qty = 1;
			$booking_fee = 6.25;
			$ticket_data['transaction_id'] = $transactions->id;
			$ticket_data['event_id'] = $invite_user->event_id;
			$ticket_data['user_id'] = $invite_user->user_id;
			$ticket_data['ticket_price'] = $event_data->ticket_price;
			$ticket_data['qty'] =  $qty;
			$ticket_data['charity_id'] = $event_data->charity_id;
			$ticket_data['charity_cut'] = $event_data->charity_cut;
			$ticket_data['booking_fee'] = $booking_fee;
			$ticket_data['final_amount'] = ($event_data->ticket_price+$booking_fee)*$qty;
			$ticket_data['user_type'] = 'user';
			$ticket_data['status'] = 0;
			$ticket_data['user_type'] = 'friend';
			$ticket_data['created_at'] = date('Y-m-d h:m:s');
			tickets::insert($ticket_data);
			
        }
        $request->session()->forget('payKey');
        return redirect('');
    }
	
	public function cancel_event_payment(Request $request, $id = 0)
	{
        $key = $request->session()->get('payKey');
        $provider = new AdaptivePayments;     // To use adaptive payments.
        $provider = PayPal::setProvider('adaptive_payments');
        $response = $provider->getPaymentDetails($key);

        $data['status'] = 'FAILED';
        transactions::where('payKey', $key)->update($data);
        $request->session()->forget('payKey');
        return redirect('');
    }
	
	/* end invite user for event */
	
	/* start invite friend for event*/
		public function friend_payment_link(Request $request)
		{
			if ($request->isMethod('get'))
			{
				$user = Auth::guard('user')->user();
				$events = User::leftJoin('events', 'users.id', '=', 'events.user_id')
					->leftJoin('charities', 'charities.id', '=', 'events.charity_id')
					->where('events.event_date', '>=', date('m/d/Y'))
					->where('events.user_id', $user->id)
					->select('events.*', 'users.name','charities.title as charity_name','charities.logo')->get();				
				return view('user/friend_payment_link')->with('events', $events);
			}
			
			if ($request->isMethod('post'))
			{
				
				$data = $request->all();
				$user = Auth::guard('user')->user();
				$validate = Validator::make($data, ['email' => 'required|string', 'event_id' => 'required|string',]);
				if (!$validate->fails()) {
					unset($data['_token']);
					$friend_email = $data['email'];
					$event_id = $data['event_id'];
					$invite_friend_data = invitefriend::where('email', $friend_email)
									->where('event_id', $event_id)->get()->first();

					if (count($invite_friend_data) == 0)
					{
						$data['user_id'] = $user->id;
						$data['total_price'] = str_replace('£','',$data['total_price']);	
						$data['created_at'] = date('Y-m-d h:m:s');
						$last_friend_id = invitefriend::insert($data);
						$invite_friend_data = invitefriend::where('id', $last_friend_id)->get()->first();
					}

					$event = events::where('id', $data['event_id'])->get()->first();
					Mail::send('emails.invite_friend', ['user' => $user, 'event' => $event, 'friend' => $invite_friend_data], function($message) use($friend_email)
					{
						$message->to($friend_email, 'give a dinner party')->subject('your friend invite you to a dinner party');
					});

					return redirect('user/friend_payment_link')->with(['success' => "$friend_email invited successfully"]);
				} else {
					redirect('user/friend_payment_link')->withErrors($validate)->withInput();
				}
			}
		}		
		
		public function invite_friend_payment(Request $request, $event = 0, $friend_id = 0)
		{
			if ($request->isMethod('get')){
				$event_id = Crypt::decrypt($event);
				$friend_id = Crypt::decrypt($friend_id);

				$friend = invitefriend::where('id', $friend_id)->first();  // user who invite
				$events = events::where('id', $event_id)->first(); // event data

				$provider = new AdaptivePayments;     // To use adaptive payments.
				$provider = PayPal::setProvider('adaptive_payments');
				
				$booking_fee = 6.25;
				
				$data = ['receivers' => [
							[
							'email' => $friend->email,
							'amount' => 0.01, //$friend->total_price+$booking_fee,
							'description' => $events->title,
							'primary' => false,
						],
					],
					'payer' => 'EACHRECEIVER',
					'return_url' => url('user/success_friend_payment'),
					'cancel_url' => url('user/cancel_event_payment'),
				];
				$response = $provider->createPayRequest($data);
				//dd($response);				
				$redirect_url = $provider->getRedirectUrl('approved', $response['payKey']);

				if (isset($response['payKey']) && !empty($response['payKey'])){
					$tr_data['payKey'] = $response['payKey'];
					$tr_data['transaction_id'] = '';
					$tr_data['user_id'] = $friend->email;
					$tr_data['event_id'] = $events->id;
					$tr_data['amount'] = $events->ticket_price;
					$tr_data['status'] = '';
					$transaction_id = transactions::insertGetId($tr_data);
					//echo $friend->id; die;
					
					$data_friend['transaction_id'] = $transaction_id;
					invitefriend::where('id', $friend->id)->update($data_friend);

					$request->session()->put('payKey', $response['payKey']);
					return redirect($redirect_url);
				} else {
					return redirect('');
				}
			}
		}
		
	public function success_friend_payment(Request $request, $id = 0)
	{
        $key = $request->session()->get('payKey');
        $provider = new AdaptivePayments;     // To use adaptive payments.
        $provider = PayPal::setProvider('adaptive_payments');
        $response = $provider->getPaymentDetails($key);
		
        if ($response['status'] == 'COMPLETED')
		{
            $data['transaction_id'] = $response['paymentInfoList']['paymentInfo'][0]['senderTransactionId'];
            $data['status'] = $response['status'];
            transactions::where('payKey', $key)->update($data);
			
			$transactions = transactions::where('payKey',$key)->first();
			$invite_user = invitefriend::where('transaction_id',$transactions->id)->first();			
			$event_data = events::where('id',$invite_user->event_id)->first();
			
			//$qty = 1;
			$booking_fee = 6.25;
			$ticket_data['transaction_id'] = $transactions->id;
			$ticket_data['event_id'] = $invite_user->event_id;
			$ticket_data['user_id'] = $invite_user->user_id;
			$ticket_data['ticket_price'] = $event_data->ticket_price;
			$ticket_data['qty'] =  $event_data->qty;
			$ticket_data['charity_id'] = $event_data->charity_id;
			$ticket_data['charity_cut'] = $event_data->charity_cut;
			$ticket_data['booking_fee'] = $booking_fee;
			$ticket_data['final_amount'] = ($event_data->ticket_price+$booking_fee)*$event_data->qty;
			$ticket_data['status'] = 0;
			$ticket_data['user_type'] = 'friend';
			$ticket_data['created_at'] = date('Y-m-d h:m:s');
			tickets::insert($ticket_data);
			
        }
        $request->session()->forget('payKey');
        return redirect('');
    }
		
	/* end invite friend for event*/
	

    public function postNotify(Request $request) {
        //Import the namespace Srmklive\PayPal\Services\ExpressCheckout first in your controller.
        $provider = new ExpressCheckout;
        $response = (string) $provider->verifyIPN($request);
        if ($response === 'VERIFIED')
		{
            
        }
    }

    public function yourHosting() {
        $user = Auth::guard('user')->user();
        //$events = User::rightJoin('events', 'users.id', '=', 'events.user_id')->where('events.user_id', $user->id)->get();
		$events = User::leftJoin('events', 'users.id', '=', 'events.user_id')
			->leftJoin('charities', 'charities.id', '=', 'events.charity_id')
			->where('events.user_id', $user->id)
			->select('events.*', 'users.name','charities.title as charity_name','charities.logo')->get();
        return view('user/your_hosting')->with(['events' => $events,]);
    }

    public function myActiveEvent(Request $request) {
        $user = Auth::guard('user')->user();
		$events = User::leftJoin('events', 'users.id', '=', 'events.user_id')
			->leftJoin('charities', 'charities.id', '=', 'events.charity_id')
			->where('events.event_date', '>=', date('m/d/Y'))
			->where('events.user_id', $user->id)
			->select('events.*', 'users.name','charities.title as charity_name','charities.logo')->get();
		//$awaiting_tickets = 
		
		$awaiting_events = events::where('events.user_id', $user->id)
							->where('events.event_date', '>=', date('m/d/Y'))->get();
		
        return view('user/my_active_events')->with(['events' => $events,'awaiting_events'=>$awaiting_events]);
    }

    public function myEndedEvent(Request $request) {
        $user = Auth::guard('user')->user();
        /*$events = User::rightJoin('events', 'users.id', '=', 'events.user_id')
                        ->where('events.event_date', '<', date('m/d/Y'))
                        ->where('events.user_id', $user->id)->get();*/
		$events = User::leftJoin('events', 'users.id', '=', 'events.user_id')
			->leftJoin('charities', 'charities.id', '=', 'events.charity_id')
			->where('events.event_date', '<', date('m/d/Y'))
			->where('events.user_id', $user->id)
			->select('events.*', 'users.name','charities.title as charity_name','charities.logo')->get();
			
        return view('user/my_ended_events')->with(['events' => $events,]);
    }
    
    public function hostEventDetails(Request $request, $id)
	{
        //$event = events::where(['id'=>$id, 'user_id'=>Auth::guard('user')->user()->id])->first();
		$event = User::leftJoin('events', 'users.id', '=', 'events.user_id')
			->leftJoin('charities', 'charities.id', '=', 'events.charity_id')
			->where('events.id', '=', $id)
			->select('events.*', 'users.name as user_name','users.dob','users.town as user_town','users.country as user_country','charities.title as charity_name','charities.description as charity_description','charities.logo')->first();		
        return view('user/events/event_detail_host')->with('event', $event);
    }
    
    public function followUser(Request $request, $id)
	{
        if($request->input('type') == 'check_follow'){
            $follow_status = followed_users::where([
                        'follower_id' => Auth::guard('user')->user()->id,
                        'followed_id' => $id
                    ])->get();
        
            if(count($follow_status) > 0){
                echo "Following";
            }
            else{
                echo "Follow";
            }
        }
        else{
            $follow_status = followed_users::where([
                        'follower_id' => Auth::guard('user')->user()->id,
                        'followed_id' => $id
                    ])->get();        
            if(count($follow_status) > 0){
                followed_users::where([
                        'follower_id' => Auth::guard('user')->user()->id,
                        'followed_id' => $id
                    ])->delete();
                echo "Follow";
            }
            else{
                followed_users::insert([
                    'follower_id' => Auth::guard('user')->user()->id,
                    'followed_id' => $id
                ]);
                echo "Following";
            }
        }
	}
		

	public function request_for_tickets(Request $request)
    {
		if($request->isMethod('post')) 
		{
			$data = $request->all();
			$tickets_data = tickets::where('event_id',$data['event_id'])
				   ->where('user_id',$data['user_id'])->first();	
			if(count($tickets_data)==0)
			{	
				unset($data['_token']);
				$data['status']='unapprove';
				$data['cancel']='no';
				$data['purchase']='no';
				$data['user_type'] = 'user';
				$data['created_at'] = date('Y-m-d h:m:s');
				tickets::insert($data);
			}
		}
		
	}	
	
	public function get_single_event_data(Request $request, $id=0)
	{
		if ($request->isMethod('post')) 
		{
			$event_id = $request->input('id');
			//$events = events::where('id', $event_id)->first(); // event data			
			$events = events::leftJoin('charities', 'events.charity_id', '=', 'charities.id')
					->where('events.id', $event_id)
					->select('events.*','charities.title as charity_name')->first();			
			return $events;
		}
	}
	
	public function book_event_ticket(Request $request, $id=0)
	{	
		$user = Auth::guard('user')->user();
		$event = User::leftJoin('events', 'users.id', '=', 'events.user_id')
		->leftJoin('charities', 'charities.id', '=', 'events.charity_id')
		->where('events.id', '=', $id)
		->select('events.*', 'users.name as user_name','users.dob','users.town as user_town','users.country as user_country','charities.title as charity_name','charities.description as charity_description','charities.logo')->first();		
			
		$event_booked = tickets::where(['event_id'=>$id, 'user_id'=>$user->id])->first();
		//dd($event_booked);
		return view('user/events/event_booking')->with(['event'=> $event, 'event_booked'=> $event_booked,]);
	}
		
	public function requested_ticket(Request $request, $id=0)
	{	
		$user = Auth::guard('user')->user();
		
		$unapprove_ticket = User::leftJoin('events', 'users.id', '=', 'events.user_id')
			->leftJoin('tickets', 'tickets.event_id', '=', 'events.id')
			->leftJoin('charities', 'charities.id', '=', 'events.charity_id')			
			->where('tickets.status', '=', 'unapprove')
			->where('tickets.user_id', $user->id)
			->select('events.*', 'users.name','charities.title as charity_name','charities.logo','tickets.id as ticket_id','tickets.status as ticket_status','tickets.booking_fee','tickets.qty','tickets.final_amount')->get();
		
		$approve_ticket = User::leftJoin('events', 'users.id', '=', 'events.user_id')
			->leftJoin('tickets', 'tickets.event_id', '=', 'events.id')
			->leftJoin('charities', 'charities.id', '=', 'events.charity_id')			
			->where('tickets.status', '=', 'approve')
			->where('tickets.user_id', $user->id)
			->select('events.*', 'users.name','charities.title as charity_name','charities.logo','tickets.id as ticket_id','tickets.status as ticket_status','tickets.booking_fee','tickets.qty','tickets.final_amount')->get();
		
		
		return view('user.tickets.requested_ticket')->with(['approve_ticket'=>$approve_ticket,'unapprove_ticket'=>$unapprove_ticket]);
	}

	public function events_attending(Request $request, $id=0)
	{	
		$user = Auth::guard('user')->user();
		$events = User::leftJoin('events', 'users.id', '=', 'events.user_id')
			->leftJoin('tickets', 'tickets.event_id', '=', 'events.id')
			->leftJoin('charities', 'charities.id', '=', 'events.charity_id')			
			->where('events.event_date', '>=', date('m/d/Y'))
			->where('tickets.user_id', $user->id)
			->select('events.*', 'users.name','charities.title as charity_name','charities.logo','tickets.id as ticket_id','tickets.status as ticket_status')->get();
		//dd($events);
		return view('user.events.event-attending')->with('events',$events);
	}
	
	public function events_attended(Request $request, $id=0)
	{
		$user = Auth::guard('user')->user();
		$events = User::leftJoin('events', 'users.id', '=', 'events.user_id')
			->leftJoin('tickets', 'tickets.event_id', '=', 'events.id')
			->leftJoin('charities', 'charities.id', '=', 'events.charity_id')			
			->where('events.event_date', '<', date('m/d/Y'))
			->where('tickets.user_id', $user->id)
			->select('events.*', 'users.name','charities.title as charity_name','charities.logo','tickets.id as ticket_id','tickets.status as ticket_status')->get();
		//dd($events);
		return view('user.events.event-attended')->with('events',$events);
	}
	
	public function events_following(Request $request, $id=0)
	{
		$login_user = Auth::guard('user')->user();
		$users = array();
        $userList = followed_users::where('follower_id',Auth::guard('user')->user()->id)->get();
        foreach($userList as $item)
		{
            $users[] = $item->followed_id;
        }
		
        $followed_events = events::leftJoin('users','users.id','=','events.user_id')
                ->leftJoin('charities','charities.id','=','events.charity_id')
                ->whereIn('events.user_id',$users)
                ->where('events.event_date','>=',date('m/d/Y'))
                ->where([
                    'users.is_disabled'=>0,
                    'events.status'=>1
                    ])
                ->select('users.name','users.last_name','users.dob','events.*','charities.*')
                ->get();
		
		//dd($followed_events);
		return view('user.events.event_following')->with('events',$followed_events);
	}
	
	//**************Contact Us**************\\
	public function contact()
	{
		return view('staticpage.contact');
	}
	
	public function contactus(Request $request)
	{
		$name=$request->input('name');
		$email=$request->input('email');
		$number=$request->input('number');
		$message=$request->input('message');
		
		contact::insert(['name'=>$name, 'email'=>$email, 'number'=>$number, 'message'=>$message, 'status'=>'']);
		return redirect('/contact')->withInput()->with('success', 'We have received your message ');
	}
	
	public function contactlist(Request $request)
	{
		$contact = contact::get()->sortByDesc('id');
		return view('admin.contactus.listing')->with(['contact'=>$contact]);
	}
	
	public function deletecontact($id)
	{
		contact::where('id', $id)->delete();
		return redirect('admin/contactus')->with(['success'=>'Contact Successfuly Deleted']);	
	}
	//**************End Contact Us**************\\
  
	//**************About Us**************\\
	public function aboutus()
	{
		$about_us = Cms::where('id','=',1)->first();
		
		//dd($about_us);
		return view('staticpage.about-us')->with('about',$about_us);
	}
	
	public function index()
	{
		$country = Country::get();
		$about_us = Cms::where('id','=',1)->first();

	    return view('staticpage.about-us')->with(['country_list'=>$country,'about'=>$about_us]);
	}
	
	public function transactionHistory(Request $request)
	{
		$login_user = Auth::guard('user')->user();
			
		$guest_transaction = DB::table('transactions')
							->leftJoin('tickets','transactions.user_id','tickets.user_id')
							->leftJoin('events','events.id','tickets.event_id')							
							//->join('tickets','transactions.user_id','tickets.user_id')
							->where([
										'transactions.user_id'=>$login_user->id,
										'transactions.status'=>'COMPLETED',
										//'tickets.transaction_id'=>'transactions.id',
									])
							->select('tickets.*','events.title as event_title','transactions.status as tr_status','transactions.transaction_id as tr_id','transactions.updated_at as tr_date')->get();
		//dd($guest_transaction);
			
		$host_transaction = DB::table('transactions')
							->leftJoin('tickets','transactions.user_id','tickets.user_id')
							->leftJoin('events','events.id','tickets.event_id')
							->where('events.event_date','<=', date('m/d/Y', strtotime("+3 day")))
							->where([
										'events.user_id' =>$login_user->id,
										'transactions.status'=>'COMPLETED',
									])
							->select('tickets.*','events.title as event_title','events.user_id as host_id','transactions.status as tr_status','transactions.transaction_id as tr_id','transactions.updated_at as tr_date')->get();
		
		//echo date('m/d/Y', strtotime("+3 day")); 
		//dd($host_transaction);
		return view('user.account.transactions-history')->with(['guest_transaction'=>$guest_transaction,'host_transaction'=>$host_transaction,]);
	}
	
	public function closeAccount(Request $request)
	{
		$login_user = Auth::guard('user')->user();
		$cancel_account = accountClose::where(['user_id'=>$login_user->id,])->first();
		if($request->isMethod('post')) 
		{
			if(count($cancel_account)==0)
			{	
				$data = $request->all();
				if(isset($data['cancel_myaccount']))
				{
					unset($data['cancel_myaccount']);
					unset($data['_token']);
					$data['why_close'] = json_encode($data['why_close']);
					$data['user_id'] = $login_user->id;
					$data['status'] = 0;
					$data['created_at'] = date('Y-m-d h:i:s');
					accountClose::insert($data);
					return redirect('user/close_account')->with(['success'=>'close account request submitted']);
				}
			}
		}
		$login_user = Auth::guard('user')->user();
		return view('user.account.close-account')->with(['cancel_account'=>$cancel_account]);
	}
	
	/* start approve cancel tickets */
		public function approveTicket(Request $request)
		{
			if(isset($_POST['ticket_id']))
			{	
				$ticket_id = $_POST['ticket_id'];
				$ins_data['status'] =  'approve';
				tickets::where('id',$ticket_id)->update($ins_data);
			}
		}
		
		public function cancelTicket(Request $request)
		{
			if(isset($_POST['ticket_id']))
			{
				$ticket_id = $_POST['ticket_id'];
				$ins_data['cancel'] = 'yes';
				tickets::where('id',$ticket_id)->update($ins_data);
			}	
		}
	/* end approve cancel tickets */
 
	
	
}
