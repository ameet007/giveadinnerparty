@extends('common.layout.front-layout')
@section('content')
<div class="banner">
    <ul class="bxslider">
		@foreach($banners as $banner)
        <li>
            <div class="back-overlay"></div>
            <img class="media-object" src="{{Request::root()}}/assets/admin/uploads/banner/{{$banner->image}}" alt="" />
            <div class="bx-caption">
                <div class="container">
                    <h2>{{$banner->title}}</h2>
                    <h4>{{$banner->sub_title}}</h4>
                    <a class="btn2" href="#/">Join Our Community</a>
                </div>
            </div>
        </li>
         @endforeach
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
          @foreach($events as $event)
		  <?php $charity = DB::select( DB::raw("SELECT * FROM charities WHERE id = '$event->charity_id'") ); ?>
			<div class="item">
				<div class="parties-wrap">
					<div class="parties-head">
						<h3><a href="#">{{ $event->title }}</a></h3>
						<p>{{ $event->description }}</p> 
						<p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>{{ $event->ticket_price }} + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="">80.00</a></span> booking fee</p>
						<div class="event-mf">
							<i class="fa <?php if($event->guest_gender=='Men Only'){echo 'fa-male'; }elseif($event->guest_gender=='Ladies only'){ echo 'fa-female'; }elseif($event->guest_gender=='Singles only'){echo "fa-user"; } ?>" aria-hidden="true"></i>
							<p>{{ $event->guest_gender }}</p>
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
								<div class="align-center">
									<div class="rateYo1"></div>
									<span class="re-view">(17)</span>
								</div>
							</div>
							<div class="content">
								<p>Hosted By: <strong>{{ $event->name.' '.$event->last_name }}</strong></p>
								<p>Aged: <strong>{{ $event->min_age }} - {{$event->max_age }}</strong></p>
								<p>Friday {{ $event->event_date }}</p>
								<p>{{ $event->start_time }} - {{$event->end_time }}</p>
								<p>{{ $event->street }}, {{ $event->city }}, {{ $event->county }}</p>
							</div>	
						</div>
						<div class="hosted-by parties-foot">
							<div class="img">
								<div class="inner">
									<img src="{{Request::root()}}/assets/admin/uploads/charity/{{ $charity[0]->logo }}" alt="" />
								</div>
							</div>
							<div class="content">
								<p><strong>{{ $event->charity_cut }}%</strong> of ticket price will go to {{ $charity[0]->title }}</p>
							</div>	
						</div>
					</div>
				</div>
			</div>
		@endforeach	           
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
		$(".rateYo1").rateYo({
			starWidth: "11px",
			normalFill: "#484848",
			ratedFill: "#fff"
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
