@extends('user.layout.fronLayout')
@section('content')
<section class="middle-content invite-fri">
    <div class="container">
        <div class="row">
			<ul class="nav nav-tabs">
				<li class="active"><a data-toggle="tab" href="#invite_users">Invite Users</a></li>
				<li><a data-toggle="tab" href="#invite_friends">Invite Friends</a></li>
			</ul>
			<div class="tab-content">
				<div id="invite_users" class="tab-pane fade in active">
				<h2>Invite Users</h2>
				<p>If you're hosting an event, you can browse member profiles in your local area and invite any that you think would enjoy your event.</p>
				<p>Please note some members may have opted out of receiving Host invites. You may only invite users with 100% complete profiles.</p>
				<p>You can also save your favourite user profiles by clicking the heart next to their profile picture. We'll email you as soon as they host an event.</p>
				<div class="dis-tance">
					<div class="row">
						<div class="col-md-3">
							<div class="form-group">
								<label>Distance</label>
								<select class="form-control" id="select_distance">
									<option value="1">1</option>
									<option value="5">5</option>
									<option value="10">10</option>
									<option value="20">20</option>
									<option selected="" value="50">50</option>
									<option value="Any">Any</option>
								</select>
							</div>
						</div>
						<div class="col-md-3">
							<div class="form-group">
								<label>Units</label>
								<select class="form-control">
									<option value="km">km</option>
								</select>
							</div>
						</div>
						<div class="col-md-3">
							<div class="form-group">
								<label>&nbsp;</label>
								<div class="pull-right">
									<a href="#/" id="fil" class="btn2">Filters</a>
									<a href="#/" id="find" class="grey-btn">Find</a>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="age-ran" class="age-ran">
					<div class="form-inline">
						<div class="form-group">
							<label>Age Range</label>
							<select id="age1" class="form-control"> <option selected="" value="18">18</option> <option value="19">19</option> <option value="20">20</option> <option value="21">21</option> <option value="22">22</option> <option value="23">23</option> <option value="24">24</option> <option value="25">25</option> <option value="26">26</option> <option value="27">27</option> <option value="28">28</option> <option value="29">29</option> <option value="30">30</option> <option value="31">31</option> <option value="32">32</option> <option value="33">33</option> <option value="34">34</option> <option value="35">35</option> <option value="36">36</option> <option value="37">37</option> <option value="38">38</option> <option value="39">39</option> <option value="40">40</option> <option value="41">41</option> <option value="42">42</option> <option value="43">43</option> <option value="44">44</option> <option value="45">45</option> <option value="46">46</option> <option value="47">47</option> <option value="48">48</option> <option value="49">49</option> <option value="50">50</option> <option value="51">51</option> <option value="52">52</option> <option value="53">53</option> <option value="54">54</option> <option value="55">55</option> <option value="56">56</option> <option value="57">57</option> <option value="58">58</option> <option value="59">59</option> <option value="60">60</option> <option value="61">61</option> <option value="62">62</option> <option value="63">63</option> <option value="64">64</option> <option value="65">65</option> <option value="66">66</option> <option value="67">67</option> <option value="68">68</option> <option value="69">69</option> <option value="70">70</option> <option value="71">71</option> <option value="72">72</option> <option value="73">73</option> <option value="74">74</option> <option value="75">75</option> <option value="76">76</option> <option value="77">77</option> <option value="78">78</option> <option value="79">79</option> <option value="80">80</option> <option value="81">81</option> <option value="82">82</option> <option value="83">83</option> <option value="84">84</option> <option value="85">85</option> <option value="86">86</option> <option value="87">87</option> <option value="88">88</option> <option value="89">89</option> <option value="90">90</option> <option value="91">91</option> <option value="92">92</option> <option value="93">93</option> <option value="94">94</option> <option value="95">95</option> <option value="96">96</option> <option value="97">97</option> <option value="98">98</option> <option value="99">99</option> <option value="100">100</option> <option value="101">101</option> <option value="102">102</option> <option value="103">103</option> <option value="104">104</option> <option value="105">105</option> <option value="106">106</option> <option value="107">107</option> <option value="108">108</option> <option value="109">109</option> <option value="110">110</option></select>
						</div>
						<div class="form-group">
							<label>&nbsp;</label>
							<select id="age2" class="form-control"> <option value="18">18</option> <option value="19">19</option> <option value="20">20</option> <option value="21">21</option> <option value="22">22</option> <option value="23">23</option> <option value="24">24</option> <option value="25">25</option> <option value="26">26</option> <option value="27">27</option> <option value="28">28</option> <option value="29">29</option> <option value="30">30</option> <option value="31">31</option> <option value="32">32</option> <option value="33">33</option> <option value="34">34</option> <option value="35">35</option> <option value="36">36</option> <option value="37">37</option> <option value="38">38</option> <option value="39">39</option> <option value="40">40</option> <option value="41">41</option> <option value="42">42</option> <option value="43">43</option> <option value="44">44</option> <option value="45">45</option> <option value="46">46</option> <option value="47">47</option> <option value="48">48</option> <option value="49">49</option> <option value="50">50</option> <option value="51">51</option> <option value="52">52</option> <option value="53">53</option> <option value="54">54</option> <option value="55">55</option> <option value="56">56</option> <option value="57">57</option> <option value="58">58</option> <option value="59">59</option> <option value="60">60</option> <option value="61">61</option> <option value="62">62</option> <option value="63">63</option> <option value="64">64</option> <option value="65">65</option> <option value="66">66</option> <option value="67">67</option> <option value="68">68</option> <option value="69">69</option> <option value="70">70</option> <option value="71">71</option> <option value="72">72</option> <option value="73">73</option> <option value="74">74</option> <option value="75">75</option> <option value="76">76</option> <option value="77">77</option> <option value="78">78</option> <option value="79">79</option> <option value="80">80</option> <option value="81">81</option> <option value="82">82</option> <option value="83">83</option> <option value="84">84</option> <option value="85">85</option> <option value="86">86</option> <option value="87">87</option> <option value="88">88</option> <option value="89">89</option> <option value="90">90</option> <option value="91">91</option> <option value="92">92</option> <option value="93">93</option> <option value="94">94</option> <option value="95">95</option> <option value="96">96</option> <option value="97">97</option> <option value="98">98</option> <option value="99">99</option> <option value="100">100</option> <option value="101">101</option> <option value="102">102</option> <option value="103">103</option> <option value="104">104</option> <option value="105">105</option> <option value="106">106</option> <option value="107">107</option> <option value="108">108</option> <option value="109">109</option> <option selected="" value="110">110</option></select>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<div class="form-group">
								<label>Gender</label>
								<select id="gender" class="form-control">
									<option selected="" value="Don't Mind">Don't Mind</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
							</div>
						</div>
						<div class="col-md-3">
							<div class="form-group">
								<label>Status</label>
								<select id="status" class="form-control">
									<option selected="" value="Don't Mind">Don't Mind</option>
									<option value="Married">Married</option>
									<option value="Single">Single</option>
									<option value="In A Relationship">In A Relationship</option>
								</select>
							</div>
						</div>
						<div class="col-md-3">
							<div class="form-group">
								<label>Sexuality</label>
								<select id="sexuality" class="form-control">
									<option selected="" value="Don't Mind">Don't Mind</option>
									<option value="Straight">Straight</option>
									<option value="Gay">Gay</option>
									<option value="Lesbian">Lesbian</option>
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-3">
							<div class="form-group">
								<label>Education</label>
								<select id="education" class="form-control">
									<option selected="" value="Don't Mind">Don't Mind</option>
									<option value="School">School</option>
									<option value="College">College</option>
									<option value="University">University</option>
									<option value="Post Graduate">Post Graduate</option>
								</select>
							</div>
						</div>
						<div class="col-md-3">
							<div class="form-group">
								<label>Ethnicity</label>
								<select id="ethnicity" class="form-control"> <option selected="" value="Don't Mind">Don't Mind</option> <option value="Mixed">Mixed</option> <option value="African (North)">African (Central)</option> <option value="African (North)">African (North)</option> <option value="African (South)">African (South)</option> <option value="African (East)">African (East)</option> <option value="African (West)">African (West)</option> <option value="American">American</option> <option value="Arab">Arab</option> <option value="Australian">Australian</option> <option value="Bengali">Bengali</option> <option value="Canadian">Canadian</option> <option value="Chinese">Chinese</option> <option value="Cypriot">Cypriot</option> <option value="Danish">Danish</option> <option value="Dutch">Dutch</option> <option value="English">English</option> <option value="Filipino">Filipino</option> <option value="Finn">Finn</option> <option value="French">French</option> <option value="German">German</option> <option value="Greek">Greek</option> <option value="Hungarian">Hungarian</option> <option value="Indian">Indian</option> <option value="Irish">Irish</option> <option value="Italian">Italian</option> <option value="Japanese">Japanese</option> <option value="Jewish">Jewish</option> <option value="Korean">Korean</option> <option value="Kiwi">Kiwi</option> <option value="Malaysian">Malaysian</option> <option value="Norwegian">Norwegian</option> <option value="Pakistani">Pakistani</option> <option value="Persian">Persian</option> <option value="Polish">Polish</option> <option value="Portuguese">Portuguese</option> <option value="Punjabi">Punjabi</option> <option value="Romanian">Romanian</option> <option value="Russian">Russian</option> <option value="Scottish">Scottish</option> <option value="Slavic">Slavic</option> <option value="South American">South American</option> <option value="Spanish">Spanish</option> <option value="Sri Lankan">Sri Lankan</option> <option value="Thai">Thai</option> <option value="Turkish">Turkish</option> <option value="Vietnamese">Vietnamese</option> <option value="Welsh">Welsh</option> </select>
							</div>
						</div>
						<div class="col-md-3">
							<div class="form-group">
								<label>Religion</label>
								<select id="religion" class="form-control"><option selected="" value="Don't Mind">Don't Mind</option> <option value="Agnostic">Agnostic</option> <option value="Atheist">Atheist</option> <option value="Buddhism">Buddhism</option> <option value="Catholic">Catholic</option> <option value="Hinduism">Hinduism</option> <option value="Islam">Islam</option> <option value="Jedi">Jedi</option> <option value="Judaism">Judaism</option> <option value="Protestant">Protestant</option> <option value="Quaker">Quaker</option> <option value="Sikhism">Sikhism</option> <option value="Spiritual">Spiritual</option> </select>
							</div>
						</div>
					</div>
					<div class="more-opt">
						<div class="row">
							<div class="col-md-9">
								<p>More Options</p>
								<ul class="clearfix">
									<li>
										<a class="btn2" id="int" href="#/">Interests</a>
										<a class="grey-btn" id="lang" href="#/">Languages</a>
									</li>
									<li class="pull-right">
										<a class="gost-btn" id="find2" href="#/">Find</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div id="sias-interests" class="sias-interests">
						<div class="row">
							<div class="col-md-9">
								<p>Hobbies &amp; Interests</p>
								<ul>
									<li>
										<label class="checkbox-inline"><input type="checkbox" value="Socialising & Friendship">Socialising &amp; Friendship</label>
										<label class="checkbox-inline"><input type="checkbox" value="Dating">Dating</label>
										<label class="checkbox-inline"><input type="checkbox" value="Travel & Culture">Travel &amp; Culture</label>
										<label class="checkbox-inline"><input type="checkbox" value="Kids & Parenting">Kids &amp; Parenting</label>
										<label class="checkbox-inline"><input type="checkbox" value="Charity & Fundraising">Charity &amp; Fundraising</label>
									</li>
									<li>
										<label class="checkbox-inline"><input type="checkbox" value="Religion & Spirituality">Religion & Spirituality</label>
										<label class="checkbox-inline"><input type="checkbox" value="Meditation, Yoga & Healing">Meditation, Yoga & Healing</label>
									</li>
									<li>
										<label class="checkbox-inline"><input type="checkbox" value="Board Games">Board Games</label>
										<label class="checkbox-inline"><input type="checkbox" value="Video Games">Video Games</label>
									</li>
									<li>
										<label class="checkbox-inline"><input type="checkbox" value="Art & Antiques">Art & Antiques</label>
										<label class="checkbox-inline"><input type="checkbox" value="Crafts & Hobbies">Crafts & Hobbies</label>
										<label class="checkbox-inline"><input type="checkbox" value="Reading & Writing">Reading & Writing</label>
										<label class="checkbox-inline"><input type="checkbox" value="Tv & Cinema">Tv & Cinema</label>
										<label class="checkbox-inline"><input type="checkbox" value="Instruments & Singing">Instruments & Singing</label>
										<label class="checkbox-inline"><input type="checkbox" value="Listening To Music">Listening To Music</label>
										<label class="checkbox-inline"><input type="checkbox" value="Dancing">Dancing</label>
									</li>
									<li>
										<label class="checkbox-inline"><input type="checkbox" value="Sports & Fitness">Sports & Fitness</label>
										<label class="checkbox-inline"><input type="checkbox" value="Outdoor Pursuits">Outdoor Pursuits</label>
									</li>
									<li>
										<label class="checkbox-inline"><input type="checkbox" value="Cars & Motorcycles">Cars & Motorcycles</label>
									</li>
									<li>
										<label class="checkbox-inline"><input type="checkbox" value="Food & Drink">Food & Drink</label>
										<label class="checkbox-inline"><input type="checkbox" value="Vegetarian & Vegan">Vegetarian & Vegan</label>
										<label class="checkbox-inline"><input type="checkbox" value="Celebrations & Events">Celebrations & Events</label>
										<label class="checkbox-inline"><input type="checkbox" value="Hair & Beauty">Hair & Beauty</label>
										<label class="checkbox-inline"><input type="checkbox" value="Home Decor & Interior Design">Home Decor & Interior Design</label>
									</li>
									<li>
										<label class="checkbox-inline"><input type="checkbox" value="Animals & Pets">Animals & Pets</label>
										<label class="checkbox-inline"><input type="checkbox" value="Science & Nature">Science & Nature</label>
										<label class="checkbox-inline"><input type="checkbox" value="Gardening">Gardening</label>
										<label class="checkbox-inline"><input type="checkbox" value="Photography & Videography">Photography & Videography</label>
									</li>
									<li>
										<label class="checkbox-inline"><input type="checkbox" value="Entrepreneurship & Business">Entrepreneurship & Business</label>
									</li>
								</ul>
								<div class="align-right">
									<a href="#/" id="find3" class="gost-btn">Find</a>
								</div>
							</div>
						</div>
					</div>
					<div id="spok" class="sias-interests spok">
						<div class="row">
							<div class="col-md-9">
								<p>Spoken</p>
								<ul>
									<li>
										<label class="checkbox-inline"><input type="checkbox" value="Arabic">Arabic</label>
										<label class="checkbox-inline"><input type="checkbox" value="Bengali">Bengali</label>
										<label class="checkbox-inline"><input type="checkbox" value="Czech">Czech</label>
										<label class="checkbox-inline"><input type="checkbox" value="Dutch">Dutch</label>
										<label class="checkbox-inline"><input type="checkbox" value="English">English</label>
										<label class="checkbox-inline"><input type="checkbox" value="French">French</label>
										<label class="checkbox-inline"><input type="checkbox" value="Greek">Greek</label>
										<label class="checkbox-inline"><input type="checkbox" value="Hindi">Hindi</label>
										<label class="checkbox-inline"><input type="checkbox" value="Italian">Italian</label>
										<label class="checkbox-inline"><input type="checkbox" value="Japanese">Japanese</label>
										<label class="checkbox-inline"><input type="checkbox" value="Korean">Korean</label>
										<label class="checkbox-inline"><input type="checkbox" value="Malay">Malay</label>
										<label class="checkbox-inline"><input type="checkbox" value="Mandarin">Mandarin</label>
										<label class="checkbox-inline"><input type="checkbox" value="Polish">Polish</label>
										<label class="checkbox-inline"><input type="checkbox" value="Portuguese">Portuguese</label>
										<label class="checkbox-inline"><input type="checkbox" value="Punjabi">Punjabi</label>
										<label class="checkbox-inline"><input type="checkbox" value="Romanian">Romanian</label>
										<label class="checkbox-inline"><input type="checkbox" value="Russian">Russian</label>
										<label class="checkbox-inline"><input type="checkbox" value="Spanish">Spanish</label>
										<label class="checkbox-inline"><input type="checkbox" value="Swedish">Swedish</label>
										<label class="checkbox-inline"><input type="checkbox" value="Thai">Thai</label>
										<label class="checkbox-inline"><input type="checkbox" value="Turkish">Turkish</label>
										<label class="checkbox-inline"><input type="checkbox" value="Ukrainian">Ukrainian</label>
										<label class="checkbox-inline"><input type="checkbox" value="Ukrainians">Ukrainians</label>
									</li>
								</ul>
								<div class="align-right">
									<a href="#/" id="find4" class="gost-btn">Find</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
				<div id="invite_friends" class="tab-pane fade">
					<h2>Invite Friends</h2>
					<p>
						<div class="row">
							<form method="post" action="{{Request::root()}}/user/invite_friends" id="invite-friends-form">
							<input type="hidden" id="token" name="_token" value="{{ csrf_token() }}">
								<div class="col-md-3">
									<div class="form-group">
										<label>Select Event</label>
										<select class="form-control" name="event_id" required>
											<option value="">-- Select Events --</option>
											@foreach($events as $event)
											<option value="{{ $event->id }}">{{ $event->title }}</option>
											@endforeach
										</select>
									</div>
								</div>
								<div class="col-md-3">
									<div class="form-group">
										<label>Email</label>
									<input type="email" class="form-control" name="friend_email" placeholder="eg.example@gmail.com" required>
									</div>
								</div>							
								<div class="col-md-3">
									<div class="form-group">
										<label>&nbsp;</label>
										<button type="submit" class="btn2">Invite</button>
									</div>
								</div>
							</form>
						</div>
					</p>
				</div>
		    </div>	
        </div>
    </div>
</section>
<section id="pending-req" class="my-events pending-req">
    <div class="container">
        <div class="row">
            <div class="col-md-9">
                <div class="dinner-parties clearfix" id="filter_response_data">
                                        
                </div>
            </div>
        </div>
    </div>
</section>
<div id="myModal" class="modal fade" role="dialog">
	<div class="modal-dialog modal-sm invite-pop">
    <div class="modal-content">
		<div class="modal-body">
			<button type="button" class="close" data-dismiss="modal"><img src="{{Request::root()}}/assets/front/img/close-btn.png" alt="" /></button>
			<div class="media">
				<div class="media-left">
					<div class="inner">
						<div class="circle-img"></div>
						<img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="" />
					</div>
				</div>
				<div class="media-body media-middle">
					<h4><strong><span id="username"><span></strong></h4>
				</div>
			</div>
			<input type="hidden" name="friend_id" id="friend_id">
			<div class="form-group">	
				<label><strong>Select Event</strong></label>
				<select name="event_id" id="event_id" class="form-control">
					@foreach($events as $event)
						<option value="{{ $event->id }}">{{ $event->title }}</option>	
					@endforeach									
				</select>
			</div>
			<div class="align-center">
				<button class="btn2 inviteuser" >Invite</button>
			</div>
		</div>
    </div>

  </div>
</div>
<script type="text/javascript">
$(document).ready(function(){
	$('.search-panel .dropdown-menu').find('a').click(function(e) {
		e.preventDefault();
		var param = $(this).attr("href").replace("#","");
		var concept = $(this).text();
		$('.search-panel span#search_concept').text(concept);
		$('.input-group #search_param').val(param);
	});
	
    $('#age-ran').hide();
    $('#sias-interests').hide();
    $('#spok').hide();
    $('#pending-req').hide();
	
	$('#fil').click(function(){
		$('#age-ran').toggle();
		$('#find').toggle();
	})
        
	$('#find').click(function(){
                var distance = $('#select_distance').val();
                $.ajax({
                    url: '{{Request::root()}}/user/search_event',
                    type: 'post',
                    data: {'_token':'{{csrf_token()}}','distance':distance},
                    success: function(data)
					{
                        $('#filter_response_data').html(data);
                    }
                })
		$('#pending-req').show();
	})
        
        $('#find2').click(function(){
                var distance = $('#select_distance').val();
                var age1 = $('#age1').val();
                var age2 = $('#age2').val();
                var gender = $('#gender').val();
                var status = $('#status').val();
                var sexuality = $('#sexuality').val();
                var education = $('#education').val();
                var ethnicity = $('#ethnicity').val();
                var religion = $('#religion').val();
                
                $.ajax({
                    url: '{{Request::root()}}/user/search_event',
                    type: 'post',
                    data: {'_token':'{{csrf_token()}}','distance':distance,'age1':age1,'age2':age2,'gender':gender,'status':status,'sexuality':sexuality,'education':education,'ethnicity':ethnicity,'religion':religion},
                    success: function(data){
                        $('#filter_response_data').html(data);
                    }
                })
		$('#pending-req').show();
	})
        
        $('#find3').click(function(){
                var distance = $('#select_distance').val();
                var age1 = $('#age1').val();
                var age2 = $('#age2').val();
                var gender = $('#gender').val();
                var status = $('#status').val();
                var sexuality = $('#sexuality').val();
                var education = $('#education').val();
                var ethnicity = $('#ethnicity').val();
                var religion = $('#religion').val();
                var hobbies = [];
                var i = 0;
                $('#sias-interests').find('div[class=row]').find('div[class=col-md-9]').find('input[type=checkbox]').each(function(){
                    if($(this).prop('checked') == true){
                        hobbies[i] = $(this).val();
                        i++;
                    }
                })
                
                $.ajax({
                    url: '{{Request::root()}}/user/search_event',
                    type: 'post',
                    data: {'_token':'{{csrf_token()}}','distance':distance,'age1':age1,'age2':age2,'gender':gender,'status':status,'sexuality':sexuality,'education':education,'ethnicity':ethnicity,'religion':religion,'hobbies':hobbies},
                    success: function(data){
                        $('#filter_response_data').html(data);
                    }
                })
		$('#pending-req').show();
	})
        
        $('#find4').click(function(){
                var distance = $('#select_distance').val();
                var age1 = $('#age1').val();
                var age2 = $('#age2').val();
                var gender = $('#gender').val();
                var status = $('#status').val();
                var sexuality = $('#sexuality').val();
                var education = $('#education').val();
                var ethnicity = $('#ethnicity').val();
                var religion = $('#religion').val();
                var languages = [];
                var i = 0;
                $('#spok').find('div[class=row]').find('div[class=col-md-9]').find('input[type=checkbox]').each(function(){
                    if($(this).prop('checked') == true){
                        languages[i] = $(this).val();
                        i++;
                    }
                })
                
                $.ajax({
                    url: '{{Request::root()}}/user/search_event',
                    type: 'post',
                    data: {'_token':'{{csrf_token()}}','distance':distance,'age1':age1,'age2':age2,'gender':gender,'status':status,'sexuality':sexuality,'education':education,'ethnicity':ethnicity,'religion':religion,'languages':languages},
                    success: function(responsedata)
					{
						$('#filter_response_data').html(data);
                    }				
                })
		$('#pending-req').show();
	})
        
	$('#int').click(function(){
            $('#spok').hide();
            $('#sias-interests').toggle();
            if($('#sias-interests').css('display') == 'none'){
                $('#find2').show();
            }
            else{
                $('#find2').hide();
            }
	})
        
	$('#lang').click(function(){
            $('#sias-interests').hide();
            $('#spok').toggle();
            if($('#spok').css('display') == 'none'){
                $('#find2').show();
            }
            else{
                $('#find2').hide();
            }
	})
	
	$('#invite-friends-form').parsley();
	
	var rating = 1.5;
	$(".rateyo-readonly-widg").rateYo({
		  rating: rating,
		  numStars: 5,		  
		  readOnly: true,		 
	}).on("rateyo.change", function (e, data) {
			console.log(data.rating);
	});
	
	//$('.btn2')	
	
	$('.inviteuser').click(function(){
		
		$.ajax({
			   url: '{{Request::root()}}/user/invite_user_for_event',
			   type: 'post',
			   data: {'_token':'{{csrf_token()}}','friend_id':$('#friend_id').val(),'event_id':$('#event_id').val()},
			   success: function(responsedata)
			   {
					alert(responsedata);
					//$('#filter_response_data').html(data);
			   }				
		})
	})
	
});

function inviteuser(USERID, NAME)
{
	$('#friend_id').val(USERID);
	$('#username').html(NAME);
	$('#myModal').modal('show');	
}
</script>
@endsection
