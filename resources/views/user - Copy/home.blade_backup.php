<!DOCTYPE html>
<html>
    <head>
        <title>Give A Dinner Party</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <link href="{{Request::root()}}/assets/front/css/fileuploader.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/fileuploader-theme-dragdrop.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/fileuploader-theme-dragdrop.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/owl.carousel.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/owl.theme.default.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/nav.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/bootstrap.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/main.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/media.css" rel="stylesheet" type="text/css" />
		<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    </head>
    <body>
        <header class="pro-header">
            <div class="container-fluid">
                <div class="row pro-header-top">
                    <div class="logo col-md-3 col-sm-12 col-xs-12">
                        <img src="{{Request::root()}}/assets/front/img/logo.png" alt="" />
                    </div>
                    <div class="pro-header-right col-md-9 col-sm-12 col-sm-12">
                        <div class="dropdown pull-right">
                            <a href="#" class="dropdown-toggle profile-image" data-toggle="dropdown">
                                <img src="{{Request::root()}}/assets/front/img/pro-file-img.jpg" class="img-circle special-img"> Johnson <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a href="#"><i class="fa fa-cog"></i> Account</a></li>
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
                        <li class='active'><a href='#'>Edit Profile</a></li>
                        <li><a href='#'>Inbox</a>
                            <!--<ul>
                                   <li class=''><a href='#'>Product 1</a>
                                          <ul>
                                             <li><a href='#'>Sub Product</a></li>
                                             <li><a href='#'>Sub Product</a></li>
                                          </ul>
                                   </li>
                                   <li class=''><a href='#'>Product 2</a>
                                          <ul>
                                             <li><a href='#'>Sub Product</a></li>
                                             <li><a href='#'>Sub Product</a></li>
                                          </ul>
                                   </li>
                            </ul>-->
                        </li>
                        <li><a href='#'>Notifications</a></li>
                        <li><a href='#'>My Account</a></li>
                        <li><a href='#'>My Events</a></li>
                        <li><a href='#'>My Reviews</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <section class="profile-edit">
            <div class="container">
                <div class="row per-details">
                    <div class="col-xs-12">
                        <h2>Personal Details</h2>
                    </div>
                    <div class="col-md-3">
                        <div class="pro-pic">
                            <img src="{{Request::root()}}/assets/front/img/pro-pic.jpg" alt="" />
                        </div>
                    </div>
					<input type="hidden" id="token" value="{{ csrf_token() }}">
					<input type="hidden" id="user_id" value="{{Auth::user()->id}}">
                    <div class="col-md-9">
                        <div class="per-details-right">
                            <div class="table-responsive">
                                <table class="table">
                                    <tbody>
                                        <tr>
                                            <td style="width: 25%;">Name:</td>
                                            <td style="width: 40%"><strong><span id="name">{{Auth::user()->name}} {{Auth::user()->last_name}}</span></strong><input id="name_text" type="text" style="display:none;" value="{{Auth::user()->name}} {{Auth::user()->last_name}}"/></td>
                                            <td style="width: 35%;"><a href="#/" id="edit_name" >Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td>Birth Date:</td>
                                            <td><strong><span id="dob">{{date('d M Y', strtotime(Auth::user()->dob))}}</span></strong>
												<input id="dob_text" class="datepicker" type="text" style="display:none;" value="{{date('m/d/y', strtotime(Auth::user()->dob))}}"/>
											</td>
                                            <td><a href="#/" id="edit_dob">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td>Gender:</td>
                                            <td><span id="gender_text"><strong>{{Auth::user()->gender}}</span>
												<select id="gender" style="display:none;">
													<option <?php echo (Auth::user()->gender=='Male')?'selected':''; ?> value="Male">Male</option>
													<option <?php echo (Auth::user()->gender=='Female')?'selected':''; ?> value="Female">Female</option>													
												</select>
											</strong>
												
											</td>
                                            <td><a href="#/" id="edit_gender">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td>Status:</td>
                                            <td><strong><span id="status_text">@if(!EMPTY(Auth::user()->status)) {{Auth::user()->status}} @else Not Specified @endif</span></strong>
											<input id="status" type="text" style="display:none;" value="@if(!EMPTY(Auth::user()->status)) {{Auth::user()->status}} @else  @endif"/>
											</td>
                                            <td><a href="#/" id="edit_status">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td>Biography:</td>
                                            <td><strong><span id="bio">@if(!EMPTY(Auth::user()->about)) {{Auth::user()->about}} @else Not Specified @endif</span></strong>
												<textarea id="bio_text" class="bio_text" style="display:none;" />@if(!EMPTY(Auth::user()->about)) {{Auth::user()->about}} @else Not Specified @endif</textarea>
											</td>
                                            <td><a href="#/" id="edit_bio">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td>Your Rating:</td>
                                            <td><img src="{{Request::root()}}/assets/front/img/start.png" alt="" /></td>
                                            <td>&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row con-details">
                    <h2>Contact Details</h2>
                    <p>(These Details Are Not Availble to Other Users)</p>
                    <div class="table-responsive">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td style="width: 15%;">Email:</td>
                                    <td style="width: 25%"><strong>{{Auth::user()->email}}</strong></td>
                                    <td><!--<a href="#">Edit</a>--></td>
                                </tr>
                                <tr>
                                    <td>Tel No:</td>
                                    <td><strong><span id="telephone">{{Auth::user()->telephone}}</span></strong>
										<input id="telephone_text" type="text" value="{{Auth::user()->telephone}}" style="display:none;" />
									</td>
                                    <td><a href="#/" id="telephone_edit">Edit</a></td>
                                </tr>
                                <tr>
                                    <td>Address:</td>
                                    <td><strong><span id="address_text">{{Auth::user()->address}}<br>{{Auth::user()->town}}<br>{{Auth::user()->county}}<br>{{Auth::user()->country}}<br>{{Auth::user()->postcode}}</span></strong>
										<span id="address_row" style="display:none;">
											<input id="address" type="text" value="{{Auth::user()->address}}" placeholder="address"/><br>
											<input id="town" type="text" value="{{Auth::user()->town}}" placeholder="town"/><br>
											<input id="county" type="text" value="{{Auth::user()->county}}" placeholder="county"/><br>
											<input id="country" type="text" value="{{Auth::user()->country}}" placeholder="country"/><br>
											<input id="postcode" type="text" value="{{Auth::user()->postcode}}" placeholder="postcode"/>											
										</span>
									</td>
                                    <td><a href="#/" id="edit_address">Edit</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row con-details a-little">
                    <h2>A little More About You..</h2>
                    <div class="table-responsive">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td style="width: 15%;">Profession:</td>
                                    <td style="width: 25%"><strong><span id="profession_text">@if(!EMPTY(Auth::user()->profession)) {{Auth::user()->profession}} @else Not Specified @endif</span></strong>
										<input id="profession" type="text" style="display:none;" value="@if(!EMPTY(Auth::user()->profession)) {{Auth::user()->profession}} @else Not Specified @endif" />
									</td>
                                    <td><a href="#/" id="edit_profession">Edit</a></td>
                                </tr>
                                <tr>
                                    <td>Education:</td>
                                    <td><strong><span id="education_text">@if(!EMPTY(Auth::user()->education)) {{Auth::user()->education}} @else Not Specified @endif</span></strong>
									<input id="education" type="text" style="display:none;" value="@if(!EMPTY(Auth::user()->education)) {{Auth::user()->education}} @else  @endif" />	
									</td>
                                    <td><a href="#/" id="edit_education">Edit</a></td>
                                </tr>
                                <tr>
                                    <td>Religion:</td>
                                    <td><strong><span id="religion_text">@if(!EMPTY(Auth::user()->religion)) {{Auth::user()->religion}} @else Not Specified @endif</span></strong>
									<input id="religion" type="text" style="display:none;" value="@if(!EMPTY(Auth::user()->religion)) {{Auth::user()->religion}} @else @endif" />
									</td>
                                    <td><a href="#/" id="edit_religion">Edit</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row spo-lang">
                    <div class="table-responsive spokenlanguage">
						<input type="hidden" id="spokenlanguage_data" value="{{ Auth::user()->spoken_languages }}">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td style="width: 15%"><strong>Spoken Language:</strong></td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Arabic" /> Arabic
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Bengali"/> Bengali
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Czech"/> Czech
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Dutch"/> Dutch
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="English"/> English
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="French"/> French
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="German"/> German
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Greek"/> Greek
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Hindi"/> Hindi
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Italian"/> Italian
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Japanese"/> Japanese
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Korean"/> Korean
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Malay" /> Malay
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Mandarin"/> Mandarin
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Polish"/> Polish
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Portuguese"/> Portuguese
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Punjabi"/> Punjabi
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Romanian"/> Romanian
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Russian"/> Russian
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Spanish" /> Spanish
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Swedish"/> Swedish
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Thai"/> Thai
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Turkish"/> Turkish
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Ukrainian" /> Ukrainian
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Vietnamese" /> Vietnamese
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row spo-lang hob-interest">
                    <div class="table-responsive hobbies" >
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td style="width: 15%"><strong>Hobbies &amp; Interest</strong></td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Socialising & Friendship" /> Socialising & Friendship
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Dating" /> Dating
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Travel & Culture" /> Travel & Culture
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Kids & Parenting" /> Kids & Parenting
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Charity & Fundraising" /> Charity & Fundraising
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Religion & Spirituality" /> Religion & Spirituality
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Meditation, Yoga & Healing" /> Meditation, Yoga & Healing
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Board Games" /> Board Games
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Video Games" /> Video Games
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Card Games" /> Card Games
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Art & Antiques" /> Art & Antiques
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Crafts & Hobbies" /> Crafts & Hobbies
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Reading & Writing" /> Reading & Writing
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Tv & Cinema" /> Tv & Cinema
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Instruments & Singing" /> Instruments & Singing
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Listening To Music" /> Listening To Music
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Dancing" /> Dancing
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Sports & Fitness" /> Sports & Fitness
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Outdoor Pursuits" /> Outdoor Pursuits
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Cars & Motorcycles" /> Cars & Motorcycles
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Food & Drink" /> Food & Drink
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Vegetarian & Vegan" /> Vegetarian & Vegan
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Celebrations & Events" /> Celebrations & Events
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Hair & Beauty" /> Hair & Beauty
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Home Decor & Interior Design" /> Home Decor & Interior Design
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Animals & Pets" /> Animals & Pets
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Science & Nature" /> Science & Nature
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Gardening" /> Gardening
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Photography & Videography" /> Photography & Videography
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Entrepreneurship & Business" /> Entrepreneurship & Business
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>



        <footer class="footer">
            <div class="footer-top">
                <div class="container">
                    <div class="row">
                        <div class="one-fourth">
                            <h3>About Us</h3>
                            <ul>
                                <li><a href="#">Frequently Asked Questions</a></li>
                                <li><a href="#">Trust</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">About Us</a></li>
                            </ul>
                        </div>
                        <div class="one-fourth">
                            <h3>Company Pages</h3>
                            <ul>
                                <li><a href="#">Terms &amp; Conditions</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Refunds</a></li>
                                <li><a href="#">Contact Us</a></li>
                            </ul>
                        </div>
                        <div class="one-fourth">
                            <h3>Social Media</h3>
                            <div class="social">
                                <ul>
                                    <li>
                                        <a href="https://www.facebook.com/" target="_blank">
                                            <i class="fa fa-facebook" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://twitter.com/" target="_blank">
                                            <i class="fa fa-twitter" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.linkedin.com/" target="_blank">
                                            <i class="fa fa-linkedin" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!--<div class="one-fourth">
                                <h3>Connect With Us</h3>
                                <div class="news-letter">
                                        <input placeholder="Name" type="text" />
                                        <input placeholder="Email" type="email" />
                                </div>
                                <a href="#" class="btn2">Yes Please</a>
                        </div>-->
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="container">
                    <p>Copyright &copy; 2017 Give A Dinner Party. Design by: Neurons-It</p>
                </div>
            </div>
        </footer>
        <script src="{{Request::root()}}/assets/front/js/jQuery.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/fileuploader.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/fileuploader.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/custom.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/bxslider.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/owl.carousel.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/bootstrap.min.js" type="text/javascript"></script>
		
		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
        <script type="text/javascript">
		$(function(){	$( ".datepicker" ).datepicker({ dateFormat: 'mm/dd/yy' }); } );
        $(document).ready(function () {
            $('.owl-carousel').owlCarousel({
                loop: true,
                margin: 15,
                dots: false,
                nav: true,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 2
                    },
                    1000: {
                        items: 3
                    },
                    1100: {
                        items: 4
                    }
                }
            })
        });
        
        $(document).on('click','#edit_name',function(){
            var name = $('#name').html();
			var name_text = $('#name_text').val();
            $('#name').toggle();
            //$('#name_text').val(name);
            $('#name_text').toggle();
            if($(this).html() == "Edit")
			{				
                $(this).html('Save');
            }
            else
			{
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();				
				
				var full_name_split = name_text.split(" ");
				var first_name = full_name_split[0];
				var lname = full_name_split.length > 1 ? full_name_split[full_name_split.length - 1] : null;
				
				$.ajax({
					url: '<?php echo url('/admin/ajax_user_update'); ?>',
					type: 'POST',
					data : { '_token': token, id : user_id, name : first_name, last_name:lname },
					//dataType: 'JSON',
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#name').html(name_text);
                $(this).html('Edit');
            }
        })
		
		$(document).on('click','#edit_dob',function(){
            var dob = $('#dob').html();
            $('#dob').toggle();
            //$('#dob_text').val(dob);
            $('#dob_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{					
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();		
				var dob_text = $('.datepicker').val();
				if(dob_text!="")
				{	
					$.ajax({
						url: '<?php echo url('/admin/ajax_user_update'); ?>',
						type: 'POST',
						data : { '_token': token, id : user_id, dob : dob_text },
						//dataType: 'JSON',
						success: function(data)
						{
							//alert(dob_text);
							console.log(data);
						},
						error: function(xhr, ajaxOptions, thrownError)
						{
							alert(xhr.status);
						},	
					});
					
					$('#dob').html(dob_text);
					$(this).html('Edit');
				}
            }
        })
		
		$(document).on('click','#edit_bio',function(){
            var bio = $('#bio').html();
            $('#bio').toggle();
			//$('#bio_text').val(bio);
            $('#bio_text').toggle();
            if($(this).html() == "Edit"){
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var bio_text = $('.bio_text').val();				
				$.ajax({
					url: '<?php echo url('/admin/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, about:bio_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(bio_text);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#bio').html(bio_text);
                $(this).html('Edit');
            }
        })
		
		
		$(document).on('click','#telephone_edit',function(){
            var telephone = $('#telephone').html();
            $('#telephone').toggle();
            $('#telephone_text').toggle();
            if($(this).html() == "Edit"){
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var telephone_text = $('#telephone_text').val();				
				$.ajax({
					url: '<?php echo url('/admin/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, telephone:telephone_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#telephone').html(telephone_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		$(document).on('click','#edit_profession',function(){
            var profession = $('#profession').html();
            $('#profession').toggle();
            $('#profession_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var profession_text = $('#profession').val();				
				$.ajax({
					url: '<?php echo url('/admin/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, profession:profession_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#profession_text').html(profession_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		
		$(document).on('click','#edit_education',function(){
            var education = $('#education').html();
            $('#education').toggle();
            $('#education_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var education_text = $('#education').val();				
				$.ajax({
					url: '<?php echo url('/admin/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, education:education_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#education_text').html(education_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		$(document).on('click','#edit_religion',function(){
            var religion = $('#religion').html();
            $('#religion').toggle();
            $('#religion_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var religion_text = $('#religion').val();				
				$.ajax({
					url: '<?php echo url('/admin/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, religion:religion_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#religion_text').html(religion_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		$(document).on('click','#edit_status',function(){
            var status = $('#status').html();
            $('#status').toggle();
            $('#status_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var status_text = $('#status').val();				
				$.ajax({
					url: '<?php echo url('/admin/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, status:status_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#status_text').html(status_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		$(document).on('click','#edit_address',function(){
           // var name = $('#name').html();
            $('#address_text').toggle();
            //$('#name_text').val(name);
            $('#address_row').toggle();
            if($(this).html() == "Edit"){
                $(this).html('Save');
            }
            else
			{
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				
				var address = $('#address').val();
				var town = $('#town').val();
				var county = $('#county').val();
				var country = $('#country').val();
				var postcode = $('#postcode').val();
				
				$.ajax({
					url: '<?php echo url('/admin/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, address:address, town:town, county:county, country:country, postcode:postcode },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				$('#address_text').html(address+'<br>'+town+'<br>'+county+'<br>'+country+'<br>'+postcode);
                $(this).html('Edit');
            }
        })
		
		
		$(document).on('click','#edit_gender',function(){
            var gender = $('#gender').html();
            $('#gender').toggle();
            $('#gender_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var gender_text = $('#gender').val();				
				$.ajax({
					url: '<?php echo url('/admin/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, gender:gender_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#gender_text').html(gender_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		/*
		$(document).on('click','#edit_name',function(){
            var name = $('#name').html();
            $('#name').toggle();
            $('#name_text').val(name);
            $('#name_text').toggle();
            if($(this).html() == "Edit"){
                $(this).html('Save');
            }
            else{
                $(this).html('Edit');
            }
        })*/		
		
		
		$('.spokenlanguage').find('input[type=checkbox]').click(function(event) {
			var values = {};
			$('input:checkbox:checked').each(function() {
				if (values[this.title])
				  values[this.title].push(this.value);
				else
				  values[this.title] = [this.value];
			});
			
			var token = $('#token').val(); 
			var user_id = $('#user_id').val();
			var languages = JSON.stringify(values).replace('{"":[', '[').replace(']}', ']');				
			$.ajax({
				url: '<?php echo url('/admin/ajax_user_update'); ?>',
				type: 'POST',
				data : {'_token': token, id : user_id, spoken_languages:languages },
				//dataType: 'JSON',
				cache: false,
				success: function(data)
				{
					//alert(data);
					console.log(data);
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					alert(xhr.status);
				},	
			});			
		});	
		
		$('.hobbies').find('input[type=checkbox]').click(function(event) {
			var values = {};
			$('input:checkbox:checked').each(function() {
				if (values[this.title])
				  values[this.title].push(this.value);
				else
				  values[this.title] = [this.value];
			});
			
			var token = $('#token').val(); 
			var user_id = $('#user_id').val();
			var hosting_option_data = JSON.stringify(values).replace('{"":[', '[').replace(']}', ']');	
			$.ajax({
				url: '<?php echo url('/admin/ajax_user_update'); ?>',
				type: 'POST',
				data : {'_token': token, id : user_id, hosting_option:hosting_option_data },
				//dataType: 'JSON',
				cache: false,
				success: function(data)
				{
					//alert(data);
					console.log(data);
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					alert(xhr.status);
				},	
			});			
		});
		
		$(document).ready(function(){			
			var language_data = {!! Auth::user()->spoken_languages !!};
			$('.spokenlanguage input[type=checkbox]').each(function(){
				var checked = false;
				for(var i=0; i<language_data.length; i++){					
					if($(this).val() == language_data[i]){
						$(this).prop('checked',true);
					}
				}
			})
			
			var hosting_option = {!! Auth::user()->hosting_option !!};
			$('.hobbies input[type=checkbox]').each(function(){
				var checked = false;
				for(var i=0; i<hosting_option.length; i++){					
					if($(this).val() == hosting_option[i]){
						$(this).prop('checked',true);
					}
				}
			})
		})
		
        </script>
    </body>
</html>