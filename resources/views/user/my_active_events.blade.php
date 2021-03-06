@extends('user.layout.fronLayout')
@section('content')
@if(Session::get('success')!='')
<div class="alert alert-success">
    {{Session::get('success')}}
</div>
@endif
@if(Session::get('error')!='')
<div class="alert alert-danger">
    {{Session::get('error')}}
</div>
@endif
<section class="middle-content account-section my-events pending-req">
    <div class="container">
        <div class="row clearfix">
            <aside class="col-md-2 left-sidebar">
                <div class="sidenav-list">
                    @include('user.layout.host-sidebar')
                </div>
            </aside>
			
			<div class="col-md-10">
				<div class="dinner-parties">
					<div class="main-heading">
						<h2>Awaiting Approval Decision</h2>
					</div>
					@foreach($awaiting_events as $wait_event)
					<?php //$ticket_data = DB::select("select * from tickets where event_id='$wait_event->event_id'"); ?>
					
					<?php $tickets_data = DB::table('tickets')
					->join('users', 'users.id', '=', 'tickets.user_id')
					->where('tickets.event_id','=',$wait_event->id)
					->select('tickets.*','users.name as first_name','users.last_name','users.dob as user_dob')->get() ?>
					<?php if(count($tickets_data)>0){ ?>
					
					<div class="col-xs-12">
						<h4 class="mr20">{{ date('d, F Y',strtotime($wait_event->event_date)) }}<br/>{{$wait_event->title}}</h4>
						<div class="owl-carousel owl-theme">
						@foreach($tickets_data as $ticket)
						{{ $dob = date('Y')-date('Y',strtotime($ticket->user_dob)) }}
							<div class="item">
								<div class="parties-wrap">
									<div class="parties-head">
										<div class="event-mf">
											<i class="fa fa-male" aria-hidden="true"></i>
											<p>Men only</p>
										</div>
									</div>
									<div class="parties-host">
										<div class="hosted-by">
											<div class="content">
												<strong>{{$ticket->first_name.' '.$ticket->last_name}},</strong>
												<span>Aged: <strong>{{$dob}}</strong></>
												<p>Bukit Tunku, KL</p>
												<div class="img">
													<div class="inner">
														<div class="circle-img"></div>
														<img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="" />
													</div>
													<div class="rateYo3"></div><span class="re-view">(17)</span>
												</div>
												<p><strong>Number of tickets requested:</strong> {{$ticket->qty}}</p>
												<p><strong>Dietary (or other) restrictions:</strong>  Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
												<div class="tow-btn">
													<button class="btn2 accep-t" id="act{{$ticket->id}}" onclick="return approve_ticket({{$ticket->id}})">Accept</button>
													<button class="grey-btn rejec-t" id="cancel{{$ticket->id}}" onclick="return cancel_ticket({{$ticket->id}})">Reject</button>
													<button data-toggle="modal" data-target="#myModal" class="btn2">Message</button>
												</div>
											</div>	
										</div>
									</div>
								</div>
							</div>
							@endforeach
						</div>
					</div>
					<?php } ?>
					@endforeach
				</div>
			</div>
			
            
        </div>
    </div>
</section>



<div class="dinner-parties">
	<div class="container">
		<div class="col-md-10 col-md-offset-2">
                    <div class="main-heading">
                        <h2>Your Active Events</h2>
                    </div>
                    <div class="row">
						@foreach($events as $event)
					    
                        <div class="col-md-4">
                            <div class="item">
								<div class="parties-wrap">
									<div class="parties-head">
										<h3><a href="{{Request::root()}}/user/event/host/{{$event->id}}">{{ $event->title }}</a></h3>
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

												<div class="inner">
													<div class="circle-img"></div>
													<img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="" />
												</div>
												<div class="align-center">
													<div class="rateYo1"></div>
													<span class="re-view">(17)</span>
												</div>
											</div>
											<div  class="content">
												<p>Hosted By: <strong>{{ $event->name.' '.$event->last_name }}</strong></p>
												<p>Aged: <strong>{{ $event->min_age }} - {{$event->max_age }}</strong></p>
												<p>Friday {{ $event->event_date }}</p>
												<p>{{ $event->start_time }} - {{$event->end_time }}</p>
												<p>{{ $event->street }}, {{ $event->city }}, {{ $event->county }}</p>
											</div>	
										</div>
										<?php $charity = DB::select( DB::raw("SELECT * FROM charities WHERE id ='$event->charity_id'") ); ?>
										<div class="hosted-by parties-foot">
											<div class="img">
												<div class="inner">
													<img src="{{Request::root()}}/assets/admin/uploads/charity/{{ $charity[0]->logo }}" alt="" />
												</div>
											</div>
											<div class="content">
												<p><strong>{{ $event->charity_cut }}%</strong> of ticket price (<i class="fa fa-gbp" aria-hidden="true"></i>{{ ($event->ticket_price*$event->charity_cut)/100 }}) will go to {{ $charity[0]->title }}</p>
											</div>	
										</div>
									</div>
								</div>
							</div>
                        </div>
						@endforeach 
                       
                    </div>
                </div>
            </div>
			</div>
<script>
    $("#tabs").tabs();
    $(function () {
		$(".rateYo1").rateYo({
			starWidth: "11px",
			normalFill: "#484848",
			ratedFill: "#fff"
		});
	});
    $('.search-panel .dropdown-menu').find('a').click(function (e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#", "");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
    });
	
	function approve_ticket(TICKET_ID)
	{		
		//alert(TICKET_ID);
		$.ajax({
			url: '<?php echo url('/user/approve_tickets'); ?>',
			type:'post',
			data: {'_token':'{{csrf_token()}}','ticket_id':TICKET_ID },	
			success: function(responseData)
			{
				$('#act'+TICKET_ID).html('Accepted');
			}
		});
	}
	
	function cancel_ticket(TICKET_ID)
	{		
		//alert(TICKET_ID);
		$.ajax({
			url: '<?php echo url('/user/cancel_tickets'); ?>',
			type:'post',
			data: {'_token':'{{csrf_token()}}','ticket_id':TICKET_ID },	
			success: function(responseData)
			{
				$('#cancel'+TICKET_ID).html('Accepted');
			}
		});
	}
	
</script>
@endsection('content')