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
<div class="middle-content account-section tickets-req">
    <div class="container">
        <div class="row clearfix">
            <aside class="col-md-2 left-sidebar">
                <div class="sidenav-list">
                    @include('user.layout.event-sidebar')
                </div>
            </aside>
            <div class="col-md-10 main-right">
				<div class="main-heading">
					<h2>Tickets You Requested</h2>
				</div>
				<div class="row">
						<h4>Ticket Awaiting Purchase</h4>
					<div class="col-xs-12">
						@foreach($approve_ticket as $a_tickets)
						<div class="row">
							<div class="dinner-parties col-md-4">
								<div class="item">
									<div class="parties-wrap">
										<div class="parties-head">
											<h3><a href="#">{{$a_tickets->title}}</a></h3>
											<p>{{$a_tickets->description}}</p>
											<p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>{{$a_tickets->ticket_price}} + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="">{{$a_tickets->booking_fee}}</a></span> booking fee</p>
											<div class="event-mf">
												<i class="fa <?php if($a_tickets->guest_gender=='Men Only'){echo 'fa-male'; }elseif($a_tickets->guest_gender=='Ladies only'){ echo 'fa-female'; }elseif($a_tickets->guest_gender=='Singles only'){echo "fa-user"; } ?>" aria-hidden="true"></i>
												<p>{{ $a_tickets->guest_gender }}</p>
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
													<div class="align-center">
														<div class="rateYo1"></div>
														<span class="re-view">(17)</span>
													</div>
												</div>
												<div class="content">
													<p>Hosted By: <strong>{{ $a_tickets->name.' '.$a_tickets->last_name }}</strong></p>
													<p>Aged: <strong>{{ $a_tickets->min_age }} - {{$a_tickets->max_age }}</strong></p>
													<p>Friday {{ $a_tickets->event_date }}</p>
													<p>{{ $a_tickets->start_time }} - {{$a_tickets->end_time }}</p>
													<p>{{ $a_tickets->street }}, {{ $a_tickets->city }}, {{ $a_tickets->county }}</p>
												</div>
											</div>
											<div class="hosted-by parties-foot">
												<div class="img">
													<div class="inner">
														<img src="{{Request::root()}}/assets/admin/uploads/charity/{{ $a_tickets->logo }}" alt="" />
													</div>
												</div>
												<div class="content">
													<p><strong>{{$a_tickets->charity_cut}}</strong> of ticket price (<i class="fa fa-gbp" aria-hidden="true"></i>{{ ($a_tickets->ticket_price*$a_tickets->charity_cut)/100 }}) will go to {{ $a_tickets->charity_name }}</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-4">
								<div class="tickets-approval">
									<h3>{{$a_tickets->qty}} Tickets Approved</h3>
									<div class="content-text">
										<pre>Total Cost:          £{{$a_tickets->final_amount}}</pre>
										<p>Pay now to ensure your place at this event. Tickets are sold on a first come. first served basis.</p>
										<div class="two-btn">
											<button class="btn2">Purchase Tickets</button>
											<button class="grey-btn">Cancel Tickets Request</button>
										</div>
									</div>
									<footer>
										<div class="media">
											<div class="media-left">
												<div class="inner">
													<img src="{{Request::root()}}/assets/admin/uploads/charity/{{ $a_tickets->logo }}" class="media-object">
												</div>
											</div>
											<div class="media-body">
												<p>Action Against Hunger will receive a total of £220.00</p>
											</div>
										</div>
									</footer>
								</div>
							</div>
						</div><hr>
						@endforeach
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12 tic-awaiting">
						<h4>Tickets Awaiting Host Approval</h4>
						@foreach($unapprove_ticket as $p_tickets)
						<div class="row">
							<div class="dinner-parties col-md-4">
								<div class="item">
									<div class="parties-wrap">
										<div class="parties-head">
											<h3><a href="#">{{$p_tickets->title}}</a></h3>
											<p>{{$p_tickets->description}}</p>
											<p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>{{$p_tickets->ticket_price}} + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="">{{$p_tickets->booking_fee}}</a></span> booking fee</p>
											<div class="event-mf">
												<i class="fa <?php if($p_tickets->guest_gender=='Men Only'){echo 'fa-male'; }elseif($p_tickets->guest_gender=='Ladies only'){ echo 'fa-female'; }elseif($p_tickets->guest_gender=='Singles only'){echo "fa-user"; } ?>" aria-hidden="true"></i>
												<p>{{ $p_tickets->guest_gender }}</p>
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
													<div class="align-center">
														<div class="rateYo1"></div>
														<span class="re-view">(17)</span>
													</div>
												</div>
												<div class="content">
													<p>Hosted By: <strong>{{ $p_tickets->name.' '.$p_tickets->last_name }}</strong></p>
													<p>Aged: <strong>{{ $p_tickets->min_age }} - {{$p_tickets->max_age }}</strong></p>
													<p>Friday {{ $p_tickets->event_date }}</p>
													<p>{{ $p_tickets->start_time }} - {{$p_tickets->end_time }}</p>
													<p>{{ $p_tickets->street }}, {{ $p_tickets->city }}, {{ $p_tickets->county }}</p>
												</div>
											</div>
											<div class="hosted-by parties-foot">
												<div class="img">
													<div class="inner">
														<img src="{{Request::root()}}/assets/admin/uploads/charity/{{ $p_tickets->logo }}" alt="" />
													</div>
												</div>
												<div class="content">
													<p><strong>{{$p_tickets->charity_cut}}</strong> of ticket price (<i class="fa fa-gbp" aria-hidden="true"></i>{{ ($p_tickets->ticket_price*$p_tickets->charity_cut)/100 }}) will go to {{ $p_tickets->charity_name }}</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-md-4">
								<div class="tickets-approval">
									<h3>{{$p_tickets->qty}} Tickets Approval</h3>
									<div class="content-text">
										<pre>Total Cost:     {{$p_tickets->final_amount}}</pre>
										<p>Hosts can accept or decline any ticket requests .  They are much more likely to approve your request if you have been <a href="#">verified</a>.</p>
										<div class="two-btn">
											<button class="grey-btn">Cancel Tickets Request</button>
										</div>
									</div>
									<footer>
										<div class="media">
											<div class="media-left">
												<div class="inner">
													<img src="{{Request::root()}}/assets/admin/uploads/charity/{{$p_tickets->logo}}" class="media-object">
												</div>
											</div>
											<div class="media-body">
												<p><strong>{{$p_tickets->charity_cut}}%</strong> of ticket price will go to {{$p_tickets->title}}</p>
											</div>
										</div>
									</footer>
								</div>
							</div>
						</div><hr>
						@endforeach
					</div>
				</div>
			</div>
			
        </div>
    </div>
</div>
<script>
    $("#tabs").tabs();

    $('.search-panel .dropdown-menu').find('a').click(function (e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#", "");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
    });
    
    $(document).ready(function(){
        $('.follow-ing').each(function(){
            var id = $(this).attr('user_id');
            $.ajax({
                url: '{{Request::root()}}/user/follow/'+id,
                type: 'get',
                data: {'type':'check_follow'},
                success: function(result){
                    $('.follow-ing[user_id='+id+']').html(result);
                }
            })
        })
        
        $('.follow-ing').click(function(){
            var id = $(this).attr('user_id');
            $.ajax({
                url: '{{Request::root()}}/user/follow/'+id,
                type: 'get',
                data: {'type':'follow'},
                success: function(result){
                    $('.follow-ing[user_id='+id+']').html(result);
                }
            })
        })
    })
</script>
@endsection('content')