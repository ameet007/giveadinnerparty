@extends('user.layout.fronLayout')
@section('content')
<script src="{{Request::root()}}/assets/front/js/jquery-ui.js"></script>
<div class="middle-content account-section profile-edit public-pro tration-his">
	<div class="container ">
		<div class="row clearfix per-details">	
			@include('user.layout.sidebar')
			<div class="col-md-9">
				<div class="main-heading">
					<h2>Transaction History</h2>
				</div>
				<div class="row">
					<div class="col-md-3">
						<div class="pro-pic">
							<div class="over-lay"></div>
							<img src="{{Request::root()}}/assets/front/img/pro-pic.jpg" alt="" />
						</div>
						<div class="charity-f">
							<div id="rateYo2"></div><span class="re-view">(17)</span>
							<h3>£65,425</h3>
							<h5>Charity Funds Raised</h5>
							<h5>As A Host £60,000</h5>
							<h5>As A Guest £5,425</h5>
						</div>
					</div>
					<div class="col-md-9">
						<div class="my-events">
							<div id="tabs">
								<ul>
									<li><a href="#tabs-2">As a Host</a></li>
									<li><a href="#tabs-1">As a Guest</a></li>									
								</ul>
								<div id="tabs-1">
									<table class="table table-responsive">
										<thead>
											<tr>
												<th>Date</th>
												<th>Event</th>
												<th>Transaction</th>
												<th>Charity REC</th>
												<th>Host REC</th>
												<th>Booking Fee</th>
												<th>Status</th>
												<th>Total</th>
											</tr>
										</thead>
										<tbody>
										@foreach($guest_transaction as $guest)
										<?php $guest_charity_rec = (($guest->ticket_price*$guest->charity_cut)/100)*$guest->qty;  ?>
										<?php $guest_rec = abs($guest->ticket_price*$guest->qty-$guest_charity_rec);  ?>
											<tr>
												<td>{{ date('d M Y',strtotime($guest->tr_date)) }}</td>
												<td>{{ $guest->event_title }}</td>
												<td><spna width="150px">
												<?php if($guest->status=='approve' || $guest->status=='unapprove'){echo 'Purchased'; }elseif($guest->status=='refaund'){ echo 'Refunded'; } ?>
												</spna> {{ $guest->qty }} Tickets at £{{ $guest->ticket_price*$guest->qty }}</td>
												<td>
												<?php echo ($guest->status=='refaund')?'-':''; ?>	
												£{{$guest_charity_rec}}</td>
												<td>
												<?php echo ($guest->status=='refaund')?'-':''; ?>
												£{{$guest_rec}}</td>
												<td>
												<?php echo ($guest->status=='refaund')?'-':''; ?>
												£{{$guest->booking_fee*$guest->qty}}</td>
												<td><?php if($guest->status=='approve'){echo 'Purchased'; }elseif($guest->status=='refaund'){ echo 'Refunded'; }else{ echo 'Pending'; } ?></td>
												<td>
												<?php echo ($guest->status=='refaund')?'':'-'; ?>
												£{{$guest->final_amount}}</td>
											</tr>
										@endforeach
										</tbody>
									</table>
								</div>
								<div id="tabs-2">
									<table class="table table-responsive">
										<thead>
											<tr>
												<th>Date</th>
												<th>Event</th>
												<th>Transaction</th>
												<th>Charity REC</th>
												<th>Host REC</th>
												<th>Booking Fee</th>
												<th>Status</th>
												<th>Total</th>
											</tr>
										</thead>
										<tbody>
										@foreach($host_transaction as $host)
										<?php $host_charity_rec = (($host->ticket_price*$host->charity_cut)/100)*$host->qty;  ?>
										<?php $host_rec = abs($host->ticket_price*$host->qty-$host_charity_rec);  ?>
											<tr>
												<td>{{ date('d M Y',strtotime($host->tr_date)) }}</td>
												<td>{{ $host->event_title }}</td>
												<td><spna width="150px">
												<?php if($host->status=='approve'){echo 'Sold'; }elseif($host->status=='refaund'){ echo 'Refunded'; }else{ echo 'sold'; } ?>
												</spna> {{ $host->qty }} Tickets at £{{ $host->ticket_price*$host->qty }}</td>
												<td>£{{$host_charity_rec}}</td>
												<td>£{{$host_rec}}</td>
												<td>£{{$host->booking_fee*$host->qty}}</td>
												<td><?php if($host->status=='approve'){echo 'Complete'; }elseif($host->status=='refaund'){ echo 'Complete'; }else{ echo 'Pending'; } ?></td>
												<td>£{{$host->final_amount}}</td>
											</tr>
										@endforeach
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script>
$(document).ready(function()
{
	$('.left-sidebar').removeClass('col-lg-3');
	$('.left-sidebar').addClass('col-lg-2');
	$( "#tabs" ).tabs();
});

$(function () {
		$("#rateYo2").rateYo({
			starWidth: "20px",
			normalFill: "#484848",
			ratedFill: "#E85A00",
			rating: 4.0
		});
	});
</script>
 @endsection('content')