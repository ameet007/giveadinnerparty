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
<div class="middle-content account-section your-hosting invite-fri f-pay-link">
    <div class="container">
        <div class="row clearfix">
            <aside class="col-md-2 left-sidebar">
                <div class="sidenav-list">
                    <ul>
                        <li class=''><a href='{{Request::root()}}/user/your_hosting'>Host New Event</a></li>
                        <li class=''><a href='{{Request::root()}}/user/my_active_event'>Your Active Events</a></li>
                        <li class=''><a href='{{Request::root()}}/user/my_ended_event'>Your Ended Events</a></li>
                        <li class=''><a href='#'>Verify Me</a></li>
						<li class="active"><a href='{{Request::root()}}/user/friend_payment_link'>Friend Payment Link</a></li>
                        <li class=''><a href='{{Request::root()}}/user/invite_friends'>Invite Users</a></li>
                    </ul>
                </div>
            </aside>
            <article class="col-md-10">
                <div class="dinner-parties">
                    <div class="main-heading">
						<h2>Friend Payment Link</h2>
					</div>
					<form method="post" >
						<div class="row">
							<div class="col-md-12">
								<p>If you have existing friends that would like to attend your fundraising event you can send them a payment link here.  This will mean they do not need to set up a profile. They simply pay for the ticket(s) via an emailed link.  Their tickets will be recorded as ‘Host’s Friend’ for your event.  Your friend is not obligated to purchase the ticket(s).  All tickets are sold on a first come, first served basis.</p>
								<h4>Choose Your Listed Event</h4>
								<div class="row">
									<div class="col-xs-8">
										<div class="form-group">
											<select class="form-control" onchange="return showdiv(this.value);" required>
												<option>Choose Your Listed</option>
												@foreach($events as $event)
												<option class="f-pay-m1111" value="{{ $event->id }}">{{ $event->title }}</option>
												@endforeach
											</select>
										</div>
									</div>
								</div>
								<div class="f-pay-m">
									<h4 id="event_title"></h4>
									<p><strong>Date:</strong><span id="event_date"> Friday 21st August 2017</span></p>
									<p><strong>Tickets:</strong> <span id="event_ticket"></span></p>
									<p><span id="charity_name"></span> receives £<span id="charity_recieve"></span> per ticket sale</p>
									<input type="hidden" id="one_ticket_price" value="" required>
									<div class="row">
										<div class="col-xs-8">
											<div class="form-group">
												<label>Select Number of Tickets</label>
												<select class="form-control" name="no_of_ticket" required>
													<option value="">--Please Select--</option>
													<option>1</option>
													<option>2</option>
													<option>3</option>
													<option>4</option>
													<option>5</option>
													<option>6</option>
													<option>7</option>
													<option>8</option>
													<option>9</option>
													<option>10</option>
												</select>
											</div>
										</div>
										<div class="col-xs-8">
											<div class="form-group">
												<label>Enter Friend’s Name</label>
												<input type="text" class="form-control" placeholder="John" id="friend_name" required/>
											</div>
										</div>
										<div class="col-xs-8">
											<div class="form-group">
												<label>Enter Friend’s Email Address</label>
												<input type="text" class="form-control" placeholder="John@webdomain.com" id="friend_email" required/>
											</div>
										</div>
										<div class="col-xs-8">
											<div class="form-group">
												<label>Total Price For <span id="count_ticket">0</span> Tickets</label>
												<input type="text" class="form-control" id="total_ticket_price" placeholder="£0.00" required/>
											</div>
											<div class="align-right">
												<button class="btn2">Send Payment Links</button>
											</div><br>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
                </div>
            </article>
        </div>
    </div>
</div>
<script>
$(document).ready(function(){

    $('form').parsley();
	
	$('.search-panel .dropdown-menu').find('a').click(function(e) {
		e.preventDefault();
		var param = $(this).attr("href").replace("#","");
		var concept = $(this).text();
		$('.search-panel span#search_concept').text(concept);
		$('.input-group #search_param').val(param);
	});
	
    $('.f-pay-m').hide();
	
	$("select[name='no_of_ticket']").change(function(){
		//alert(this.value);
		$('#count_ticket').html(this.value);
		$('#total_ticket_price').val('£'+this.value*$('#one_ticket_price').val());
	});
});
function showdiv(VAL)
{
	if(VAL!='Choose Your Listed')
	{
		$('.f-pay-m').show();
		$.ajax({
                    url: '{{Request::root()}}/user/get_single_event_data',
                    type: 'post',
                    data: {'_token':'{{csrf_token()}}','id':VAL},
					 dataType:'json',
                    success: function(responsedata)
					{
						//alert(responsedata.title);
						$('#event_title').html(responsedata.title);
						$('#event_date').html(responsedata.event_date);
						$('#event_ticket').html("£" + (responsedata.ticket_price + 6.25) + " each (£"+ responsedata.ticket_price +" ticket price + £6.25 booking fee)");
						$('#event_date').html(responsedata.event_date);
						$('#charity_recieve').html((responsedata.ticket_price * responsedata.charity_cut)/100);
						$('#one_ticket_price').val(responsedata.ticket_price + 6.25);
						$('#charity_name').html(responsedata.charity_name);
						
						$("select[name='no_of_ticket']").val('');
						$('#count_ticket').html('0');
						$('#total_ticket_price').val('£0.00');
						
						$("#friend_name").val('');
						$("#friend_email").val('');
				   }				
                })
		
	}
	else
	{
		$('.f-pay-m').hide();
	}
}
</script>
@endsection('content')