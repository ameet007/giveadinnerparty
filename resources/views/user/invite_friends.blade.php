@extends('user.layout.fronLayout')
@section('content')
<section class="middle-content invite-fri">
    <div class="container">
        <div class="row">
            <h2>Invite Friends</h2>
            <p>If you're hosting an event, you can browse member profiles in your local area and invite any that you think would enjoy your event.</p>
            <p>Please note some members may have opted out of receiving Host invites. You may only invite users with 100% complete profiles.</p>
            <p>You can also save your favourite user profiles by clicking the heart next to their profile picture. We'll email you as soon as they host an event.</p>
            <div class="dis-tance">
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Distance</label>
                            <select class="form-control">
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
                                <option selected="" value="mi">mi</option>
                                <option value="km">km</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>&nbsp;</label>
                            <div class="pull-right">
                                <a href="#" id="fil" class="btn2">Filters</a>
                                <a href="#" id="find" class="grey-btn">Find</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="age-ran" class="age-ran">
                <div class="form-inline">
                    <div class="form-group">
                        <label>Age Range</label>
                        <select class="form-control"> <option selected="" value="18">18</option> <option value="19">19</option> <option value="20">20</option> <option value="21">21</option> <option value="22">22</option> <option value="23">23</option> <option value="24">24</option> <option value="25">25</option> <option value="26">26</option> <option value="27">27</option> <option value="28">28</option> <option value="29">29</option> <option value="30">30</option> <option value="31">31</option> <option value="32">32</option> <option value="33">33</option> <option value="34">34</option> <option value="35">35</option> <option value="36">36</option> <option value="37">37</option> <option value="38">38</option> <option value="39">39</option> <option value="40">40</option> <option value="41">41</option> <option value="42">42</option> <option value="43">43</option> <option value="44">44</option> <option value="45">45</option> <option value="46">46</option> <option value="47">47</option> <option value="48">48</option> <option value="49">49</option> <option value="50">50</option> <option value="51">51</option> <option value="52">52</option> <option value="53">53</option> <option value="54">54</option> <option value="55">55</option> <option value="56">56</option> <option value="57">57</option> <option value="58">58</option> <option value="59">59</option> <option value="60">60</option> <option value="61">61</option> <option value="62">62</option> <option value="63">63</option> <option value="64">64</option> <option value="65">65</option> <option value="66">66</option> <option value="67">67</option> <option value="68">68</option> <option value="69">69</option> <option value="70">70</option> <option value="71">71</option> <option value="72">72</option> <option value="73">73</option> <option value="74">74</option> <option value="75">75</option> <option value="76">76</option> <option value="77">77</option> <option value="78">78</option> <option value="79">79</option> <option value="80">80</option> <option value="81">81</option> <option value="82">82</option> <option value="83">83</option> <option value="84">84</option> <option value="85">85</option> <option value="86">86</option> <option value="87">87</option> <option value="88">88</option> <option value="89">89</option> <option value="90">90</option> <option value="91">91</option> <option value="92">92</option> <option value="93">93</option> <option value="94">94</option> <option value="95">95</option> <option value="96">96</option> <option value="97">97</option> <option value="98">98</option> <option value="99">99</option> <option value="100">100</option> <option value="101">101</option> <option value="102">102</option> <option value="103">103</option> <option value="104">104</option> <option value="105">105</option> <option value="106">106</option> <option value="107">107</option> <option value="108">108</option> <option value="109">109</option> <option value="110">110</option></select>
                    </div>
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <select class="form-control"> <option value="18">18</option> <option value="19">19</option> <option value="20">20</option> <option value="21">21</option> <option value="22">22</option> <option value="23">23</option> <option value="24">24</option> <option value="25">25</option> <option value="26">26</option> <option value="27">27</option> <option value="28">28</option> <option value="29">29</option> <option value="30">30</option> <option value="31">31</option> <option value="32">32</option> <option value="33">33</option> <option value="34">34</option> <option value="35">35</option> <option value="36">36</option> <option value="37">37</option> <option value="38">38</option> <option value="39">39</option> <option value="40">40</option> <option value="41">41</option> <option value="42">42</option> <option value="43">43</option> <option value="44">44</option> <option value="45">45</option> <option value="46">46</option> <option value="47">47</option> <option value="48">48</option> <option value="49">49</option> <option value="50">50</option> <option value="51">51</option> <option value="52">52</option> <option value="53">53</option> <option value="54">54</option> <option value="55">55</option> <option value="56">56</option> <option value="57">57</option> <option value="58">58</option> <option value="59">59</option> <option value="60">60</option> <option value="61">61</option> <option value="62">62</option> <option value="63">63</option> <option value="64">64</option> <option value="65">65</option> <option value="66">66</option> <option value="67">67</option> <option value="68">68</option> <option value="69">69</option> <option value="70">70</option> <option value="71">71</option> <option value="72">72</option> <option value="73">73</option> <option value="74">74</option> <option value="75">75</option> <option value="76">76</option> <option value="77">77</option> <option value="78">78</option> <option value="79">79</option> <option value="80">80</option> <option value="81">81</option> <option value="82">82</option> <option value="83">83</option> <option value="84">84</option> <option value="85">85</option> <option value="86">86</option> <option value="87">87</option> <option value="88">88</option> <option value="89">89</option> <option value="90">90</option> <option value="91">91</option> <option value="92">92</option> <option value="93">93</option> <option value="94">94</option> <option value="95">95</option> <option value="96">96</option> <option value="97">97</option> <option value="98">98</option> <option value="99">99</option> <option value="100">100</option> <option value="101">101</option> <option value="102">102</option> <option value="103">103</option> <option value="104">104</option> <option value="105">105</option> <option value="106">106</option> <option value="107">107</option> <option value="108">108</option> <option value="109">109</option> <option selected="" value="110">110</option></select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Gender</label>
                            <select class="form-control">
                                <option selected="" value="Don't Mind">Don't Mind</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Status</label>
                            <select class="form-control">
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
                            <select class="form-control">
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
                            <select class="form-control">
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
                            <select class="form-control"> <option selected="" value="Don't Mind">Don't Mind</option> <option value="Mixed">Mixed</option> <option value="African (North)">African (Central)</option> <option value="African (North)">African (North)</option> <option value="African (South)">African (South)</option> <option value="African (East)">African (East)</option> <option value="African (West)">African (West)</option> <option value="American">American</option> <option value="Arab">Arab</option> <option value="Australian">Australian</option> <option value="Bengali">Bengali</option> <option value="Canadian">Canadian</option> <option value="Chinese">Chinese</option> <option value="Cypriot">Cypriot</option> <option value="Danish">Danish</option> <option value="Dutch">Dutch</option> <option value="English">English</option> <option value="Filipino">Filipino</option> <option value="Finn">Finn</option> <option value="French">French</option> <option value="German">German</option> <option value="Greek">Greek</option> <option value="Hungarian">Hungarian</option> <option value="Indian">Indian</option> <option value="Irish">Irish</option> <option value="Italian">Italian</option> <option value="Japanese">Japanese</option> <option value="Jewish">Jewish</option> <option value="Korean">Korean</option> <option value="Kiwi">Kiwi</option> <option value="Malaysian">Malaysian</option> <option value="Norwegian">Norwegian</option> <option value="Pakistani">Pakistani</option> <option value="Persian">Persian</option> <option value="Polish">Polish</option> <option value="Portuguese">Portuguese</option> <option value="Punjabi">Punjabi</option> <option value="Romanian">Romanian</option> <option value="Russian">Russian</option> <option value="Scottish">Scottish</option> <option value="Slavic">Slavic</option> <option value="South American">South American</option> <option value="Spanish">Spanish</option> <option value="Sri Lankan">Sri Lankan</option> <option value="Thai">Thai</option> <option value="Turkish">Turkish</option> <option value="Vietnamese">Vietnamese</option> <option value="Welsh">Welsh</option> </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label>Sexuality</label>
                            <select class="form-control"><option selected="" value="Don't Mind">Don't Mind</option> <option value="Agnostic">Agnostic</option> <option value="Atheist">Atheist</option> <option value="Buddhism">Buddhism</option> <option value="Catholic">Catholic</option> <option value="Hinduism">Hinduism</option> <option value="Islam">Islam</option> <option value="Jedi">Jedi</option> <option value="Judaism">Judaism</option> <option value="Protestant">Protestant</option> <option value="Quaker">Quaker</option> <option value="Sikhism">Sikhism</option> <option value="Spiritual">Spiritual</option> </select>
                        </div>
                    </div>
                </div>
                <div class="more-opt">
                    <div class="row">
                        <div class="col-md-9">
                            <p>More Options</p>
                            <ul class="clearfix">
                                <li>
                                    <a class="btn2" id="int" href="#">Interests</a>
                                    <a class="grey-btn" id="lang" href="#">Languages</a>
                                </li>
                                <li class="pull-right">
                                    <a class="gost-btn" id="find2" href="#">Find</a>
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
                                    <label class="checkbox-inline"><input type="checkbox" value="">Socialising &amp; Friendship</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Dating</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Travel &amp; Culture</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Kids &amp; Parenting</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Charity &amp; Fundraising</label>
                                </li>
                                <li>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Religion & Spirituality</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Meditation, Yoga & Healing</label>
                                </li>
                                <li>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Board Games</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Video Games</label>
                                </li>
                                <li>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Art & Antiques</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Crafts & Hobbies</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Reading & Writing</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Tv & Cinema</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Instruments & Singing</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Listening To Music</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Dancing</label>
                                </li>
                                <li>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Sports & Fitness</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Outdoor Pursuits</label>
                                </li>
                                <li>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Cars & Motorcycles</label>
                                </li>
                                <li>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Food & Drink</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Vegetarian & Vegan</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Celebrations & Events</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Hair & Beauty</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Home Decor & Interior Design</label>
                                </li>
                                <li>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Animals & Pets</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Science & Nature</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Gardening</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Photography & Videography</label>
                                </li>
                                <li>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Entrepreneurship & Business</label>
                                </li>
                            </ul>
                            <div class="align-right">
                                <a href="#" id="find3" class="gost-btn">Find</a>
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
                                    <label class="checkbox-inline"><input type="checkbox" value="">Arabic</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Bengali</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Czech</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Dutch</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">English</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">French</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Greek</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Hindi</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Italian</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Japanese</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Korean</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Malay</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Mandarin</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Polish</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Portuguese</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Punjabi</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Romanian</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Russian</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Spanish</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Swedish</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Thai</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Turkish</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Ukrainian</label>
                                    <label class="checkbox-inline"><input type="checkbox" value="">Ukrainians</label>
                                </li>
                            </ul>
                            <div class="align-right">
                                <a href="#" id="find4" class="gost-btn">Find</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<section id="pending-req" class="my-events pending-req">
    <div class="container">
        <div class="row">
            <div class="col-md-9">
                <div class="dinner-parties clearfix">
                    <div class="item col-md-4">
                        <div class="parties-wrap">
                            <div class="parties-head">
                                <div class="tow-btn">
                                    <button data-toggle="modal" data-target="#myModal" class="btn2">Invite</button>
                                    <a href="dinner-party-page-host.html" class="grey-btn">More</a>
                                </div>
                                <h3><a href="dinner-party-page-host.html">Summer BBQ With Cocktails</a></h3>
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
                                        <p>Requested By: <strong>Khairul P.</strong></p>
                                        <p>Aged: <strong>24</strong></p>
                                        <p>Friday 05/05/2017</p>
                                        <p>9.00pm - 12.00am</p>
                                        <p>Bukit Tunku, KL</p>
                                    </div>	
                                </div>
                                <div class="hosted-by parties-foot">
                                    <div class="img">
                                        <div class="inner">
                                            <img src="{{Request::root()}}/assets/front/img/host-logo2.png" alt="" />
                                        </div>
                                    </div>
                                    <div class="content">
                                        <p><strong>100%</strong> of ticket price will go to Action Against Hunger</p>
                                    </div>	
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item col-md-4">
                        <div class="parties-wrap">
                            <div class="parties-head">
                                <div class="tow-btn">
                                    <button class="btn2">Invite</button>
                                    <a href="dinner-party-page-host.html" class="grey-btn">More</a>
                                </div>
                                <h3><a href="dinner-party-page-host.html">Summer BBQ With Cocktails</a></h3>
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
                                        <p>Requested By : <strong>Khairul P.</strong></p>
                                        <p>Aged : <strong>24</strong></p>
                                        <p>Friday 05/05/2017</p>
                                        <p>9.00pm - 12.00am</p>
                                        <p>Bukit Tunku, KL</p>
                                    </div>	
                                </div>
                                <div class="hosted-by parties-foot">
                                    <div class="img">
                                        <div class="inner">
                                            <img src="{{Request::root()}}/assets/front/img/host-logo2.png" alt="" />
                                        </div>
                                    </div>
                                    <div class="content">
                                        <p><strong>100%</strong> of ticket price will go to Action Against Hunger</p>
                                    </div>	
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item col-md-4">
                        <div class="parties-wrap">
                            <div class="parties-head">
                                <div class="tow-btn">
                                    <button class="btn2">Invite</button>
                                    <a href="dinner-party-page-host.html" class="grey-btn">More</a>
                                </div>
                                <h3><a href="dinner-party-page-host.html">Summer BBQ With Cocktails</a></h3>
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
                                        <p>Requested By : <strong>Khairul P.</strong></p>
                                        <p>Aged : <strong>24</strong></p>
                                        <p>Friday 05/05/2017</p>
                                        <p>9.00pm - 12.00am</p>
                                        <p>Bukit Tunku, KL</p>
                                    </div>	
                                </div>
                                <div class="hosted-by parties-foot">
                                    <div class="img">
                                        <div class="inner">
                                            <img src="{{Request::root()}}/assets/front/img/host-logo2.png" alt="" />
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
					<h4><strong>Khairul P.</strong></h4>
				</div>
			</div>
			<div class="form-group">	
				<label><strong>Select Event</strong></label>
				<select class="form-control">
					<option>Summer BBQ With Cocktails2</option>
					<option>Summer BBQ With Cocktails3</option>
					<option>Summer BBQ With Cocktails</option>
				</select>
			</div>
			<div class="align-center">
				<button class="btn2">Invite</button>
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
		$('#age-ran').show();
		$('#find').hide();
	})
	$('#find').click(function(){
		$('#pending-req').show();
	})
	$('#int').click(function(){
		$('#sias-interests').show();
	})
	$('#spok').click(function(){
		$('#spok').show();
		$('#sias-interests').hide();
		$('#find').hide();
	})
	$('#lang').click(function(){
		$('#spok').show();
		$('#sias-interests').hide();
		
	})
	$('#find2').click(function(){
		$('#find2').hide();
		$('#pending-req').show();
	})
});
</script>
@endsection
