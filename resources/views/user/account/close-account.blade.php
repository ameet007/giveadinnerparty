@extends('user.layout.fronLayout')
@section('content')
       <div class="middle-content account-section clo-account">
	<div class="container ">
		<div class="row clearfix">			
			@include('user.layout.sidebar')
			<article class="col-lg-9 main-right">
				<div class="main-heading">
					<h2>Close Account</h2>
				</div>
				<form method="post" action="{{Request::root()}}/user/close_account">
				<input type="hidden" name="_token" value="{{csrf_token()}}">
				<div class="row mr20">
					<div class="col-md-6">
						<h4>Close Account</h4>
						<p>Please let us know why you’re leaving</p>
						<span class="why_close">
							<div class="checkbox">
								<label><input type="checkbox" name="why_close[]" value="I have concerns about privacy" data-parsley-multiple="food_drink_type" required>I have concerns about privacy</label>
							</div>						
							<div class="checkbox">
								<label><input type="checkbox" name="why_close[]" value="I haven’t found it useful" data-parsley-multiple="food_drink_type" required>I haven’t found it useful</label>
							</div>
							<div class="checkbox">
								<label><input type="checkbox" name="why_close[]" value="I don’t understand how to use it" data-parsley-multiple="food_drink_type" required>I don’t understand how to use it</label>
							</div>
							<div class="checkbox">
								<label><input type="checkbox" name="why_close[]" value="Other" data-parsley-multiple="food_drink_type" required>Other</label>
							</div>
						</span>
						<div class="form-group">
							<label for="comment">Please tell us more</label>
							<textarea class="form-control" rows="3" id="comment" name="tell_more" required>{{(isset($cancel_account->tell_more))?$cancel_account->tell_more:''}}</textarea>
						</div>
						<p>Can we contact you for more details ?</p>
						<label class="radio-inline"><input type="radio" name="contact_you" value="yes" {{(isset($cancel_account->contact_you) && $cancel_account->contact_you=='yes')?'checked':''}} data-parsley-multiple="contact_you" required>Yes</label>
						<label class="radio-inline"><input type="radio" name="contact_you" value="no" {{(isset($cancel_account->contact_you) && $cancel_account->contact_you=='no')?'checked':''}} data-parsley-multiple="contact_you" required>No</label>
					</div>
					<div class="col-md-6">
						<h4>Alternatives To Closing Account</h4>
						<p>Change your <a href="#">notification settings</a> to receive fewer messages.</p>
						<p>Change your <a href="#">privacy settings.</a></p>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12">
						<h4>What’s going to happen</h4>
						<p>Your profile and any listings will disappear</p>
						<p>We’ll miss not having you in the Give A Dinner Party community</p>
						<?php if(count($cancel_account)==0){ ?>
						<button type="submit" name="cancel_myaccount" value="cancel_account" class="grey-btn" <?php echo(count($cancel_account)==1)?'disabled':''; ?>>Cancel my account</button>
						<button type="button" name="" class="btn2" disabled>Don’t cancel my account</button>
						<?php }else{ ?>
						<button type="submit" name="" value="" class="grey-btn" disabled>Cancel my account</button>
						<button type="submit" name="dont_cancel_myaccount" value="dont_cancel_myaccount" class="btn2">Don’t cancel my account</button>
						<?php } ?>
					</div>
				</div>
				</form>
			</article>
		</div>
	</div>
</div>
<script>
$(document).ready(function(){
	<?php if(isset($cancel_account->why_close) && !empty($cancel_account->why_close)){ ?>
		var whyclose = {!! (!empty($cancel_account->why_close))?$cancel_account->why_close:"['no data']" !!};
		$(".why_close input[name='why_close[]']").each(function()
		{
			var checked = false;
			for(var i=0; i<whyclose.length; i++){					
				if($(this).val() == whyclose[i]){
					$(this).prop('checked',true);
				}
			}
		});
	<?php } ?>
	$('form').parsley();
	
	/*
	$('#cssmenu ul li a').each(function(){
		var li_html = $(this).html();
		if(li_html=='Account')
		{
			$('#cssmenu ul li:nth-child(6)').addClass('active');
		}		
	});*/
});
</script>
 @endsection('content')