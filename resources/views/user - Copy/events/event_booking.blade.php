<?php  //echo Request::fullUrl(); ?>
@extends('user.layout.fronLayout')
@section('content')
<div class="middle-content account-section dinnerhost-party">
    <div class="container">
        <div class="row">
            <aside class="col-md-2 left-sidebar">
                <div class="sidenav-list">
                    <ul>
                        <li class=''><a href='{{Request::root()}}/user/your_hosting'>Host New Event</a></li>
                        <li class=''><a href='{{Request::root()}}/user/my_active_event'>Your Active Events</a></li>
                        <li class=''><a href='{{Request::root()}}/user/my_ended_event'>Your Ended Events</a></li>
                        <li class=''><a href='#'>Verify Me As A Host</a></li>
                        <li class=''><a href='{{Request::root()}}/user/invite_friends'>Invite Users</a></li>
                    </ul>
                </div>
            </aside>
            <div class="col-md-6 col-sm-12">
				<h2>{{ $event->title }}</h2>
				<ul class="date">
					<li>Date: <?php echo date('d F Y',strtotime($event->event_date)); ?></li>
					<li>Time: {{ $event->start_time }} to {{ $event->end_time }}</li>
					<li><span>Where <a href="#" data-toggle="tooltip" data-placement="bottom" title="Only guests who purchase tickets will receive these details"><i class="fa fa-question-circle" aria-hidden="true"></i></a>:</span> <span class="addre-s">{{ $event->street }}, {{ $event->city	}}, {{ $event->country }}</span></li>
					<li>Tickets: £{{ $event->ticket_price+6.25 }} each (£ {{ $event->ticket_price }} ticket price + £6.25 booking fee)</li>
					<li>Availability: 0/{{ $event->max_guests }} Sold</li>
					<li>Requiement: This event requires a minimum of <strong>1 ticket sold</strong> to proceed</li>
					<li>Viewed: 52 times</li>
				</ul>
				<div class="event-o host-d">
					<h3>Host Details</h3>
					<a href="#\">
						<div class="media">
							<div class="media-body">
								<p><strong>{{ $event->user_name }}, aged {{ (date('Y') - date('Y',strtotime($event->dob))) }}</strong></p>
								<p>{{ $event->user_town }}, {{ $event->user_country }}</p>
							</div>
							<div class="media-left">
								<div class="inner">
									<div class="circle-img"></div>
									<img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="">
								</div>
								<div class="align-center">
									<div class="rateYo4"></div>
									<span class="re-view">(17)</span>
								</div>	
							</div>
						</div>
					</a>
				</div>
				<div class="event-o">
					<h3>Event Description</h3>
					<p>{{ $event->description }}</p>
					<div class="row">
						<ul>
							<li>
								<div class="col-md-4">
									<h4>Age Range:</h4>
									<p>{{ (!empty($event->min_age))?$event->min_age:'Don’t Mind' }} - {{ (!empty($event->max_age))?$event->max_age:'Don’t Mind' }}</p>
								</div>
								<div class="col-md-4">
									<h4>Open To:</h4>
									<p>{{ $event->open_to }}</p>
								</div>
								<div class="col-md-4">
									<h4>Gender:</h4>
									<p>{{ $event->guest_gender }}</p>
								</div>
							</li>
							<li>
								<div class="col-md-4">
									<h4> Drink Preference:</h4>
									<p>{{ (!empty($event->drink_preferences))?$event->drink_preferences:'Don’t Mind' }}</p>
								</div>
								<div class="col-md-4">
									<h4>Own Drinks:</h4>
									<p>{{ (!empty($event->own_drinks))?$event->own_drinks:'Don’t Mind' }}</p>
								</div>
								<div class="col-md-4">
									<h4>Drinks Included:</h4>
									<p>{{ (!empty($event->drinks_included))?$event->drinks_included:'Don’t Mind' }}</p>
								</div>
							</li>
							<li>
								<div class="col-md-4">
									<h4>Food Included:</h4>
									<p>{{ (!empty($event->food_included))?$event->food_included:'Don’t Mind' }}</p>
								</div>
								<div class="col-md-4">
									<h4>Food Type:</h4>
									<p>{{ (!empty($event->food_type))?$event->food_type:'Don’t Mind' }}</p>
								</div>
								<div class="col-md-4">
									<h4>Food And Drinks:</h4>
									<p>
										<?php if(!empty($event->food_drink_type)){ echo implode(", ",json_decode($event->food_drink_type)); }	?>
									</p>
								</div>
							</li>
							<li>
								<div class="col-md-4">
									<h4>Dress Code:</h4>
									<p>{{ (!empty($event->dress_code))?$event->dress_code:'Don’t Mind' }}</p>
								</div>
								<div class="col-md-4">
									<h4>Setting:</h4>
									<p>{{ (!empty($event->setting))?$event->setting:'Don’t Mind' }}</p>
								</div>
								<div class="col-md-4">
									<h4>Seating:</h4>
									<p>{{ (!empty($event->seating))?$event->seating:'Don’t Mind' }}</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="event-o parti">
					<h3>Participants</h3>
					<p>There are currently 0 participants :(</p>
				</div>
				<div class="event-o ab-charity">
					<h3>About The Charity</h3>
					<div class="media">
						<div class="media-left">
							<div class="inner">
								<img src="{{Request::root()}}/assets/admin/uploads/charity/{{ $event->logo }}" alt="" />
							</div>
						</div>
						<div class="media-body">							
							<p>{{ $event->charity_description }}</p>
						</div>
					</div>
				</div>
			</div>
            <div class="col-md-4 col-sm-12">
				<div class="dinner-hostright">
					<header><span>0/{{ $event->max_guests }}</span> participants</header>
					<div class="con-gratulation">
						<h3>Cool! You are one step away from this event!</h3>
						<?php if(count($event_booked)==0){ ?>	
							<button class="btn2 btn-block" id="request_for_ticket">Request Tickets</button>
						<?php } else{ ?>
							<button class="grey-btn btn-block">Already booked</button>
						<?php } ?>
					</div>
					<footer>
						<div class="media">
							<div class="media-left">
								<div class="inner">
									<img src="{{Request::root()}}/assets/admin/uploads/charity/{{ $event->logo }}" class="media-object" />
								</div>
							</div>
							<div class="media-body">
								<p>{{ $event->charity_cut }}% of ticket price will go to {{ $event->charity_name }}</p>
							</div>
						</div>
					</footer>
				</div>
				<div class="dinner-hostright invite-your">					
					<header class="mr0 solid-bg">SHARE YOUR EVENT WITH FRIENDS</header>
					<div class="con-gratulation">
						<ul>
							<li><a href="#\" onClick="window.open('http://www.facebook.com/sharer.php?u=<?php echo Request::fullUrl(); ?>&title={{ $event->title }}','sharer', 'toolbar=0,status=0,width=548,height=325');"><i class="fa fa-facebook-square" aria-hidden="true"></i></a></li>
							<li><a href="#\" onClick="window.open('https://twitter.com/share?url=<?php echo Request::fullUrl(); ?>&amp;text=<?php echo $event->description; ?>','sharer', 'toolbar=0,status=0,width=548,height=325');"><i class="fa fa-twitter-square" aria-hidden="true"></i></i></a></li>
							<li><a href="mailto:?Subject={{ $event->title }}&amp;Body={{ $event->description }} {{ Request::fullUrl() }} ');"><i class="fa fa-envelope-square" aria-hidden="true"></i></a></li>
						</ul>						
					</div>
				</div>
			</div>
        </div>
    </div>
</div>

<form method="post" id="request_ticket_form">
	<input type="hidden" name="_token" value="{{ csrf_token() }}">
	<input type="hidden" name="event_id" value="{{ $event->id }}">
	<input type="hidden" name="user_id" value="{{ Auth::guard('user')->user()->id }}">
	<input type="hidden" name="ticket_price" value="{{ $event->ticket_price+6.25 }}">
	<input type="hidden" name="charity_id" value="{{ $event->charity_id }}">
	<input type="hidden" name="charity_cut" value="{{ $event->ticket_price*($event->charity_cut/100) }}">	
</form>

<script>
$(document).ready(function(){
	$('#request_for_ticket').click(function(){
		
		var form_data = $("#request_ticket_form");
		
		$.ajax({
			url: '{{ url('/user/request_for_tickets') }}',
			type: 'POST',
			data : form_data.serialize(),
			cache: false,
			 beforeSend: function() {
				$('#request_for_ticket').html('please wait ...');
			 },
			success: function(data)
			{
				$('#request_for_ticket').html('Ticket booked');
				//console.log(data);
			},
			error: function(xhr, ajaxOptions, thrownError)
			{
				alert(xhr.status);
			},	
		});	
		
	});	
});	

$(function () {
		$(".rateYo4").rateYo({
			starWidth: "11px",
			normalFill: "#484848",
			ratedFill: "#E85A00"
		});
	});
</script>
@endsection