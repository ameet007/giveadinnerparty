 <ul>
    <li class='{{ (request()->segment(2)=='create_event')?'active':'' }}'><a href='{{Request::root()}}/user/create_event'>Host New Event</a></li>
    <li class='{{ (request()->segment(2)=='my_active_event')?'active':'' }}'><a href='{{Request::root()}}/user/my_active_event'>Your Active Events</a></li>
    <li class='{{ (request()->segment(2)=='my_ended_event')?'active':'' }}'><a href='{{Request::root()}}/user/my_ended_event'>Your Ended Events</a></li>
    <li class='{{ (request()->segment(2)=='verify_host')?'active':'' }}'><a href='{{Request::root()}}/user/host_verification'>Verify Me</a></li>
	
	<?php if(request()->segment(2)=='invite_friends' OR request()->segment(2)=='my_active_event'){ ?>
	<li class""><a href="{{Request::root()}}/user/payment_method">Payout Method</a></li>
	<?php } ?>
	
	<li class='{{ (request()->segment(2)=='friend_payment_link')?'active':'' }}'><a href='{{Request::root()}}/user/friend_payment_link'>Friend Payment Link</a></li>
    <li class='{{ (request()->segment(2)=='invite_friends')?'active':'' }}'><a href='{{Request::root()}}/user/invite_friends'>Invite Users</a></li>
</ul>
			<script>
$(document).ready(function(){
	$('#cssmenu ul li:nth-child(3)').addClass('active');
});
</script>
			