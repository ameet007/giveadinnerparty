@extends('user.layout.fronLayout')
@section('content')
<link href="{{Request::root()}}/assets/front/css/bxslider.css" rel="stylesheet" type="text/css" />
<section class="middle-content account-section profile-edit public-pro">
	<div class="container">
		<div class="row per-details">
			<aside class="col-md-2 left-sidebar">
				<a class="btn2" href="#"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i>&nbsp; Back</a>
				<div class="sidenav-list">
					<ul>
						<li class=''><a href="{{ Request::root() }}/user/edit_profile">Edit Profile</a></li>
						<li class='active'><a href="#">Your Public Profile</a></li>
					</ul>
				</div>
			</aside>
			<div class="col-md-10">
				<div class="row">
					<div class="col-md-4">
						<div class="pro-pic">
							<div class="over-lay"></div>
							<?php if(count($user_images)>0){ ?>
								<img src="{{Request::root()}}/assets/admin/uploads/users/{{ $user_images[0]->image }}" alt="" />
							<?php }else{ ?>
								<img src="{{Request::root()}}/assets/front/img/avatar.jpg" alt="" />
							<?php } ?>
						</div>
						<div class="charity-f">
							<div id="rateYo2"></div><span class="re-view">(17)</span>
							<h3>£65,425</h3>
							<h5>Charity Funds Raised</h5>
						</div>
						<div class="panel-group">
							<div class="panel panel-default">
								<div class="panel-heading">Verified info</div>
								<div class="panel-body">
									<ul>
										<li class="clearfix"><span class="pull-left">Email Address</span> <span class="pull-right"><img src="{{Request::root()}}/assets/front/img/<?php echo ($user->confirmed=='1')?'right-singh.png':'close-singh.png'; ?>" alt=""></span></li>
										<li class="clearfix"><span class="pull-left">Facebook Linked</span> <span class="pull-right"><img src="{{Request::root()}}/assets/front/img/<?php echo ($user->confirmed=='1' && count($social_login)==1)?'right-singh.png':'close-singh.png'; ?>" alt=""></span></li>
										<li class="clearfix"><span class="pull-left">Phone Number</span> <span class="pull-right"><img src="{{Request::root()}}/assets/front/img/close-singh.png" alt=""></span></li>
										<li class="clearfix"><span class="pull-left">Payment Verified</span> <span class="pull-right"><img src="{{Request::root()}}/assets/front/img/<?php echo ($user->paypal_confirm=='1')?'right-singh.png':'close-singh.png'; ?>" alt=""></span></li>
										<li class="clearfix"><span class="pull-left">Government ID</span> <span class="pull-right"><img src="{{Request::root()}}/assets/front/img/<?php echo ($user->approve_id=='1')?'right-singh.png':'close-singh.png'; ?>" alt=""></span></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-8">
						<div class="per-details-right">
							<h2>Hello. I’m {{ $user->name.' '.$user->last_name }}</h2>
							<h3>{{ $user->town }}, {{ $user->country }}. Joined {{date('F Y', strtotime($user->created_at))}}</h3>
							<ul class="age">
								<li><p><strong>Age:</strong> <?php echo (date('Y') - date('Y',strtotime($user->dob))); ?></p></li>
								<li><p><strong>Gender:</strong> {{ $user->gender }}</p></li>
								<li><p><i class="fa fa-flag-o" aria-hidden="true"></i> {{ $user->postcode }}</li>
							</ul>
							<p><strong class="btn-block">Biography:</strong> {{ $user->about }}</p>
							<ul class="age">
								<li><p><strong>Spoken Languages:</strong> <?php if(!empty($user->spoken_languages)){ 	echo implode(", ",json_decode($user->spoken_languages)); } ?></p></li>
								<li><p><strong>Ethnicity:</strong> {{ $user->ethnicity }}</p></li>
							</ul>
							<p><strong>Interests:</strong> <?php if(!empty($user->hobbies)){ 	echo implode(", ",json_decode($user->hobbies)); } ?></p>
							<ul class="age">
								<li><p><strong>Education:</strong> {{ (!empty($user->education))?$user->education:'Not specified' }}</p></li>
								<li><p><strong>Profession:</strong>{{ (!empty($user->profession))?$user->profession:'Not specified' }}</p></li>
							</ul>
							<ul class="age">
								<li><p><strong>Status:</strong>{{ (!empty($user->status))?$user->status:'Not specified' }}</p></li>
								<li><p><strong>Sexuality:</strong>{{ (!empty($user->sexuality))?$user->sexuality:'Not specified' }}</p></li>
							</ul>
							<p><strong>Religion:</strong> {{ (!empty($user->religion))?$user->religion:'Not specified' }}</p>
							<p><strong>Listed Events:</strong> <em>either ‘none’ or the ‘event card(s)’</em></p>
							<?php if(count($user_images)>0){ ?>
							<p class="mar-b-10"><strong>Gallery</strong></p>
							<div class="gall-ery">
								<ul class="bxslider">
									@foreach($user_images as $images)
									<li><a href="#"><img src="{{Request::root()}}/assets/admin/uploads/users/{{ $images->image }}" alt="" /></a></li>
									@endforeach
								</ul>
							</div>
							<?php } ?>
						</div>
					</div>
				</div>
				<div class="dinner-parties">
					<div class="main-heading">
						<h2>Your Hosting</h2>
					</div>
					<div class="row">
						
						@foreach($user_events as $event)
						<div class="col-md-4">			
							<div class="item">
								<div class="parties-wrap">
									<div class="parties-head">
										<h3><a href="#">{{ $event->title }}</a></h3>
										<p>{{ $event->description }}</p> 
										<p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>{{ $event->ticket_price }} + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="">80.00</a></span> booking fee</p>
										<div class="event-mf">
											<i class="fa <?php if($event->guest_gender=='Men Only'){echo 'fa-male'; }elseif($event->guest_gender=='Ladies only'){ echo 'fa-female'; }elseif($event->guest_gender=='Singles only'){echo "fa-user"; } ?>" aria-hidden="true"></i>
											<p>{{ $event->guest_gender }}</p>
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
												<p>Hosted By: <strong>{{ $event->name.' '.$event->last_name }}</strong></p>
												<p>Aged: <strong>{{ $event->min_age }} - {{$event->max_age }}</strong></p>
												<p>Friday {{ $event->event_date }}</p>
												<p>{{ $event->start_time }} - {{$event->end_time }}</p>
												<p>{{ $event->street }}, {{ $event->city }}, {{ $event->county }}</p>
											</div>	
										</div>
										<div class="hosted-by parties-foot">
											<div class="img">
												<div class="inner">
													<img src="{{Request::root()}}/assets/front/img/host-logo1.png" alt="" />
												</div>
											</div>
											<div class="content">
												<p><strong>{{ $event->charity_cut }}</strong> of ticket price will go to Action Against Hunger</p>
											</div>	
										</div>
									</div>
								</div>
							</div>
						</div>
					@endforeach	
					</div>
				</div>
				<div class="my-events">
					<div id="tabs">
						<ul>
							<li><a href="#tabs-1">as a Guest</a></li>
							<li><a href="#tabs-2">as a Host</a></li>
						</ul>
						<div id="tabs-1">
							<div class="sheng-reviews">
								<h2>4 Reviews</h2>
								<a class="btn2" href="#">Leave Sheng A Review</a>
								<ul>
									<li>
										<div class="media">
											<div class="media-left">
												<div class="inner">
													<div class="circle-img"></div>
													<div class="img">
														<img src="{{Request::root()}}/assets/front/img/pro-pic.jpg" alt="">
													</div>
												</div>
												<div class="align-center">
													<p>Khairul</p>
													<div class="rateYo4"></div>
													<span class="re-view">(17)</span>
												</div>
											</div>
											<div class="media-body">
												<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
												<div class="essex-from clearfix">
													<div class="pull-left">
														<h4>August 2017 <span><i class="fa fa-flag-o" aria-hidden="true"></i></span></h4>
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
						</div>
						<div id="tabs-2">
							<div class="sheng-reviews">
								<h2>1 Reviews</h2>
								<a class="btn2" href="#">Leave Sheng A Review</a>
								<ul>
									<li>
										<div class="media">
											<div class="media-left">
												<div class="inner">
													<div class="circle-img"></div>
													<div class="img">
														<img src="{{Request::root()}}/assets/front/img/pro-pic.jpg" alt="">
													</div>
												</div>
												<div class="align-center">
													<p>Khairul</p>
													<div class="rateYo4"></div>
													<span class="re-view">(17)</span>
												</div>
											</div>
											<div class="media-body">
												<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
												<div class="essex-from clearfix">
													<div class="pull-left">
														<h4>August 2017 <span><i class="fa fa-flag-o" aria-hidden="true"></i></span></h4>
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
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
<script>
$( document ).ready(function() {
	$('#reviewbtn').click(function(){
		$('#review_box').slideToggle('slow');
	});
	$('#myform').parsley();
	
	$(function () {
		$("#rateYo2").rateYo({
			starWidth: "25px",
			normalFill: "#484848",
			ratedFill: "#E85A00",
			rating: 4.0
		});
	});
	
	$('.bxslider').bxSlider({
		default: 'Next',
		default: 'Prev',
		//pager: false
	});
	
	$( "#tabs" ).tabs();

});
</script>
@endsection