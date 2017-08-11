@extends('user.layout.fronLayout')
@section('content')
       <div class="middle-content account-section pay-M">
	<div class="container ">
		<div class="row clearfix">
			<h2>My Account</h2>
			
			@include('user.layout.sidebar')
			<article class="col-lg-9 main-right">
				<div class="panel-group">
					<div class="panel panel-default push-noti">
						<div class="panel-heading">Payout Method</div>
						<div class="panel-body">
							<p>When you host an event, you choose a ticket price and whether 50% or 100% of the ticket sales go to your chosen charity.  If you opt for 50%, then half the ticket sale proceeds will be paid to you.</p>
							<p>Please save a valid PayPal email address to which you would like us to forward any hosting monies.</p>
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
										
										<div class="row">
											<div class="col-md-9">
												<div class="form-group">
													<input type="text" placeholder="Paypal Email" class="form-control" name="paypal_email" value="{{ $user->paypal_email }}">
													@if ($errors->has('paypal_email'))
														<span class="error_validation">{{ $errors->first('paypal_email') }}</span>
													@endif	
												</div>
												<p class="font12">Please note any hosting proceeds are forwarded 3 days after the successful completion of your event.</p>
											</div>
											<div class="col-md-3"><button class="btn2" <?php echo ($user->paypal_confirm==1)?'disabled':''; ?>>Save</button></div>
										</div>
										
									</form>
								</div>
							</div>
						</div>
					</div>
					
				</div>
			</article>
		</div>
	</div>
</div>
 @endsection('content')