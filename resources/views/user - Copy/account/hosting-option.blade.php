@extends('user.layout.fronLayout')
@section('content')
       <div class="middle-content">
	<div class="container account-section">
		<div class="row clearfix">
			<h2>My Account</h2>
			
			@include('user.layout.sidebar')
			<article class="col-lg-9 main-right">
				<div class="panel-group">
					<div class="panel panel-default push-noti my-hos">
						<div class="panel-heading">My Hositng Option</div>
						<div class="panel-body">
							<div class="media">
								<div class="media-left">
									<p>Booking Approval</p>
								</div>
								<div class="media-body">
									<select>
										<option selected="selected">Select Method</option>
										<option>Guest Require My Approval</option>
										<option>Guest Buy Immediately</option>
									</select>
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