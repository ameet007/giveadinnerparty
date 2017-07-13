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
							<div class="media gift-card">
								<div class="media-left">
									<p>Enter to your PayPal Email</p>
								</div><br>
								@if(Session::has('flash_message'))
									{!! session('flash_message') !!}
								@endif
								<div class="media-body">									
									<form method="post" action='{{Request::root()}}/user/payment_method'>
										<input type="hidden" name="_token" value="{{csrf_token()}}" />
										<ul>
											<li><input type="text" placeholder="Paypal Email" name="paypal_email" value="{{ $user->paypal_email }}">
												@if ($errors->has('paypal_email'))
													<span class="error_validation">{{ $errors->first('paypal_email') }}</span>
												@endif
											</li>
											<li><button class="btn2" <?php echo ($user->paypal_confirm==1)?'disabled':''; ?>>Update</button></li>
										</ul>
									</form>
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