@extends('user.layout.fronLayout')
@section('content')

<div class="pro-header">
<div class="container your-party ">
    
        <div class="pull-left">
            <h2>Hello. {{Auth::guard('user')->user()->name}},</h2>
            <h3>Your <span>Dinner Party at Mark’s</span> is Coming up in 3days</h3>
        </div>
        <div class="pull-right">
            <button class="gost-btn" onClick="window.location.href='{{Request::root()}}/user/create_event'">Host A Dinner Party</button>
        </div>
    
</div>
</div>

<section class="middle-content profile-page">
    <div class="container dinner-parties">
        <div class="main-heading">
            <h2>Dinner Parties That Might Interest You</h2>
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

    <div class="helping-section">
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-sm-12 col-xs-12 helping-left">
                    <h2>Oh no! A quake happened in Nepal yesterday!</h2>
                    <h5>Hold a dinner party to help out!</h5>
                    <a class="btn2" href="#">Help Nepal</a>
                </div>
                <div class="col-md-6 col-sm-12 col-xs-12 helping-right">
                    <img src="{{Request::root()}}/assets/front/img/helping-img2.jpg" alt="">
                </div>
            </div>
        </div>
    </div>
    <div class="container party-interest">
        <div class="main-heading">
            <h2>Diner Parties by Your Interest?</h2>
        </div>
        <div class="col-xs-12">
            <div class="row">
                <div class="col-md-4 col-sm-12">
                    <ul>
                        <li>Dota(8)</li>
                        <li>Mahjong (10)</li>
                        <li>Homosexual(15)</li>
                        <li>Digital Marketing(6)</li>
                        <li>Fine Art(2)</li>
                    </ul>
                </div>
                <div class="col-md-4 col-sm-12">
                    <ul>
                        <li>Dota(8)</li>
                        <li>Mahjong (10)</li>
                        <li>Homosexual(15)</li>
                        <li>Digital Marketing(6)</li>
                        <li>Fine Art(2)</li>
                    </ul>
                </div>
                <div class="col-md-4 col-sm-12">
                    <ul>
                        <li>Dota(8)</li>
                        <li>Mahjong (10)</li>
                        <li>Homosexual(15)</li>
                        <li>Digital Marketing(6)</li>
                        <li>Fine Art(2)</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</section>

@endsection