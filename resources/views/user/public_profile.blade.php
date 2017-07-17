@extends('user.layout.fronLayout')
@section('content')
<section class="middle-content profile-edit public-pro">
	<div class="container">
		<div class="row per-details">
			<div class="col-md-3">
				<div class="pro-pic">
					<div class="over-lay"></div>
					<img src="{{Request::root()}}/assets/front/img/pro-pic.jpg" alt="" />
				</div>
				<div class="charity-f">
					<h3>$65,425</h3>
					<h5>Charity Funds Raised</h5>
					<img src="{{Request::root()}}/assets/front/img/start.png"/>
					<div>
						<p><img src="{{Request::root()}}/assets/front/img/<?php echo ($user->confirmed=='1')?'tick.png':'cross.png'; ?>" width="15" height="15" /> <b>Email</b>  </p>
						<p><img src="{{Request::root()}}/assets/front/img/<?php echo ($user->approve_id=='1')?'tick.png':'cross.png'; ?>" width="15" height="15" /> <b>ID Proof</b>  </p>
						<p><img src="{{Request::root()}}/assets/front/img/<?php echo ($user->paypal_confirm=='1')?'tick.png':'cross.png'; ?>" width="15" height="15" /> <b>Paypal Account</b></p>
						<p><img src="{{Request::root()}}/assets/front/img/<?php echo ($user->confirmed=='1' && count($social_login)==1)?'tick.png':'cross.png'; ?>" width="15" height="15" /> <b>Facebook Profile</b> </p>
					</div>
				</div>
			</div>
			<div class="col-md-9">
				<div class="per-details-right">
					<h2>Hello. I’m {{ $user->name.' '.$user->last_name }},</h2>
					<h3>{{ $user->town }}, {{ $user->country }}. Joined {{date('F Y', strtotime($user->created_at))}}</h3> 
					<p><i class="fa fa-flag-o" aria-hidden="true"></i> Report User</p>
					<ul class="age">
						<li><p><strong>Age:</strong> <?php echo (date('Y') - date('Y',strtotime($user->dob))); ?></p></li>
						<li><p><strong>Gender:</strong> {{ $user->gender }}</p></li>
						<li><p><strong>Post Code:</strong> {{ $user->postcode }}</p></li>
					</ul>
					<p><strong class="btn-block">Spoken Language:</strong> 
						<?php if(!empty($user->spoken_languages)){ 	echo implode(", ",json_decode($user->spoken_languages)); }						?>
					</p>
					<p>
						<strong class="btn-block">Hobbies & Interest:</strong>
						<?php 
						if(!empty($user->hobbies)){ 
						$intrest_array = json_decode($user->hobbies);					
						foreach($intrest_array as $intrest){
						?>
							<a href="#"><?php echo $intrest; ?></a>
						<?php }} ?>						
					</p>
					<p><strong class="btn-block">Biography:</strong> {{ $user->about }}</p>
				</div>
			</div>
		</div>
	</div>
	<div class="container dinner-parties">
		<div class="main-heading">
			<h2>Upcoming Events</h2>
			<span><a href="#">(See All)</a></span>
		</div>
		<div class="owl-carousel owl-theme">
		@foreach($upcoming_events as $event)
			<div class="item">
				<div class="parties-wrap">
					<div class="parties-head">
						<h3><a href="#">{{ $event->title }}</a></h3>
						<p>{{ $event->description }}</p> 
						<p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>{{ $event->ticket_price }} + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="">80.00</a></span> booking fee</p>
						<div class="event-mf">
							<i class="fa fa-male" aria-hidden="true"></i>
							<p>Men only</p>
						</div>
					</div>
					<div class="parties-host">
						<div class="hosted-by">
							<div class="img">
								<div class="heart-dil">
									<a class="follow-ing" href="#/">Follow</a>
								</div>
								<div class="inner">
									<div class="circle-img"></div>
									<img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="" />
								</div>
								<div class="rateyo-readonly-widg"></div>
							</div>
							<div class="content">
								<p>Hosted By: <strong>Khairul P.</strong></p>
								<p>Aged: <strong>24</strong></p>
								<p>Friday 05/05/2017</p>
								<p>9.00pm - 12.00am</p>
								<p>Bukit Tunku, KL</p>
							</div>	
						</div>
						<div class="hosted-by parties-foot">
							<div class="img">
								<div class="inner">
									<img src="{{Request::root()}}/assets/front/img/host-logo1.png" alt="" />
								</div>
							</div>
							<div class="content">
								<p><strong>100%</strong> of ticket price will go to Action Against Hunger</p>
							</div>	
						</div>
					</div>
				</div>
			</div>
		@endforeach			
		</div>
	</div>
	<div class="container sheng-reviews">
		<h2>Sheng has 7 Reviews</h2>
		<button class="btn2" id="reviewbtn">Leave Sheng A Review</button>		
		<ul>
			<li style="display:none" id="review_box">
				<div class="media">
					<h3>Leave a Review</h3>
					<form method="post" action="{{Request::root()}}/user/public_profile">
						<input type="hidden" value="{{csrf_token()}}" name="_token" >
						<textarea name="comment" class="form-control"></textarea><br>
						<button type="submit" class="grey-btn pull-right" >Post Review</button>
					</form>
				</div>
			</li>
		
			<li>
				<div class="media">
					<div class="media-left">
						<div class="inner">
							<img src="{{Request::root()}}/assets/front/img/review-pic.png" class="media-object" />
							<p>Khairul</p>
							<img width="80px" src="{{Request::root()}}/assets/front/img/start.png" alt="" />
						</div>
					</div>
					<div class="media-body">
						<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
						<div class="essex-from clearfix">
							<div class="pull-left">
								<h4>From Essex, UK</h4>
							</div>
							<div class="pull-right">
								<a href="#">Jonathan’s Chess Party</a>
							</div>
						</div>
					</div>
				</div>
			</li>
			
			
			
		</ul>
	</div>
</section>
<script>
$( document ).ready(function() {
	$('#reviewbtn').click(function(){
		$('#review_box').slideToggle('slow');
	});
});
</script>
@endsection