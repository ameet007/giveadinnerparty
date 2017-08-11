<div class="modal fade popup1" id="myModal" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-body">
                <button type="button" class="close" data-dismiss="modal"><img src="{{Request::root()}}/assets/front/img/close-btn.png" alt="" /></button>
                <div class="signup">
                    <h2>You’re Almost Done</h2>
                    <h5>Take 30 seconds to fill in your details and start being part of our community of fun and meaningful dinner parties</h5>
                    <h4><a href="{{Request::root()}}/login/facebook"><button class="btn2 face"><i class="fa fa-facebook" aria-hidden="true"></i> Continue with Facebook</button></a></h4>
                    <div class="singup-info">
                        <form id="demo-form" data-parsley-validate="" method="post" action = '{{Request::root()}}/user/registeration'>
                            <input type="hidden" name="_token" value="{{csrf_token()}}" />
                            <div class="main-feild">
                                <input type="text" class="text" name="name" value="" placeholder="First Name" id="name" required>
                                <input type="text" name="last_name" class="text" value="" placeholder="Last Name" id="last_name" required>
                            </div>
                            <div class="users">
								<p>This email will never be shown in public</p>
                                <input type="email" class="text" name="email" value="" placeholder="Your Best Email Address" id="email" required>
                                <p>Don’t forget it, you will use it to login</p>
                                <input type="password" class="text" name="password" value="" placeholder="Enter Your Desired Password" id="password" required>
                                <p>Date of Birth</p>
								<div class="feild">
									<ul>
										<li class="day">		
											<select class="select" name="birthday" required>
												<option value="">Day</option>
												<option value="1">1</option>
												<option value="2">2</option>
												<option value="3">3</option>
												<option value="4">4</option>
												<option value="5">5</option>
												<option value="6">6</option>
												<option value="7">7</option>
												<option value="8">8</option>
												<option value="9">9</option>
												<option value="10">10</option>
												<option value="11">11</option>
												<option value="12">12</option>
												<option value="13">13</option>
												<option value="14">14</option>
												<option value="15">15</option>
												<option value="16">16</option>
												<option value="17">17</option>
												<option value="18">18</option>
												<option value="19">19</option>
												<option value="20">20</option>
												<option value="21">21</option>
												<option value="22">22</option>
												<option value="23">23</option>
												<option value="24">24</option>
												<option value="25">25</option>
												<option value="26">26</option>
												<option value="27">27</option>
												<option value="28">28</option>
												<option value="29">29</option>
												<option value="30">30</option>
												<option value="31">31</option>
											</select>
										</li>
										<li class="month">		
											<select class="select" name="birthmonth" required>
												<option value="">Month</option>
												<option value="1">Janaury</option>
												<option value="2">February</option>
												<option value="3">March</option>
												<option value="4">April</option>
												<option value="5">May</option>
												<option value="6">June</option>
												<option value="7">July</option>
												<option value="8">August</option>
												<option value="9">September</option>
												<option value="10">October</option>
												<option value="11">November</option>
												<option value="12">December</option>
											</select>
										</li>
										<li class="year">		
											<select id="birthyear" name="birthyear" class="select" required>
												<option value="">Year</option>
												<option value="2016">2017</option>
												<option value="2016">2016</option>
												<option value="2015">2015</option>
												<option value="2014">2014</option>
												<option value="2013">2013</option>
												<option value="2012">2012</option>
												<option value="2011">2011</option>
												<option value="2010">2010</option>
												<option value="2009">2009</option>
												<option value="2008">2008</option>
												<option value="2007">2007</option>
												<option value="2006">2006</option>
												<option value="2005">2005</option>
												<option value="2004">2004</option>
												<option value="2003">2003</option>
												<option value="2002">2002</option>
												<option value="2001">2001</option>
												<option value="2000">2000</option>
												<option value="1999">1999</option>
												<option value="1998">1998</option>
												<option value="1997">1997</option>
												<option value="1996">1996</option>
												<option value="1995">1995</option>
												<option value="1994">1994</option>
												<option value="1993">1993</option>
												<option value="1992">1992</option>
												<option value="1991">1991</option>
												<option value="1990">1990</option>
												<option value="1989">1989</option>
												<option value="1988">1988</option>
												<option value="1987">1987</option>
												<option value="1986">1986</option>
												<option value="1985">1985</option>
												<option value="1984">1984</option>
												<option value="1983">1983</option>
												<option value="1982">1982</option>
												<option value="1981">1981</option>
												<option value="1980">1980</option>
												<option value="1979">1979</option>
												<option value="1978">1978</option>
												<option value="1977">1977</option>
												<option value="1976">1976</option>
												<option value="1975">1975</option>
												<option value="1974">1974</option>
												<option value="1973">1973</option>
												<option value="1972">1972</option>
												<option value="1971">1971</option>
												<option value="1970">1970</option>
												<option value="1969">1969</option>
												<option value="1968">1968</option>
												<option value="1967">1967</option>
												<option value="1966">1966</option>
												<option value="1965">1965</option>
												<option value="1964">1964</option>
												<option value="1963">1963</option>
												<option value="1962">1962</option>
												<option value="1961">1961</option>
												<option value="1960">1960</option>
												<option value="1959">1959</option>
												<option value="1958">1958</option>
												<option value="1957">1957</option>
												<option value="1956">1956</option>
												<option value="1955">1955</option>
												<option value="1954">1954</option>
												<option value="1953">1953</option>
												<option value="1952">1952</option>
												<option value="1951">1951</option>
												<option value="1950">1950</option>
											</select>
										</li>
									</ul>
								</div>
                                <select class="select" name="gender" required>
                                    <option value="">Select You Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                                <select  name="country" class="select" required>
									<option value="">Country You’re In?</option>
									@foreach($country_list as $country)
                                    <option value="{{$country->title}}">{{$country->title}}</option>
									 @endforeach
                                </select>
                                <input type="text" class="text" name="postcode" value="" placeholder="Enter Your Postcode" required>
                            </div>
                        
							<div class="align-center">
								<input  type="submit" class="btn2" value="Let’s Party">
								<p><a id="login-in" href="#/">Already have an account?</a></p>
							</div>
						</form>
                        <div class="clear"> </div>
                    </div>
                </div>
                <div class="login">
                    <h2>Login</h2>
                    <form method="post" action="{{ url('/user/login') }}">
						<input type="hidden" name="_token" value="{{csrf_token()}}" />
						<div class="login-info">
							<input type="text" class="text" value="" name="email" placeholder="email"/>
							<input type="password" value="" name="password" placeholder="******" />
							<div class="fot-got clearfix">
								<div class="pull-left">
									<label>
										<input type="checkbox" /> Remember me
									</label>
								</div>
								<div class="pull-right">
									<p><a href="#">Forgot your password?</a></p>	
								</div>
							</div>
							<div class="align-center">
								<input class="btn2" type="submit" value="login" />
								<p>Or</p>
								<a href="{{Request::root()}}/login/facebook"><button type="button" class="btn2 face"><i class="fa fa-facebook" aria-hidden="true"></i> Continue with Facebook</button></a>
								<p>Don’t have an account?</p>
								<button type="button" class="btn" onclick="showLogin();">Join</button>
							</div>
						</div>
                    </form>
                </div>
               
            </div>
        </div>

    </div>
</div>
<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="logo">
        <div class="relative-logo">
            <img src="{{Request::root()}}/assets/front/img/logo.png" alt="logo">
        </div>
    </div>
    <div class="container">
        <div class="row">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>
            <div class="col-md-5 col-sm-12 col-xs-12">
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
            <div class="navbar-collapse collapse" aria-expanded="false" style="height: 2px;">
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="#/">About Us</a></li>
                    <li><a href="#/">Become a Host</a></li>
					<?php if(Auth::guard('user')->check()){ ?>
                    <li><a href="{{Request::root()}}/user/my_account">My Account</a> <a>/</a> <a href="{{Request::root()}}/user/logout">Logout</a></li>
					<?php }else{ ?>
					<li><a onclick="showLogin()" href="#/">Login / <strong>Sign Up</strong></a></li>
					<?php } ?>
                </ul>
				
            </div><!--/.nav-collapse -->
        </div>
    </div><!--/.container -->
</nav>
