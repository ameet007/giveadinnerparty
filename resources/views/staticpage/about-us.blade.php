@extends('common.layout.front-layout')
@section('content')
<div class="banner inner-banner">
	<img src="{{Request::root()}}/assets/front/img/about-pic4.jpg" alt="image" />
	<div class="bread-main">
		<div class="container">
			<div class="row">
				<ol class="breadcrumb">
					<li class="breadcrumb-item"><a href="{{Request::root()}}">Home</a></li>
					<li class="breadcrumb-item active">About Us</li>
				</ol>
			</div>
		</div>
	</div>
</div>
<section class="cms-content about-us">
	<div class="container">
		<div class="main-heading">
			<h2>About Us</h2>
		</div>
		<h3>What is Lorem Ipsum?</h3>
		<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
		<h3>Why do we use it?</h3>
		<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
	</div>
</section>

<!--<footer class="footer">
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
				</div>
			</div>
        </div>
    </div>
    <div class="footer-bottom">
        <div class="container">
            <p>Copyright &copy; 2017 Give A Dinner Party.</p>
        </div>
    </div>
</footer>-->
<script src="js/jQuery.js" type="text/javascript"></script>
<script src="js/rateyo.js" type="text/javascript"></script>
<script src="js/owl.carousel.js" type="text/javascript"></script>
<script src="js/bxslider.js" type="text/javascript"></script>
<script src="js/fancySelect.js" type="text/javascript"></script>
<script src="js/bootstrap.min.js" type="text/javascript"></script>
<script src="js/bootstrap-datepicker.js" type="text/javascript"></script>
<script type="text/javascript">
$(document).ready(function(){
	/*$('.follow-ing').click(function(){
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
});*/
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