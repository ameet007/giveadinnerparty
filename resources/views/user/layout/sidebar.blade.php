
<aside class="col-lg-3 left-sidebar">
				<div class="sidenav-list">
					<ul>
						<li class="{{ (request()->segment(2)=='my_account')?'active':'' }}"><a href="{{Request::root()}}/user/my_account">Notifications</a></li>
						<li class="{{ (request()->segment(2)=='payment_method')?'active':'' }}"><a href="{{Request::root()}}/user/payment_method">Payment Methods</a></li>
						<li class="{{ (request()->segment(2)=='hosting_option')?'active':'' }}"><a href="{{Request::root()}}/user/hosting_option">My Hosting Option</a></li> 
						<li class="{{ (request()->segment(2)=='security')?'active':'' }}"><a href="{{Request::root()}}/user/security">Security</a></li>
					</ul>
				</div>
			</aside>