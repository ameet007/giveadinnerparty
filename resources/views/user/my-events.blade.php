@extends('user.layout.fronLayout')
@section('content')
<section class="dinner-parties my-events">
    <div class="container">
        <div class="main-heading">
            <h2>Upcoming Events</h2>
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
    <div class="container">
        <div class="main-heading">
            <h2>Past Events</h2>
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
@endsection('content')