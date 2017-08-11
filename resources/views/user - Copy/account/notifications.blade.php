@extends('user.layout.fronLayout')
@section('content')
     <div class="middle-content account-section">
	<div class="container">
		<div class="row clearfix">
			<aside class="col-md-2 left-sidebar">
				<div class="sidenav-list">
					<ul>
						<li class="{{ (request()->segment(2)=='notifications')?'active':'' }}"><a href="{{Request::root()}}/user/notifications">Your Notifications</a></li>
						<li class="{{ (request()->segment(2)=='my_account')?'active':'' }}"><a href="{{Request::root()}}/user/my_account">Notifications Settings</a></li>
						<li class="{{ (request()->segment(2)=='host_verification')?'active':'' }}"><a href="{{Request::root()}}/user/host_verification">Verify Me</a></li>
						<li class="{{ (request()->segment(2)=='payment_method')?'active':'' }}"><a href="{{Request::root()}}/user/payment_method">Payment Methods</a></li>
						<li class="{{ (request()->segment(2)=='security')?'active':'' }}"><a href="{{Request::root()}}/user/security">Security</a></li>
						<li class=""><a href="#">Privacy Settings</a></li>
						<li class=""><a href="#">Close Account</a></li>
						<li class=""><a href="#">Transaction History</a></li>
					</ul>
				</div>
			</aside>
			<article class="col-md-10 main-right all-notification">
				<h2>Your Notifications</h2>
				<ul>
					@foreach($notifications as $notification)
					<?php $user_images =  DB::table('userimages')->where('user_id',$notification->another_user)->first(); ?>
					<li>
						<div class="img">
							<div class="circle-img"></div>
							<?php if(count($user_images)>0){ ?>
								<img src="{{Request::root()}}/assets/admin/uploads/users/{{ $user_images->image }}" alt="" />
							<?php }else{ ?>
								<img src="{{Request::root()}}/assets/front/img/avatar.jpg" alt="" />
							<?php } ?>							
						</div>
						<div class="text">
							<h5><?php echo $notification->notification ?></h5>
							<p><em>3 hours ago</em></p>
						</div>
					</li>
					@endforeach
				</ul>
			</article>
		</div>
	</div>
</div>
 @endsection('content')