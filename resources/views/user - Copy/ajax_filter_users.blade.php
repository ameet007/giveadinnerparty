@foreach($users as $user)
<div class="item col-md-4">
						<div class="parties-wrap">
							<div class="parties-head">
								<div class="event-mf">
									<i class="fa fa-male" aria-hidden="true"></i>
									<p>Men only</p>
								</div>
							</div>
							<div class="parties-host">
								<div class="hosted-by">
									<div class="content">
										<strong>{{ $user->name }},</strong>
										<span>Aged: <strong><?php echo (date('Y') - date('Y',strtotime($user->dob))); ?></strong></>
										<p>{{ $user->town }}, {{ $user->country }}</p>
										<div class="img">
											<div class="inner">
												<div class="circle-img"></div>
												<img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="" />
											</div>
											<div class="rateyo-readonly-widg"></div><span class="re-view">(17)</span>
										</div>
										<div class="tow-btn">
											<button class="btn2" onclick="return inviteuser('<?php echo $user->id; ?>','<?php echo $user->name.' '.$user->last_name; ?>');" >Accept</button>
											<button user_id="{{ $user->id }}" class="grey-btn followuser">Follow</button>
										</div>
									</div>	
								</div>
							</div>
						</div>
					</div>		
@endforeach

<script>
$(document).ready(function()
{
	$('.followuser').each(function(){
            var id = $(this).attr('user_id');
            $.ajax({
                url: '{{Request::root()}}/user/follow/'+id,
                type: 'get',
                data: {'type':'check_follow'},
                success: function(result){
                    $('.followuser[user_id='+id+']').html(result);
                }
            })
        })
	
	$('.followuser').click(function()
	{
		var uid = $(this).attr('user_id');
		 $.ajax({
                url: '{{Request::root()}}/user/follow/'+uid,
                type: 'get',
                data: {'type':'follow'},
                success: function(result){
                    $('.followuser[user_id='+uid+']').html(result);
                }
            })
	});
	
})
</script>