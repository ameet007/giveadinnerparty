@extends('common.layout.front-layout')
@section('content')
<div class="banner">
    <ul class="bxslider">
        <li>
            <div class="back-overlay"></div>
            <img class="media-object" src="{{Request::root()}}/assets/front/img/01.jpg" alt="" />
            <div class="bx-caption">
                <div class="container">
                    <h2>Give A Dinner Party</h2>
                    <h4>Get together. Have fun. Give back</h4>
                    <a class="btn2" href="#/">Join Our Community</a>
                </div>
            </div>
        </li>
        <li>
            <div class="back-overlay"></div>
            <img class="media-object" src="{{Request::root()}}/assets/front/img/01.jpg" alt="" />
            <div class="bx-caption">
                <div class="container">
                    <h2>Give A Dinner Party</h2>
                    <h4>Get together. Have fun. Give back</h4>
                    <a class="btn2" href="#/">Join Our Community</a>
                </div>
            </div>
        </li>
    </ul>
</div>
<section class="wel-section">
    <div class="container">
        <div class="row">
            <div class="col-md-5 col-sm-12 col-xs-12">
                <div class="wel-right">
                    <iframe width="100%" height="270" src="https://www.youtube.com/embed/V4sEn3LWG5M" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
            <div class="col-md-7 col-sm-12 col-xs-12">
                <div class="wel-left">
                    <h2>It's All About Community</h2>
                    <p>La Capelette is a new place in Soho, founded by chefs Noah and Juliette. The famous couple finally managed to open their first French restaurant after living in Spain and France for the last 8 years.</p>
                    <p>La Capelette is inspired by the small french brasseries that can be found in every village in France where the food is tasty, authentic and fresh and the wine is delicious and flamboyant.</p>
                    <p>The two chefs also decided to run a small catering company and help local event planners have a taste of France on every occasions.</p>
                </div>
            </div>
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
<section class="how-it-work">
    <div class="container">
        <div class="row">
            <div class="main-heading">
                <h2>How it works?</h2>
            </div>
            <div class="col-md-4 col-sm-12 col-xs-12">
                <div class="number-grid bordered">
                    <div class="img">
                        <img src="{{Request::root()}}/assets/front/img/icon4.png" alt="" />
                    </div>
                    <h4 class="number-grid-title">Get together</h4>
                    <p>Pellentesque non laoreet risus, id elementum purus. Vestibulum felis felis, volutpat eu venenatis ut, pharetra at sapien. Pellentesque accumsan aliquet leo, in feugiat odio dapibus ut. Nunc sem enim, pulvinar sed enim eget.</p>
                </div>
            </div>
            <div class="col-md-4 col-sm-12 col-xs-12">
                <div class="number-grid bordered">
                    <div class="img">
                        <img src="{{Request::root()}}/assets/front/img/icon3.png" alt="" />
                    </div>
                    <h4 class="number-grid-title">Have fun</h4>
                    <p>Pellentesque non laoreet risus, id elementum purus. Vestibulum felis felis, volutpat eu venenatis ut, pharetra at sapien. Pellentesque accumsan aliquet leo, in feugiat odio dapibus ut. Nunc sem enim, pulvinar sed enim eget.</p>
                </div>
            </div>
            <div class="col-md-4 col-sm-12 col-xs-12">
                <div class="number-grid bordered res-mr0">
                    <div class="img">
                        <img src="{{Request::root()}}/assets/front/img/icon5.png" alt="" />
                    </div>
                    <h4 class="number-grid-title">Give back</h4>
                    <p>Pellentesque non laoreet risus, id elementum purus. Vestibulum felis felis, volutpat eu venenatis ut, pharetra at sapien. Pellentesque accumsan aliquet leo, in feugiat odio dapibus ut. Nunc sem enim, pulvinar sed enim eget.</p>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="helping-section">
    <div class="container">
        <div class="row">
            <div class="col-md-6 col-sm-12 col-xs-12 helping-left">
                <h2>By Hosting, You re Helping While Having Fun</h2>
                <h5>Have dinner with people that you’ll love, while helping out</h5>
                <a class="btn2" href="#">Learn More</a>
            </div>
            <div class="col-md-6 col-sm-12 col-xs-12 helping-right">
                <img src="{{Request::root()}}/assets/front/img/helping-img.jpg" alt="" />
            </div>
        </div>
    </div>
</section>
<script type="text/javascript">
    $(document).ready(function () {
        $('.demo-1').datepicker();
        $('.follow-ing').click(function () {
            if ($(this).html() == 'Following') {
                $(this).html('Follow');
            } else {
                $(this).html('Following');
            }
        })
        $('.search-panel .dropdown-menu').find('a').click(function (e) {
            e.preventDefault();
            var param = $(this).attr("href").replace("#", "");
            var concept = $(this).text();
            $('.search-panel span#search_concept').text(concept);
            $('.input-group #search_param').val(param);
        });

        $('.bxslider').bxSlider({
            mode: 'fade',
            captions: true,
            pager: false
        });

        $('[data-toggle="tooltip"]').tooltip();

        $(window).on('scroll', function () {
            "use strict";
            var scroll = $(window).scrollTop();
            if (scroll > 60) {
                $(".navbar").addClass("scroll-fixed-navbar");
            } else {
                $(".navbar").removeClass("scroll-fixed-navbar");
            }
        });

        $('.custom-select').fancySelect();

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

    $(function () {
        var rating = 1.5;
        $(".counter").text(rating);
        $("#rateYo1").on("rateyo.init", function () {
            console.log("rateyo.init");
        });
        $("#rateYo1").rateYo({
            rating: rating,
            numStars: 2,
            precision: 2,
            starWidth: "16px",
            spacing: "5px",
            rtl: true,
            multiColor: {
                startColor: "#fff",
                endColor: "#ffffff"
            },
            onInit: function () {
                console.log("On Init");
            },
            onSet: function () {
                console.log("On Set");
            }
        }).on("rateyo.set", function () {
            console.log("rateyo.set");
        })
                .on("rateyo.change", function () {
                    console.log("rateyo.change");
                });
        $(".rateyo").rateYo();
        $(".rateyo-readonly-widg").rateYo({
            rating: rating,
            numStars: 5,
            precision: 2,
            minValue: 1,
            maxValue: 5
        }).on("rateyo.change", function (e, data) {
            console.log(data.rating);
        });
    });
    function showLogin() {
        $('#myModal').modal('show');
        $('.signup').show();
        $('.login').hide();
        $('.last-step').hide();
    }
    $('#login-in').click(function () {
        $('.login').show();
        $('.signup').hide();
    })
    $('#last-step').click(function () {
        $('.last-step').show();
        $('.signup').hide();
    })
</script>
@endsection
