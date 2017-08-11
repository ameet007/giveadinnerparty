@extends('common.layout.front-layout')
@section('content')
<div class="banner inner-banner">
	<img src="{{Request::root()}}/assets/front/img/about-pic4.jpg" alt="" />
	<div class="bread-main">
		<div class="container">
			<div class="row">
				<ol class="breadcrumb">
					<li class="breadcrumb-item"><a href="#">Home</a></li>
					<li class="breadcrumb-item active">FAQs</li>
				</ol>
			</div>
		</div>
	</div>
</div>
<section class="cms-content cd-faq">
	<div class="container">
		<div class="main-heading">
			<h2>FAQs</h2>
		</div>
		<ul id="basics" class="cd-faq-group">
			@foreach($faq_data as $faq)
			<li>
				<a class="cd-faq-trigger" href="#0">{{$faq->question}}</a>
				<div class="cd-faq-content">
					<p>{{$faq->answer}}</p>
				</div> <!-- cd-faq-content -->
			</li>
			@endforeach
		</ul> <!-- cd-faq-group -->
	</div>
</section>
<script src="{{Request::root()}}/assets/front/js/faq.js" type="text/javascript"></script>
<script type="text/javascript">
$(document).ready(function(){
	$('.follow-ing').click(function(){
		if($(this).html() == 'Following'){
			$(this).html('Follow');
		}
		else{
			$(this).html('Following');
		}
	})
	$('.search-panel .dropdown-menu').find('a').click(function(e) {
		e.preventDefault();
		var param = $(this).attr("href").replace("#","");
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
	
    $(window).on('scroll', function(){  
        "use strict"; 
        var scroll = $(window).scrollTop();
        if( scroll > 60 ){
            $(".navbar").addClass("scroll-fixed-navbar");
        } else {
            $(".navbar").removeClass("scroll-fixed-navbar");
        }
    });
	
    $('.custom-select').fancySelect();
	
	$('.owl-carousel').owlCarousel({
		loop:true,
		margin:15,
		dots: false,
		nav:true,
		responsiveClass: true,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:2
			},
			1000:{
				items:3
			},
			1100:{
				items:4
			}
		}
	})
});

$(function () {
        var rating = 1.5;
        $(".counter").text(rating);
        $("#rateYo1").on("rateyo.init", function () { console.log("rateyo.init"); });
        $("#rateYo1").rateYo({
          rating: rating,
          numStars: 2,
          precision: 2,
          starWidth: "16px",
          spacing: "5px",
		rtl: true,
          multiColor: {
            startColor: "#fff",
            endColor  : "#ffffff"
          },
          onInit: function () {
            console.log("On Init");
          },
          onSet: function () {
            console.log("On Set");
          }
        }).on("rateyo.set", function () { console.log("rateyo.set"); })
          .on("rateyo.change", function () { console.log("rateyo.change"); });
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
function showLogin(){
    $('#myModal').modal('show');
    $('.signup').show();
    $('.login').hide();
	$('.last-step').hide();
}
$('#login-in').click(function(){
	$('.login').show();
	$('.signup').hide();
})
$('#last-step').click(function(){
	$('.last-step').show();
	$('.signup').hide();
})
</script>
@endsection
