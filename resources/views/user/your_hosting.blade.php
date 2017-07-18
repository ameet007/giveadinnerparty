@extends('user.layout.fronLayout')
@section('content')
@if(Session::get('success')!='')
<div class="alert alert-success">
    {{Session::get('success')}}
</div>
@endif
@if(Session::get('error')!='')
<div class="alert alert-danger">
    {{Session::get('error')}}
</div>
@endif
<div class="middle-content account-section your-hosting">
    <div class="container">
        <div class="row clearfix">
            <aside class="col-md-2 left-sidebar">
                <div class="sidenav-list">
                    <ul>
                        <li class=''><a href='#'>Host New Event</a></li>
                        <li class=''><a href='#'>My Active Events</a></li>
                        <li class=''><a href='#'>My Ended Events</a></li>
                        <li class=''><a href='#'>Verify Me As A Host</a></li>
                        <li class=''><a href='#'>Invite Users</a></li>
                    </ul>
                </div>
            </aside>
            <article class="col-md-10">
                <div class="dinner-parties">
                    <div class="main-heading">
                        <h2>You Hosting</h2>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
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
                        </div>
                        <div class="col-md-4">
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
                        </div>
                        <div class="col-md-4">
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
                        </div>
                        <div class="col-md-4">
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
                        </div>
                        <div class="col-md-4">
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
                        </div>
                        <div class="col-md-4">
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
                </div>
            </article>
        </div>
    </div>
</div>
<script>
    $("#tabs").tabs();

    $('.search-panel .dropdown-menu').find('a').click(function (e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#", "");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
    });
</script>
@endsection('content')