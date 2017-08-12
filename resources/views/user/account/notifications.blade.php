@extends('user.layout.fronLayout')
@section('content')
    <div class="middle-content account-section">
	<div class="container">
		<div class="row clearfix">
			@include('user.layout.sidebar')
			<article class="col-md-9 main-right all-notification">
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