@extends('user.layout.fronLayout')
@section('content')

<div class="pro-header">
<div class="container your-party ">
    
        <div class="pull-left">
            <h2>Hello. {{Auth::guard('user')->user()->name}},</h2>
            <h3>Your <span>Dinner Party at Mark’s</span> is Coming up in 3days</h3>
        </div>
        <div class="pull-right">
            <button class="gost-btn" onClick="window.location.href='{{Request::root()}}/user/create_event'">Host A Dinner Party</button>
        </div>
    
</div>
</div>

<section class="middle-content profile-page">
    <div class="container dinner-parties">
        <div class="main-heading">
            <h2>Dinner Parties That Might Interest You</h2>
        </div>
        <div class="owl-carousel owl-theme">
            @foreach($events as $item)
            <div class="item">
                <div class="parties-wrap">
                    <div class="parties-head">
                        <h3><a href="{{Request::root()}}/user/book_event_ticket/{{$item->id}}">{{$item->title}}</a></h3>
                        <p>{{$item->description}}</p>
                        <p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>{{ $item->ticket_price }} + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.">80.00</a></span> booking fee</p>
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
                                    <a class="follow-ing" user_id="{{ $item->user_id }}" href="#/">Follow</a>
                                </div>
                                <div class="inner">
                                    <div class="circle-img"></div>
                                    <img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="" />
                                </div>
                                <div class="rateYo1"></div>
								<span class="re-view">(17)</span>
                            </div>
                            <div class="content">
                                <p>Hosted By: <strong>{{ $item->name.' '.$item->last_name }}</strong></p>
                                <p>Aged: <strong><?php echo date('Y') - date('Y',strtotime($item->dob)); ?></strong></p>
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
			@endforeach
        </div>
    </div>

    <div class="helping-section">
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-sm-12 col-xs-12 helping-left">
                    <h2>Oh no! A quake happened in Nepal yesterday!</h2>
                    <h5>Hold a dinner party to help out!</h5>
                    <a class="btn2" href="#">Help Nepal</a>
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12 helping-right">
                    <img src="{{Request::root()}}/assets/front/img/helping-img2.jpg" alt="">
                </div>
            </div>
        </div>
    </div>
</section>
<script>
$(function () {
		$(".rateYo1").rateYo({
			starWidth: "11px",
			normalFill: "#484848",
			ratedFill: "#fff"
		});
	});
	
$(document).ready(function()
{
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
	
	$('.follow-ing').click(function()
	{
		var uid = $(this).attr('user_id');
		 $.ajax({
                url: '{{Request::root()}}/user/follow/'+uid,
                type: 'get',
                data: {'type':'follow'},
                success: function(result){
                    $('.follow-ing[user_id='+uid+']').html(result);
                }
            })
	});
	
})
</script>
@endsection