@extends('user.layout.fronLayout')
@section('content')
<section class="complete-pro">
    <div class="container">
        <h2>Complete Your Profile</h2>
		@if(Session::has('flash_message'))
				{!! session('flash_message') !!}
		@endif
        <div class="row bs-wizard" style="border-bottom:0;">
            <div class="col-xs-3 bs-wizard-step <?= (Auth::guard('user')->user()->confirmed == 1) ? 'complete': '' ?>">
                <!--<div class="text-center bs-wizard-stepnum">Step 1</div>-->
                <div class="progress"><div class="progress-bar"></div></div>
                <a href="#" class="bs-wizard-dot"></a>
                <div class="bs-wizard-info text-center">
                    <h3>25%</h3>
                    <h4>Verify<br/> Your Email</h4>
                </div>
            </div>

            <div class="col-xs-3 bs-wizard-step <?= (Auth::guard('user')->user()->photos != '') ? 'complete': '' ?>"><!-- complete -->
                <div class="progress"><div class="progress-bar"></div></div>
                <a href="#" class="bs-wizard-dot"></a>
                <div class="bs-wizard-info text-center">
                    <h3>50%</h3>
                    <h4>Upload<br> Your Photo</h4>
                </div>
            </div>

            <div class="col-xs-3 bs-wizard-step <?= (Auth::guard('user')->user()->about != '') ? 'complete': '' ?>"><!-- complete -->
                <div class="progress"><div class="progress-bar"></div></div>
                <a href="#" class="bs-wizard-dot"></a>
                <div class="bs-wizard-info text-center">
                    <h3>75%</h3>
                    <h4>Biography</h4>
                </div>
            </div>

            <div class="col-xs-3 bs-wizard-step <?= (Auth::guard('user')->user()->hobbies != '') ? 'complete': '' ?>"><!-- complete -->
                <div class="progress"><div class="progress-bar"></div></div>
                <a href="#" class="bs-wizard-dot"></a>
                <div class="bs-wizard-info text-center">
                    <h3>100%</h3>
                    <h4>Hobbies And Interests</h4>
                </div>
            </div>			
        </div>		
		
        @if(Auth::guard('user')->user()->confirmed == 0)
        <div class="row align-center">
            <h3 style="padding-top:25px;">Thank You for signing up! Please check your email to activate your account</h3>
            <a style="margin-top:25px;" class="btn2" href="{{Request::root()}}/user/send_email_verification_code">Resend Verification Code</a>
        </div>
        @elseif(Auth::guard('user')->user()->photos == '')
        <div class="row">		    
			<form method="post" enctype="multipart/form-data" action="{{Request::root()}}/user/image_upload" class="dropzone">
				<input type="hidden" id="token" name="_token" value="{{ csrf_token() }}">
            </form>
        </div>
        @elseif(Auth::guard('user')->user()->about == '')
        <div class="row">
			<form method="post" action="{{Request::root()}}/user/update_user">
				<input type="hidden" id="token" name="_token" value="{{ csrf_token() }}">
				<table>
					<tr>
						<td><textarea class="form-control" name="about" id="about"></textarea></td>
					</tr>
					<tr>
						<td><button type="submit" onclick="return checkabout();" >Submit</button></td>
					</tr>
				</table>
			</form>
        </div>
		@else
		<div class="row">
			<form method="post">
				<input type="hidden" id="token" name="_token" value="{{ csrf_token() }}">
				<h3>Hobbies &amp; Interest</h3>
				<div class="spo-lang hob-interest">
                    <div class="table-responsive hobbies" >
                        <table class="table">
                            <tbody>
                                <tr>                                   
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
			</form>
        </div>
        @endif
    </div>
</div>
</section>
<section class="dinner-parties">
    <div class="container">
        <div class="main-heading">
            <h2>Events</h2>
            <span><a href="#">(See All)</a></span>
        </div>
        <div class="owl-carousel owl-theme">
            <div class="item">
                <div class="parties-wrap">
                    <div class="parties-head">
                        <h3>Summer BBQ With Cocktails</h3>
                        <p>Vestibulum rutrum quam vitae <br /> Fringilla tincidunt. Suspendisse.</p>
                        <p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>850.00 + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.">80.00</a></span> booking fee</p>
                        <div class="event-mf">
                            <i class="fa fa-male" aria-hidden="true"></i>
                            <p>Men only</p>
                        </div>
                    </div>
                    <div class="parties-host">
                        <div class="hosted-by">
                            <div class="img">
                                <div class="heart-dil">
                                    <a class="follow-ing" href="#/">Follow</a>
                                </div>
                                <div class="inner">
                                    <div class="circle-img"></div>
                                    <img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="" />
                                </div>
                                <div class="rateyo-readonly-widg"></div>
                            </div>
                            <div class="content">
                                <p>Hosted By: <strong>Khairul P.</strong></p>
                                <p>Aged: <strong>24</strong></p>
                                <p>Friday 05/05/2017</p>
                                <p>9.00pm - 12.00am</p>
                                <p>Bukit Tunku, KL</p>
                            </div>	
                        </div>
                        <div class="hosted-by parties-foot">
                            <div class="img">
                                <div class="inner">
                                    <img src="{{Request::root()}}/assets/front/img/host-logo1.png" alt="" />
                                </div>
                            </div>
                            <div class="content">
                                <p><strong>100%</strong> of ticket price will go to Action Against Hunger</p>
                            </div>	
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="parties-wrap">
                    <div class="parties-head">
                        <h3>Summer BBQ With Cocktails</h3>
                        <p>Vestibulum rutrum quam vitae <br />Fringilla tincidunt. Suspendisse.</p>
                        <p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>850.00 + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.">80.00</a></span> booking fee</p>
                        <div class="event-mf">
                            <i class="fa fa-female" aria-hidden="true"></i>
                            <p>Ladies only</p>
                        </div>
                    </div>
                    <div class="parties-host">
                        <div class="hosted-by">
                            <div class="img">
                                <div class="heart-dil">
                                    <a class="follow-ing" href="#/">Follow</a>
                                </div>
                                <div class="inner">
                                    <div class="circle-img"></div>
                                    <img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="" />
                                </div>
                                <div class="rateyo-readonly-widg"></div>
                            </div>
                            <div class="content">
                                <p>Hosted By : <strong>Khairul P.</strong></p>
                                <p>Aged : <strong>24</strong></p>
                                <p>Friday 05/05/2017</p>
                                <p>9.00pm - 12.00am</p>
                                <p>Bukit Tunku, KL</p>
                            </div>	
                        </div>
                        <div class="hosted-by parties-foot">
                            <div class="img">
                                <div class="inner">
                                    <img src="{{Request::root()}}/assets/front/img/host-logo1.png" alt="" />
                                </div>
                            </div>
                            <div class="content">
                                <p><strong>100%</strong> of ticket price will go to Action Against Hunger</p>
                            </div>	
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="parties-wrap">
                    <div class="parties-head">
                        <h3>Summer BBQ With Cocktails</h3>
                        <p>Vestibulum rutrum quam vitae <br /> Fringilla tincidunt. Suspendisse.</p>
                        <p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>850.00 + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.">80.00</a></span> booking fee</p>
                        <div class="event-mf">
                            <span><img src="{{Request::root()}}/assets/front/img/icon1.png" alt="" /></span>
                            <p>Singles only</p>
                        </div>
                    </div>
                    <div class="parties-host">
                        <div class="hosted-by">
                            <div class="img">
                                <div class="heart-dil">
                                    <a class="follow-ing" href="#/">Follow</a>
                                </div>
                                <div class="inner">
                                    <div class="circle-img"></div>
                                    <img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="" />
                                </div>
                                <div class="rateyo-readonly-widg"></div>
                            </div>
                            <div class="content">
                                <p>Hosted By : <strong>Khairul P.</strong></p>
                                <p>Aged : <strong>24</strong></p>
                                <p>Friday 05/05/2017</p>
                                <p>9.00pm - 12.00am</p>
                                <p>Bukit Tunku, KL</p>
                            </div>	
                        </div>
                        <div class="hosted-by parties-foot">
                            <div class="img">
                                <div class="inner">
                                    <img src="{{Request::root()}}/assets/front/img/host-logo1.png" alt="" />
                                </div>
                            </div>
                            <div class="content">
                                <p><strong>100%</strong> of ticket price will go to Action Against Hunger</p>
                            </div>	
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="parties-wrap">
                    <div class="parties-head">
                        <h3>Summer BBQ With Cocktails</h3>
                        <p>Vestibulum rutrum quam vitae <br /> Fringilla tincidunt. Suspendisse.</p>
                        <p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>850.00 + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.">80.00</a></span> booking fee</p>
                        <div class="event-mf">
                            <span><img src="{{Request::root()}}/assets/front/img/icon2.png" alt="" /></span>
                            <p>Couples only</p>
                        </div>
                    </div>
                    <div class="parties-host">
                        <div class="hosted-by">
                            <div class="img">
                                <div class="heart-dil">
                                    <a class="follow-ing" href="#/">Follow</a>
                                </div>
                                <div class="inner">
                                    <div class="circle-img"></div>
                                    <img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="" />
                                </div>
                                <div class="rateyo-readonly-widg"></div>
                            </div>
                            <div class="content">
                                <p>Hosted By : <strong>Khairul P.</strong></p>
                                <p>Aged : <strong>24</strong></p>
                                <p>Friday 05/05/2017</p>
                                <p>9.00pm - 12.00am</p>
                                <p>Bukit Tunku, KL</p>
                            </div>	
                        </div>
                        <div class="hosted-by parties-foot">
                            <div class="img">
                                <div class="inner">
                                    <img src="{{Request::root()}}/assets/front/img/host-logo1.png" alt="" />
                                </div>
                            </div>
                            <div class="content">
                                <p><strong>100%</strong> of ticket price will go to Action Against Hunger</p>
                            </div>	
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<script>
function checkabout()
{
	var aboutlenght = document.getElementById('about').value;
	if(aboutlenght.length<20 || aboutlenght.length>2000)
	{
		//alert(aboutlenght.length);
		return false;
	}	
}
</script>
<script type="text/javascript">
        Dropzone.options.imageUpload = {
            maxFilesize         :      12,
            acceptedFiles: ".jpeg,.jpg,.png,.gif"
        };
</script>
@endsection