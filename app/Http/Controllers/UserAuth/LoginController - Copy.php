<?php

namespace App\Http\Controllers\UserAuth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;
use Hesto\MultiAuth\Traits\LogsoutGuard;
use Socialite;
use App\User;
use App\social_logins;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Password;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers, LogsoutGuard {
        LogsoutGuard::logout insteadof AuthenticatesUsers;
    }

    /**
     * Where to redirect users after login / registration.
     *
     * @var string
     */
    public $redirectTo = '/user/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('user.guest', ['except' => 'logout']);
    }

    /**
     * Show the application's login form.
     *
     * @return \Illuminate\Http\Response
     */
    public function showLoginForm()
    {
        return view('user.auth.login');
    }
    
    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return Response
     */
    public function redirectToProvider()
    {
        return Socialite::driver('facebook')->redirect();
    }

    /**
     * Obtain the user information from GitHub.
     *
     * @return Response
     */
    public function handleProviderCallback()
    {
        $user = Socialite::driver('facebook')->user();
        $verify_status = $user->user['verified'];
        if($verify_status == 1){
            $existing = User::leftJoin('social_logins','users.id','=','social_logins.user_id')
            ->select('users.*','social_logins.*')
            ->where('users.email','=',$user->user['email'])
            ->first();
            if(count($existing) > 0 && $existing->facebook_id == ''){
                if($existing->confirmed == 1){
                    $data['user_id'] = $existing->id;
                    $data['facebook_id'] = $user->user['id'];
                    $data['facebook_link'] = $user->user['link'];
                    social_logins::insert($data);
                    $authUser = User::where('id',$existing->id)->first();
					Auth::guard('user')->login($authUser);
					return redirect('/user/home');
                }
                else{
                    User::where('id',$existing->id)->update(['confirmed'=>1]);
                    $data['user_id'] = $existing->id;
                    $data['facebook_id'] = $user->user['id'];
                    $data['facebook_link'] = $user->user['link'];
                    social_logins::insert($data);
                    $authUser = User::where('id',$existing->id)->first();
					Auth::guard('user')->login($authUser);
					return redirect('/user/home');
                }
            }
            else if(count($existing) > 0 && $existing->facebook_id != ''){
                if($existing->confirmed == 1){
                    $authUser = User::where('id',$existing->id)->first();
					Auth::guard('user')->login($authUser);
					return redirect('/user/home');
                }
                else{
                    User::where('id',$existing->id)->update(['confirmed'=>1]);
                    $authUser = User::where('id',$existing->id)->first();
					Auth::guard('user')->login($authUser);
					return redirect('/user/home');
                }
            }
            else{
                $data['name'] = $user->user['name'];
                $data['email'] = $user->user['email'];
                $password = rand(10000,999999);
                $data['password'] = bcrypt($password);
                $data['photos'] = $user->avatar_original;
                if($user->user['gender'] == 'male'){
                    $data['gender'] = 'Male';
                }
                else{
                    $data['gender'] = 'Female';
                }
                $data['is_disabled'] = 0;
                $data['confirmed'] = 1;
                $user_id = User::create($data)->id;
                unset($data);
                $data['user_id'] = $user_id;
                $data['facebook_id'] = $user->user['id'];
                $data['facebook_link'] = $user->user['link'];
                social_logins::insert($data);
                $authUser = User::where('id',$user_id)->first();
                Auth::guard('user')->login($authUser);
                return redirect('/user/home');
            }
        }
        else{
            return redirect('/')->with([
                'error'=>'Your facebook email is not verified. Please verify to proceed',
            ]);
        }

        // $user->token;
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\StatefulGuard
     */
    protected function guard()
    {
        return Auth::guard('user');
    }
}
