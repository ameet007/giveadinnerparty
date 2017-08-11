@extends('user.layout.fronLayout')
@section('content')
       <div class="middle-content account-section">
	<div class="container ">
		<div class="row clearfix">			
			@include('user.layout.sidebar')
			<article class="col-lg-9 main-right">
				<div class="panel-group">
					<div class="panel panel-default push-noti">
						<div class="panel-heading">Email Settings</div>
						<div class="panel-body">
							<div class="media">
								<div class="media-left">
									<p>I want to receive</p>
								</div>
								<div class="media-body">
									<div class="checkbox-him">
										<div class="row">
											<label class="col-sm-1">
												<input id="new" type="checkbox">
											</label>
											<label for="new" class="col-sm-11">
												<strong>General and promotional emails</strong>
												<p>General promotions, updates, news or general promotions for partner campaigns and services, user surveys, inspiration, and love.</p>
											</label>
										</div>
									</div>
									<div class="checkbox-him">
										<div class="row">
											<label class="col-sm-1">
												<input id="new" type="checkbox">
											</label>
											<label for="new" class="col-sm-11">
												<strong>Receive Host invites</strong>
												<p>Receive invitations to events from the Host of the event.</p>
											</label>
										</div>
									</div>
									<div class="checkbox-him">
										<div class="row">
											<label class="col-sm-1">
												<input id="new" type="checkbox" checked>
											</label>
											<label for="new" class="col-sm-11">
												<strong>Account activity</strong>
												<p>Payment notices, reservation confirmations, review activity, and security alerts. These are required to services your account. You may not opt out of these notices.</p>
											</label>
										</div>
									</div>
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