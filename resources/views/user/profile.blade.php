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
		<?php $charity = DB::select( DB::raw("SELECT * FROM charities WHERE id = '$event->charity_id'") ); ?>
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
								<!--<div class="rateyo-readonly-widg"></div>-->
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
		@endforeach			
		</div>
	</div>
	<div class="container sheng-reviews">
		<h2>Sheng has {{ count($reviews) }} Reviews</h2>
		<?php //if(count($friend)==1){ ?>
		<button class="btn2" id="reviewbtn">Leave {{ $user->name.' '.$user->last_name }} A Review</button>	
		<?php //} ?>	
		<ul>
			<?php //if(count($friend)==1){ ?>
			<li style="display:none" id="review_box">
				<div class="media">
					<h3>Leave a Review</h3>
					<form method="post" action="{{Request::root()}}/user/write_review" id="myform">
						<input type="hidden" value="{{csrf_token()}}" name="_token" >
						<input type="hidden" value="{{ base64_encode($user->id) }}" name="post_id" >
						<input type="hidden" value="" name="rating" id='rating'>
						<select name="event" class="form-control" required>
							<option value="">-- select event --</option>
							@foreach($user_events as $events)
							<option value="{{ $events->id }}" >{{ $events->title }}</option>
							@endforeach
						</select>
						<div class="rateyo-readonly-widg"></div>
						<textarea name="review" class="form-control" required ><?php echo old('review'); ?></textarea><br>
						@if(ISSET($errors))
						  <ul class="parsley-errors-list">
							<li class="parsley-required">{{$errors->first('review')}}</li>
						  </ul>
						 @endif					  
						<button type="submit" class="grey-btn pull-right" >Post Review</button>
					</form>
				</div>
			</li>
			<?php //} ?>
			@foreach($reviews as $review)
			<?php $event_data = DB::select( DB::raw("SELECT * FROM events WHERE id = '$review->event'") ); ?>
			<?php $event_next_seven_days_date = date('Y-m-d',strtotime("+7 day",strtotime($event_data[0]->event_date))); ?>
			<li>
				<div class="media">
					<div class="media-left">
						<div class="inner">
							<img src="{{Request::root()}}/assets/front/img/review-pic.png" class="media-object" />
							<p>{{ $review->name}}</p>
							<div id="mystar{{ $review->id }}"></div>
						</div>
					</div>
					<div class="media-body">						
						<p class="box_content<?php echo $review->id ?>">{{ $review->review }}</p>
						<form method="post" id="myform<?php echo $review->id ?>">
							<p style="display:none;" class="box<?php echo $review->id ?>" ><textarea class="form-control" id="review<?php echo $review->id ?>" name="review">{{ $review->review }}</textarea></p>
							<input type="hidden" name="_token" value="{{ csrf_token() }}">
							<input type="hidden" name="id" value="<?php echo $review->id ?>">
						</form>
						
						<?php if($event_next_seven_days_date>= date('Y-m-d')){ ?>
						<div class="pull-right grey-btn" id="editbtn<?php echo $review->id ?>" 
						onclick="return editreviewbox('<?php echo $review->id ?>');" >Edit</div>
						<?php } ?>						
						<form method="post" action="{{Request::root()}}/user/reply_for_review">							
							<div style="display:none" id="replybox<?php echo $review->id; ?>">
								<input type="hidden" name="_token" value="{{ csrf_token() }}">
								<input type="hidden" name="post_id" value="<?php echo $review->post_id; ?>">
								<input type="hidden" name="reply_id" value="<?php echo $review->id; ?>">
								<input type="hidden" name="event" value="<?php echo $event_data[0]->title; ?>">
								<textarea class="form-control" name="review"></textarea>
								<button class="grey-btn">Submit</button>
							</div>
						</form>	
						
						<div class="pull-right btn3" ><a onclick="return showreplybox(<?php echo $review->id; ?>);">reply</a></div><br><br>
						<div class="essex-from clearfix">
							<div class="pull-left">
								<h4>From {{ $review->town }}, {{ $review->country }}</h4>
							</div>
							<div class="pull-right">
								<a>{{ $event_data[0]->title }}</a>
							</div>
						</div>
						<?php $reply_reviews = DB::select( DB::raw("SELECT * FROM reviews WHERE reply_id = '$review->id'") ); ?>
						<?php foreach($reply_reviews as $reply ){ ?>
						<div class="reply">
							<p>{{ $reply->review }}</p>
						</div>
						<?php } ?>
						
					</div>
				</div>	
					
			</li>
			@endforeach
		</ul>
	</div>
</section>
<script>
$( document ).ready(function() {
	$('#reviewbtn').click(function(){
		$('#review_box').slideToggle('slow');
	});
	$('#myform').parsley();
});

function editreviewbox(BOX)
{
	$('.box_content'+BOX).toggle();
	$('.box'+BOX).toggle();
	if($('#editbtn'+BOX).html()=='Edit')
	{
		$('#editbtn'+BOX).html('Save');
	}
	else
	{
		var form_data = $("#myform"+BOX);
		$.ajax({
			url: '<?php echo url('/user/update_review'); ?>',
			type: 'POST',
			data : form_data.serialize(),
			//dataType: 'JSON',
			cache: false,
			success: function(data)
			{
				//alert(data);
				console.log(data);
			},
			error: function(xhr, ajaxOptions, thrownError)
			{
				alert(xhr.status);
			},	
		});		
		$('.box_content'+BOX).html($('#review'+BOX).val());
		$('#editbtn'+BOX).html('Edit');
	}	
}


function showreplybox(BOX_ID)
{
	$('#replybox'+BOX_ID).toggle();
}

 $(function () {
       var rating = 1;        
       $(".rateyo-readonly-widg").rateYo({
            rating: rating,
            numStars: 5,
            precision: 2,
            minValue: 1,
            maxValue: 5
        }).on("rateyo.change", function (e, data){			
			$('#rating').val(data.rating);            
        });	
	@foreach($reviews as $review)
     $("#mystar<?php echo $review->id; ?>").rateYo({
		rating: <?php echo $review->rating; ?>,
		readOnly: true
	  }); 
	@endforeach
 });
</script>
@endsection