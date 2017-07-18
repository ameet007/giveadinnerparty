<header class="pro-header">
	<div class="container-fluid">
		<div class="row pro-header-top">
			<div class="logo">
				<img src="{{Request::root()}}/assets/front/img/logo.png" alt="" />
			</div>
			<div class="col-md-5 col-sm-12 col-xs-12 hea-search">
				<div class="input-group">
				   <div class="input-group-btn search-panel">
						<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
							<span id="search_concept">Search events</span> <span class="caret"></span>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li><a href="#its_equal">Search events</a></li>
							<li><a href="#contains">Search users</a></li>
						</ul>
					</div>
					<input type="hidden" name="search_param" value="all" id="search_param">         
					<input type="text" class="form-control" name="x" placeholder="Enter town or postcode">
					<span class="input-group-btn">
						<button class="btn btn-default" type="button"><span class="glyphicon glyphicon-search"></span></button>
					</span>
				</div>
			</div>
			<div class="pro-header-right col-md-6 col-sm-12 col-sm-12 pull-right">
				<div class="tow-notification pull-right">
					<a href="{{Request::root()}}/user/create_event">Become A Host</a>
					<span class="dropdown">
						<a href="#" class="dropdown-toggle profile-image" data-toggle="dropdown">Events <b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li><a href="{{Request::root()}}/user/your_hosting">Your Hosting</a></li>
							<li><a href="{{Request::root()}}/user/invite_friends">Invite To My Event</a></li>
							<li><a href="#">Followed Events</a></li>
							<li><a href="#">Awaiting Approval/Purchase</a></li>
							<li><a href="#">Booked Events</a></li>
						</ul>
					</span>
					<a href="#">
						<i class="fa fa-envelope" aria-hidden="true"></i><sup>1</sup>
					</a>
					<a href="#">
						<i class="fa fa-globe" aria-hidden="true"></i><sup>1</sup>
					</a>
					<span class="dropdown">
						<a href="#" class="dropdown-toggle profile-image" data-toggle="dropdown">Help <b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li><a href="#">How It Works</a></li>
							<li><a href="#">Why We Launched</a></li>
							<li><a href="#">Frequently Asked Questions (FAQ’s)</a></li>
						</ul>
					</span>
					<span class="dropdown">
						<a href="#" class="dropdown-toggle profile-image" data-toggle="dropdown">
							<div class="por-file">
								<div class="over-lay"></div>
								<img src="{{Request::root()}}/assets/front/img/pro-file-img.jpg" class="special-img" height="50px" width="50px" />
							</div> Johnson <b class="caret"></b>
						</a>
						<ul class="dropdown-menu">
							<li><a href="{{Request::root()}}/user/edit_profile">Edit Profile</a></li>
							<li><a href="{{Request::root()}}/user/public_profile">My Public Profile</a></li>
							<li><a href="{{Request::root()}}/user/my_account">Account Settings</a></li>
							<li><a href="{{Request::root()}}/user/logout">Sign Out</a></li>
						</ul>
					</span>
				</div>
			</div>
		</div>
	</div>
</header>
<nav class="navigation">
    <div class="container">
        <div id='cssmenu'>
            <ul>
                <li class="{{ (request()->segment(2)=='home')?'active':'' }}"><a href='{{Request::root()}}/user/home'>Home</a></li>
                <li class="{{ (request()->segment(2)=='inbox' || request()->segment(2)=='chat' || request()->segment(2)=='compose')?'active':'' }}"><a href='{{Request::root()}}/user/inbox'>Inbox</a></li>
                <li class="{{ (request()->segment(2)=='your_hosting')?'active':'' }}"><a href='{{Request::root()}}/user/your_hosting'>Your Hosting</a></li>
                <li class="{{ (request()->segment(2)=='my_events')?'active':'' }}"><a href='{{Request::root()}}/user/my_events'>Events</a></li>
                <li class="{{ (request()->segment(2)=='public_profile')?'active':'' }}"><a href='{{Request::root()}}/user/public_profile'>Profile</a></li>
                <li class="{{ (request()->segment(2)=='my_account')?'active':'' }}"><a href='{{Request::root()}}/user/my_account'>Account</a></li>
            </ul>
        </div>
    </div>
</nav>