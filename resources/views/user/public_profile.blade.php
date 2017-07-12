@extends('user.layout.fronLayout')
@section('content')
<section class="middle-content profile-edit public-pro">
	<div class="container">
		<div class="row per-details">
			<div class="col-md-3">
				<div class="pro-pic">
					<div class="over-lay"></div>
					<img src="{{Request::root()}}/assets/front/img/pro-pic.jpg" alt="" />
				</div>
				<div class="charity-f">
					<h3>$65,425</h3>
					<h5>Charity Funds Raised</h5>
					<img src="{{Request::root()}}/assets/front/img/start.png" alt="" />
				</div>
			</div>
			<div class="col-md-9">
				<div class="per-details-right">
					<h2>Hello. I’m sheng W.,</h2>
					<h3>Subang, Malaysia. Joined June 2017</h3>
					<p><i class="fa fa-flag-o" aria-hidden="true"></i> Report User</p>
					<ul class="age">
						<li><p><strong>Age:</strong> 29</p></li>
						<li><p><strong>Gender:</strong> Male</p></li>
						<li><p><strong>Post Code:</strong> NGU28N</p></li>
					</ul>
					<p><strong>Marital Status:</strong> Not Specified</p>
					<p><strong class="btn-block">Marital Status:</strong> Chinese, Malay, English</p>
					<p>
						<strong class="btn-block">Interests:</strong>
						<a href="#">Dota,</a>
						<a href="#">Western Food,</a>
						<a href="#">Action,</a>
						<a href="#">Against Hunger, Poker</a>
					</p>
					<p><strong class="btn-block">Biography:</strong> I’m a Cool Guy in A Cool World</p>
				</div>
			</div>
		</div>
	</div>
	<div class="container dinner-parties">
		<div class="main-heading">
			<h2>Upcoming Events</h2>
			<span><a href="#">(See All)</a></span>
		</div>
		<div class="owl-carousel owl-theme">
			<div class="item">
				<div class="parties-wrap">
					<div class="parties-head">
						<h3><a href="dinner-party-page-host.html">Summer BBQ With Cocktails</a></h3>
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
						<h3><a href="dinner-party-page-host.html">Summer BBQ With Cocktails</a></h3>
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
						<h3><a href="dinner-party-page-host.html">Summer BBQ With Cocktails</a></h3>
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
						<h3><a href="dinner-party-page-host.html">Summer BBQ With Cocktails</a></h3>
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
	<div class="container sheng-reviews">
		<h2>Sheng has 7 Reviews</h2>
		<a class="btn2" href="#">Leave Sheng A Review</a>
		<ul>
			<li>
				<div class="media">
					<div class="media-left">
						<div class="inner">
							<img src="{{Request::root()}}/assets/front/img/review-pic.png" class="media-object" />
							<p>Khairul</p>
							<img width="80px" src="{{Request::root()}}/assets/front/img/start.png" alt="" />
						</div>
					</div>
					<div class="media-body">
						<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
						<div class="essex-from clearfix">
							<div class="pull-left">
								<h4>From Essex, UK</h4>
							</div>
							<div class="pull-right">
								<a href="#">Jonathan’s Chess Party</a>
							</div>
						</div>
					</div>
				</div>
			</li>
			<li>
				<div class="media">
					<div class="media-left">
						<div class="inner">
							<img src="{{Request::root()}}/assets/front/img/review-pic.png" class="media-object" />
							<p>Khairul</p>
							<img width="80px" src="{{Request::root()}}/assets/front/img/start.png" alt="" />
						</div>
					</div>
					<div class="media-body">
						<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
						<div class="essex-from clearfix">
							<div class="pull-left">
								<h4>From Essex, UK</h4>
							</div>
							<div class="pull-right">
								<a href="#">Jonathan’s Chess Party</a>
							</div>
						</div>
					</div>
				</div>
			</li>
			<li>
				<div class="media">
					<div class="media-left">
						<div class="inner">
							<img src="{{Request::root()}}/assets/front/img/review-pic.png" class="media-object" />
							<p>Khairul</p>
							<img width="80px" src="{{Request::root()}}/assets/front/img/start.png" alt="" />
						</div>
					</div>
					<div class="media-body">
						<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
						<div class="essex-from clearfix">
							<div class="pull-left">
								<h4>From Essex, UK</h4>
							</div>
							<div class="pull-right">
								<a href="#">Jonathan’s Chess Party</a>
							</div>
						</div>
					</div>
				</div>
			</li>
			<li>
				<div class="media">
					<div class="media-left">
						<div class="inner">
							<img src="{{Request::root()}}/assets/front/img/review-pic.png" class="media-object" />
							<p>Khairul</p>
							<img width="80px" src="{{Request::root()}}/assets/front/img/start.png" alt="" />
						</div>
					</div>
					<div class="media-body">
						<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
						<div class="essex-from clearfix">
							<div class="pull-left">
								<h4>From Essex, UK</h4>
							</div>
							<div class="pull-right">
								<a href="#">Jonathan’s Chess Party</a>
							</div>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</section>
@endsection