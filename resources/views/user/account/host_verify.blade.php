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
						<div class="panel-heading">Voluntary Verification</div>
						<div class="panel-body">
							<div class="media gift-card">
								<div class="media-left">
									<p></p>
								</div>
								@if(Session::has('flash_message'))
									{!! session('flash_message') !!}
								@endif
								<form method="post" data-parsley-validate="" action='{{Request::root()}}/user/host_verification' enctype="multipart/form-data">
									<input type="hidden" name="_token" value="{{csrf_token()}}" />
									<div class="media-body">
										<h4>Upload Your ID</h4>
										<ul>
											<li>
												<input class="text" type="file" name="id_proof" required="" <?php echo ($user->approve_id=='1')?'disabled':''; ?> >
												<input type="hidden"  name="old_file" value="{{ $user->id_proof }}">
													@if ($errors->has('id_proof'))
														<span class="error_validation">{{ $errors->first('id_proof') }}</span>
													@endif												 
											</li>
											<li>
												<button type="submit" name="upload" value="idupload" class="btn2" <?php echo ($user->approve_id=='1')?'disabled':''; ?>>Upload</button>
											</li>	
										</ul>
									</div>
								</form>
								
								<form method="post" data-parsley-validate="" action='{{Request::root()}}/user/host_verification' enctype="multipart/form-data">
									<input type="hidden" name="_token" value="{{csrf_token()}}" />
									<div class="media-body">
										<h4>Upload Your Adderss Proof</h4>
										<ul>
											<li>
												<input class="text" type="file" name="address_proof" required="" <?php echo ($user->approve_address=='1')?'disabled':''; ?> >
												<input type="hidden"  name="old_file" value="{{ $user->address_proof }}" >
													@if ($errors->has('address_proof'))
														<span class="error_validation">{{ $errors->first('address_proof') }}</span>
													@endif	
											</li>
											<li>
												<button type="submit" name="upload" value="addressupload" class="btn2" <?php echo ($user->approve_address=='1')?'disabled':''; ?>>Upload</button>
											</li>	
										</ul>
									</div>
								</form>
								
								
								<div class="media-body">
									<h4>Facebook Account</h4>
									<?php if($user->confirmed=='1' && count($social_login)==1 ){ ?>
									<button type="submit" name="upload" value="addressupload" class="btn2 face" ><i class="fa fa-facebook" aria-hidden="true"></i> Verified</button>
									<?php }else{ ?>											
									<a href="{{Request::root()}}/user/verify_facebook">
										<button name="upload" value="addressupload" class="btn2 face" ><i class="fa fa-facebook" aria-hidden="true"></i> Verify facebook account</button>	
									</a>
									<?php } ?>
								</div><br>
								<?php if($user->paypal_email!=""){ ?>
								<div class="media-body">
									<h4>Paypal Account</h4>
									<?php if($user->paypal_confirm=='1'){ ?>
									<button type="submit" name="upload" value="addressupload" class="btn2" >Verified</button>
									<?php }else{ ?>											
									<a href="{{Request::root()}}/user/paypal_verify">
										<button name="upload" value="addressupload" class="btn2" ><i class="fa fa-paypal" aria-hidden="true"></i> Verify Paypal account</button>	
									</a>
									<?php } ?>
								</div>
								<?php } ?>
							</div>
						</div>
					</div>
				</div>
			</article>
		</div>
	</div>
</div>
 @endsection('content')