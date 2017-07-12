<header class="pro-header">
	<div class="container-fluid">
		<div class="row pro-header-top">
			<div class="logo col-md-1 col-sm-12 col-xs-12">
                            <a href="{{Request::root()}}"><img src="{{Request::root()}}/assets/front/img/logo.png" alt="" /></a>
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
			<div class="pro-header-right col-md-6 col-sm-12 col-sm-12">
                        <div class="dropdown pull-right">
                            <a href="#" class="dropdown-toggle profile-image" data-toggle="dropdown">
                                <img src="{{Request::root()}}/assets/front/img/pro-file-img.jpg" class="img-circle special-img"> {{Auth::guard('user')->user()->name}} <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a href="{{Request::root()}}/user/my_account"><i class="fa fa-cog"></i> Account</a></li>
                                <li class="divider"></li>
                                <li><a href="{{Request::root()}}/user/logout"><i class="fa fa-sign-out"></i> Sign-out</a></li>
                            </ul>
                            <a href="{{Request::root()}}/user/logout">Log Out</a>
                        </div>
                        <div class="tow-notification pull-right">
                            <a href="#">
                                <i class="fa fa-envelope" aria-hidden="true"></i><sup>1</sup>
                            </a>
                            <a href="#">
                                <i class="fa fa-globe" aria-hidden="true"></i><sup>1</sup>
                            </a>
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
                        <li class="{{ (request()->segment(2)=='edit_profile')?'active':'' }}"><a href='{{Request::root()}}/user/edit_profile'>Edit Profile</a></li>
                        <li class="{{ (request()->segment(2)=='inbox' || request()->segment(2)=='chat' || request()->segment(2)=='compose')?'active':'' }}"><a href='{{Request::root()}}/user/inbox'>Inbox</a></li>
                        <li class="{{ (request()->segment(2)=='notifications')?'active':'' }}"><a href='{{Request::root()}}/user/notifications'>Notifications</a></li>
                        <li class="{{ (request()->segment(2)=='my_account')?'active':'' }}"><a href='{{Request::root()}}/user/my_account'>My Account</a></li>
                        <li class="{{ (request()->segment(2)=='my_events' || request()->segment(2)=='create_event')?'active':'' }}"><a href='{{Request::root()}}/user/my_events'>My Events</a></li>  
                        <li class="{{ (request()->segment(2)=='public_profile')?'active':'' }}"><a href='{{Request::root()}}/user/public_profile'>My Public Profile</a></li>
                        <li class="{{ (request()->segment(2)=='invite_friends')?'active':'' }}"><a href='{{Request::root()}}/user/invite_friends'>Invite Friends</a></li>
                    </ul>
                </div>
            </div>
        </nav>