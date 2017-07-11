@extends('user.layout.fronLayout')
@section('content')
       <div class="middle-content">
	<div class="container account-section">
		<div class="row clearfix">
			<h2>My Account</h2>
			
			@include('user.layout.sidebar')
			<article class="col-lg-9 main-right">
				<div class="panel-group">
					<div class="panel panel-default push-noti">
						<div class="panel-heading">Payment Methods</div>
						<div class="panel-body">
							<div class="media">
								<div class="media-left">
									<p>Sign-in to your PayPal</p>
								</div>
								<div class="media-body">
									<img src="{{Request::root()}}/assets/front/img/pay-pal.jpg" alt="">
								</div>
							</div>
						</div>
					</div>
					<div class="panel panel-default gift-card">
						<div class="panel-heading">Voucher</div>
						<div class="panel-body">
							<h3>Your gift card balance: <spna>0</spna></h3>
							<p>The credit balance from gift cards will be automatically applied when you book a trip.</p>
							<ul>
								<li><input type="text" placeholder="Insert your voucher code"></li>
								<li><button class="btn2">Apply to Account</button></li>
							</ul>
							<a href="#">Popln gift cards help</a>
						</div>
					</div>
				</div>
			</article>
		</div>
	</div>
</div>
 @endsection('content')