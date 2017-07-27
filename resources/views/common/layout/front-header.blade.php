<div class="modal fade popup1" id="myModal" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-body">
                <button type="button" class="close" data-dismiss="modal"><img src="{{Request::root()}}/assets/front/img/close-btn.png" alt="" /></button>
                <div class="signup">
                    <h2>You’re Almost Done</h2>
                    <h5>Take 30 seconds to fill in your details and start being part of our community of fun and meaningful dinner parties</h5>
                    <h4><a href="{{Request::root()}}/login/facebook"><img src="{{Request::root()}}/assets/front/img/facebook-login.png" alt="" /></a></h4>
                    <div class="singup-info">
                        <form action = '{{Request::root()}}/giveadinnerparty/public/user/login'>
                            <input type="hidden" name="_token" value="{{csrf_token()}}" />
                            <div class="main-feild">
                                <input type="email" class="text" name="email" value="First Name" >
                                <input type="password" name="password" class="text" value="Last Name">
                            </div>
                            <div class="users">
                                <input type="text" class="text" value="Your Best Email Address" onfocus="this.value = '';" onblur="if (this.value == '') {
                                            this.value = 'Your Best Email Address';}">
                                <p>This email will never be shown in public</p>
                                <input type="text" class="text" value="Enter Your Desired Password" onfocus="this.value = '';" onblur="if (this.value == '') {
                                            this.value = 'Enter Your Desired Password';
                                        }">
                                <p>Don’t forget it, you will use it to login;</p>
                                <div class="input-group date demo-1">
                                    <input type="text" value="Enter Your Date of Birth"><span class="input-group-addon"></span>
                                </div>
                                <p>We never give out your DOB</p>
                                <select class="select">
                                    <option selected="selected">Select You Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                                <select class="select">
                                    <option selected="selected">Country You’re In?</option>
                                    <option>Country1</option>
                                    <option>Country2</option>
                                </select>
                                <input type="text" class="text" value="Enter Your Postcode" onfocus="this.value = '';" onblur="if (this.value == '') {
                                            this.value = 'Enter Your Postcode';
                                        }">
                            </div>
                        </form>
                        <div class="align-center">
                            <input id="last-step" type="submit" class="btn2" value="Let’s Party">
                            <p><a id="login-in" href="#/">Already have an account?</a></p>
                        </div>
                        <div class="clear"> </div>
                    </div>
                </div>
                <div class="login">
                    <h2>Login</h2>
                    <form method="post" action = "{{ url('/user/login') }}">
                    <input type="hidden" name="_token" value="{{csrf_token()}}" />
                    <div class="login-info">
                        <input type="text" class="text" value="" name="email" />
                        <input type="password" value="" name="password" />
                        <div class="align-center">
                            <input class="btn2" type="submit" value="login" />
                            <p><a href="#">Forgot your password?</a></p>
                        </div>
                    </div>
                        </form>
                </div>
                <div class="last-step">
                    <h2>You’re Almost Done</h2>
                    <h5>Fill out the rest of these details, and you’re in!</h5>
                    <div class="singup-info">
                        <form>
                            <div class="users">
                                <div class="input-group date demo-1">
                                    <input type="text" value="Enter Your Date of Birth"><span class="input-group-addon"></span>
                                </div>
                                <select class="select">
                                    <option selected="selected">Select You Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                                <select class="select">
                                    <option selected="selected">Country You’re In?</option>
                                    <option>Country1</option>
                                    <option>Country2</option>
                                </select>
                                <input type="text" class="text" value="Enter Your Postcode" onfocus="this.value = '';" onblur="if (this.value == '') {
                                            this.value = 'Enter Your Postcode';}">
                            </div>
                        </form>
                        <div class="align-center">
                            <input type="submit" class="btn2" value="Let’s Party">
                        </div>
                        <div class="clear"> </div>
                    </div>
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
                    <li><a onclick="showLogin()" href="#/">Login / <strong>Sign Up</strong></a></li>
                </ul>
            </div><!--/.nav-collapse -->
        </div>
    </div><!--/.container -->
</nav>
