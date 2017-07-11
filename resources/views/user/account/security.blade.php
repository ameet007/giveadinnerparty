@extends('user.layout.fronLayout')
@section('content')
       <div class="middle-content">
	<div class="container account-section">
		<div class="row clearfix">
			<h2>My Account</h2>
			
			@include('user.layout.sidebar')
			<article class="col-lg-9 main-right">
				<div class="panel-group">
					<div class="panel panel-default push-noti secur-ity">
						<div class="panel-heading">Change Your Password</div>
						<div class="panel-body">
							<div class="media">
								<div class="media-left">
									<p></p>
								</div>
								@if(Session::has('flash_message'))
									{!! session('flash_message') !!}
								@endif
								<form method="post" action='{{Request::root()}}/user/security'>
									<input type="hidden" name="_token" value="{{csrf_token()}}" />
									<div class="media-body">
										<input type="password" name="old_password" value="{{ old('old_password') }}" placeholder="Old Password">
										@if ($errors->has('old_password'))
											<span class="error_validation">{{ $errors->first('old_password') }}</span>
										@endif
										<input type="password" name="new_password" value="{{ old('new_password') }}" placeholder="New Password">
										@if ($errors->has('new_password'))
											<span class="error_validation">{{ $errors->first('new_password') }}</span>
										@endif
										<input type="password" name="comfirm_password" value="{{ old('comfirm_password') }}" placeholder="Confirm Password">
										@if ($errors->has('comfirm_password'))
											<span class="error_validation">{{ $errors->first('comfirm_password') }}</span><br>
										@endif
										<button type="submit" class="btn2">Submit</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</article>
		</div>
	</div>
</div>
 @endsection('content')