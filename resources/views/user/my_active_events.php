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
<div class="middle-content account-section your-hosting">
    <div class="container">
        <div class="row clearfix">
            <aside class="col-md-2 left-sidebar">
                <div class="sidenav-list">
                    <ul>
                        <li class=''><a href='#'>Host New Event</a></li>
                        <li class=''><a href='#'>My Active Events</a></li>
                        <li class=''><a href='#'>My Ended Events</a></li>
                        <li class=''><a href='#'>Verify Me As A Host</a></li>
                        <li class=''><a href='#'>Invite Users</a></li>
                    </ul>
                </div>
            </aside>
            <article class="col-md-10">
                <div class="dinner-parties">
                    <div class="main-heading">
                        <h2>You Hosting</h2>
                    </div>
                    <div class="row">
						@foreach($events as $event)
					    <?php $charity = DB::select( DB::raw("SELECT * FROM charities WHERE id ='$event->charity_id'") ); ?>
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
													<img src="{{Request::root()}}/assets/admin/uploads/charity/{{ $charity[0]->logo }}" alt="" />
												</div>
											</div>
											<div class="content">
												<p><strong>{{ $event->charity_cut }}%</strong> of ticket price will go to {{ $charity[0]->title }}</p>
											</div>	
										</div>
									</div>
								</div>
							</div>
                        </div>
						@endforeach 
                       
                    </div>
                </div>
            </article>
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
</script>
@endsection('content')