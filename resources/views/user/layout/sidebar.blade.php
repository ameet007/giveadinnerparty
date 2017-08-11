
<aside class="col-lg-3 left-sidebar">
				<div class="sidenav-list">
				
				<ul>
						<li class="{{ (request()->segment(2)=='notifications')?'active':'' }}"><a href="{{Request::root()}}/user/notifications">Your Notifications</a></li>
						<li class="{{ (request()->segment(2)=='my_account')?'active':'' }}"><a href="{{Request::root()}}/user/my_account">Notifications Settings</a></li>
						<li class="{{ (request()->segment(2)=='host_verification')?'active':'' }}"><a href="{{Request::root()}}/user/host_verification">Verify Me</a></li>
						<li class="{{ (request()->segment(2)=='payment_method')?'active':'' }}"><a href="{{Request::root()}}/user/payment_method">Payout Method</a></li>
						<li class="{{ (request()->segment(2)=='security')?'active':'' }}"><a href="{{Request::root()}}/user/security">Security</a></li>
						<li class=""><a href="#">Privacy Settings</a></li>
						<li class="{{ (request()->segment(2)=='close_account')?'active':'' }}"><a href="{{Request::root()}}/user/close_account">Close Account</a></li>
						<li class="{{ (request()->segment(2)=='transaction_history')?'active':'' }}"><a href="{{ Request::root() }}/user/transaction_history">Transaction History</a></li>
					</ul>
				
					<?php /* ?>
					<ul>
					
						<li class="{{ (request()->segment(2)=='my_account')?'active':'' }}"><a href="{{Request::root()}}/user/my_account">Notifications</a></li>
						<li class="{{ (request()->segment(2)=='payment_method')?'active':'' }}"><a href="{{Request::root()}}/user/payment_method">Payment Methods</a></li>
						<li class="{{ (request()->segment(2)=='hosting_option')?'active':'' }}"><a href="{{Request::root()}}/user/hosting_option">My Hosting Option</a></li> 
						<li class="{{ (request()->segment(2)=='security')?'active':'' }}"><a href="{{Request::root()}}/user/security">Security</a></li>
						<li class="{{ (request()->segment(2)=='host_verification')?'active':'' }}"><a href="{{Request::root()}}/user/host_verification">Voluntary Verification</a></li>
					</ul><?php */ ?>
				</div>
			</aside>