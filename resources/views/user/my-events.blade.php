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
<div class="middle-content account-section your-hosting even-ts">
    <div class="container">
        <div class="row clearfix">
            <aside class="col-md-2 left-sidebar">
                <div class="sidenav-list">
                    @include('user.layout.event-sidebar')
                </div>
            </aside>
            <article class="col-md-10">
                <div class="dinner-parties">
                    <div class="main-heading">
                        <h2>Events You’re Following</h2>
						<a href="{{Request::root()}}/user/create_event" class="btn2 pull-right">Host An Event</a>
                    </div>
                    <div class="row">
                        @foreach($followed_events as $item)
                        <div class="col-md-4">
                            <div class="item">
                                <div class="parties-wrap">
                                    <div class="parties-head">
                                        <h3><a href="{{Request::root()}}/user/event/guest/{{$item->id}}">{{ $item->title }}</a></h3>
                                        <p><?php echo substr($item->description,0,90); ?>..</p> 
                                        <p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>{{ $item->ticket_price }} + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="">80.00</a></span> booking fee</p>
                                        <div class="event-mf">
                                            <i class="fa <?php
                                                                if ($item->guest_gender == 'Men Only') {
                                                                    echo 'fa-male';
                                                                } elseif ($item->guest_gender == 'Ladies only') {
                                                                    echo 'fa-female';
                                                                } elseif ($item->guest_gender == 'Singles only') {
                                                                    echo "fa-user";
                                                                }
                                                                ?>" aria-hidden="true"></i>
                                            <p>{{ $item->guest_gender }}</p>
                                        </div>
                                    </div>
                                    <div class="parties-host">
                                        <div class="hosted-by">
                                            <div class="img">
                                                <div class="heart-dil">
                                                    <!--<a class="follow-ing" user_id="{{$item->user_id}}" href="#/">Follow</a>-->
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
                                                <p>Hosted By: <strong>{{ $item->name.' '.$item->last_name }}</strong></p>
                                                <p>Aged: <strong>{{ date('Y') - explode('/', $item->dob)[2] }}</strong></p>
                                                <p>Friday {{ $item->event_date }}</p>
                                                <p>{{ $item->start_time }} - {{$item->end_time }}</p>
                                                <p>{{ $item->street }}, {{ $item->city }}, {{ $item->county }}</p>
                                            </div>  
                                        </div>
                                        <div class="hosted-by parties-foot">
                                            <div class="img">
                                                <div class="inner">
                                                    <img src="{{Request::root()}}/assets/admin/uploads/charity/{{ $item->logo }}" alt="" />
                                                </div>
                                            </div>
                                            <div class="content">
                                                 <p>
												 
												 <strong>{{ $item->charity_cut }}%</strong> of ticket price (<i class="fa fa-gbp" aria-hidden="true"></i>{{ ($item->ticket_price*$item->charity_cut)/100 }}) will go to {{ $item->title }}</p>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
				
				<div class="helping-section">
					<div class="row">
						<div class="col-md-6 col-sm-12 col-xs-12 helping-left">
							<h2>By Hosting, You re Helping While Having Fun</h2>
							<h5>Have dinner with people that you’ll love, while helping out</h5>
							<a class="btn2" href="#">Learn More</a>
						</div>
						<div class="col-md-6 col-sm-12 col-xs-12 helping-right">
							<img src="{{Request::root()}}/assets/front/img/helping-img.jpg" alt="">
						</div>
					</div>
				</div>
				
                <div class="dinner-parties">
                    <div class="main-heading">
                        <h2>Suggested Events</h2>
                    </div>
                    <div class="row">
                        @foreach($suggested_events as $item)
                        <div class="col-md-4">
                            <div class="item">
                                <div class="parties-wrap">
                                    <div class="parties-head">
                                        <h3><a href="{{Request::root()}}/user/event/guest/{{$item->id}}">{{ $item->title }}</a></h3>
                                        <p><?php echo substr($item->description,0,90); ?>..</p> 
                                        <p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>{{ $item->ticket_price }} + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="">80.00</a></span> booking fee</p>
                                        <div class="event-mf">
                                            <i class="fa <?php
                                                                if ($item->guest_gender == 'Men Only') {
                                                                    echo 'fa-male';
                                                                } elseif ($item->guest_gender == 'Ladies only') {
                                                                    echo 'fa-female';
                                                                } elseif ($item->guest_gender == 'Singles only') {
                                                                    echo "fa-user";
                                                                }
                                                                ?>" aria-hidden="true"></i>
                                            <p>{{ $item->guest_gender }}</p>
                                        </div>
                                    </div>
                                    <div class="parties-host">
                                        <div class="hosted-by">
                                            <div class="img">
                                                <div class="heart-dil">
                                                    <!--<a class="follow-ing" user_id="{{$item->user_id}}" href="#/">Follow</a>-->
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
                                                <p>Hosted By: <strong>{{ $item->name.' '.$item->last_name }}</strong></p>
                                                <p>Aged: <strong>{{ date('Y') - explode('/', $item->dob)[2] }}</strong></p>
                                                <p>Friday {{ $item->event_date }}</p>
                                                <p>{{ $item->start_time }} - {{$item->end_time }}</p>
                                                <p>{{ $item->street }}, {{ $item->city }}, {{ $item->county }}</p>
                                            </div>  
                                        </div>
                                        <div class="hosted-by parties-foot">
                                            <div class="img">
                                                <div class="inner">
                                                    <img src="{{Request::root()}}/assets/admin/uploads/charity/{{ $item->logo }}" alt="" />
                                                </div>
                                            </div>
                                            <div class="content">
                                                 <p><strong>{{ $item->charity_cut }}%</strong> of ticket price (<i class="fa fa-gbp" aria-hidden="true"></i>{{ ($item->ticket_price*$item->charity_cut)/100 }}) will go to {{ $item->title }}</p>
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

	 $(function ()
	 {		
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