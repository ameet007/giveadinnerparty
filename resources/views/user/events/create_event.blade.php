@extends('user.layout.fronLayout')
@section('content')

<div class="pro-header">
    <div class="container your-party">

        <div class="pull-left">
            <h2>Awesome. {{Auth::guard('user')->user()->name}},</h2>
            <h3>Let’s Get You Ready to Host Your Dinner Party</h3>
        </div>

    </div>
</div>

<section class="middle-content host-step">
    <form method='post' id='create_event_form' action='{{Request::root()}}/user/create_event' />
    <input type='hidden' name='_token' value='{{csrf_token()}}' />
    <div class="container">
        <div class="row">
            <h3>Event Details</h3>
            <div class="dat-time">
                <div class="row">
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <h4>Template</h4>
                                <div class="form-group">
                                    <select class="form-control" id="template">
                                        <option selected="selected">Select A Template</option>
                                        @foreach($past_events as $event)
                                        <option value="{{$event->id}}">{{$event->title}}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <h4>Event Title</h4>
                                <div class="form-group">
                                    <input type="text" name='title' class="form-control" placeholder="Title For Your Event" required />
                                </div>
                                @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('title')}}</li>
                                </ul>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <h4>Description</h4>
                                <div class="form-group">
                                    <textarea name='description' class="form-control" required ></textarea>
                                </div>
                                @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('description')}}</li>
                                </ul>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <h3>When And Where Do You Want To Hold Your Events</h3>
            <div class="dat-time">
                <div class="row">
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <h4>Date</h4>
                                <div class="input-group date" data-provide="datepicker">
                                    <input name='event_date' type="text" class="form-control" placeholder="Enter Your Event Date" required />
                                    <div class="input-group-addon">
                                        <span class="glyphicon glyphicon-th"></span>
                                    </div>
                                </div>
                                @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('event_date')}}</li>
                                </ul>
                                @endif
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <h4>Start Time</h4>
                                <div class="form-group">
                                    <select name='start_time_1' class="form-control" id="start_time_1" required > 
                                        <option value="0">0</option> 
                                        <option value="1">1</option> 
                                        <option value="2">2</option> 
                                        <option value="3">3</option> 
                                        <option value="4">4</option> 
                                        <option value="5">5</option> 
                                        <option value="6">6</option> 
                                        <option value="7">7</option>
                                        <option value="8">8</option> 
                                        <option value="9">9</option> 
                                        <option value="10">10</option> 
                                        <option value="11">11</option> 
                                        <option value="12">12</option> 
                                        <option value="13">13</option> 
                                        <option value="14">14</option> 
                                        <option value="15">15</option> 
                                        <option value="16">16</option> 
                                        <option value="17">17</option> 
                                        <option value="18">18</option> 
                                        <option value="19">19</option> 
                                        <option selected="" value="20">20</option> 
                                        <option value="21">21</option> 
                                        <option value="22">22</option> 
                                        <option value="23">23</option> 
                                    </select>
                                </div>
                                @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('start_time_1')}}</li>
                                </ul>
                                @endif
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <h4>&nbsp</h4>
                                <div class="form-group">
                                    <select name='start_time_2' class="form-control" id="sel1"> 
                                        <option selected="" value="00">00</option> 
                                        <option value="15">15</option> 
                                        <option value="30">30</option> 
                                        <option value="45">45</option> 
                                    </select>
                                </div>
                                @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('start_time_2')}}</li>
                                </ul>
                                @endif
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <h4>End Time</h4>
                                    <select name='end_time_1' class="form-control" id="end_time_1"> 
                                        <option value="0">0</option> 
                                        <option value="1">1</option> 
                                        <option value="2">2</option> 
                                        <option value="3">3</option> 
                                        <option value="4">4</option> 
                                        <option value="5">5</option> 
                                        <option value="6">6</option> 
                                        <option value="7">7</option>
                                        <option value="8">8</option> 
                                        <option value="9">9</option> 
                                        <option value="10">10</option> 
                                        <option value="11">11</option> 
                                        <option value="12">12</option> 
                                        <option value="13">13</option> 
                                        <option value="14">14</option> 
                                        <option value="15">15</option> 
                                        <option value="16">16</option> 
                                        <option value="17">17</option> 
                                        <option value="18">18</option> 
                                        <option value="19">19</option> 
                                        <option selected="" value="20">20</option> 
                                        <option value="21">21</option> 
                                        <option value="22">22</option> 
                                        <option value="23">23</option> 
                                    </select>
                                </div>
                                @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('end_time_1')}}</li>
                                </ul>
                                @endif
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <h4>&nbsp</h4>
                                    <select name='end_time_2' class="form-control" id="sel1"> 
                                        <option selected="" value="00">00</option> 
                                        <option value="15">15</option> 
                                        <option value="30">30</option> 
                                        <option value="45">45</option> 
                                    </select>
                                </div>
                                @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('end_time_2')}}</li>
                                </ul>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dat-time loca-tion">
                <div class="row">
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-8 col-sm-12">
                                <h4>Location</h4>
                                <p>Don’t worry, only confirmed, identity verified attendees will see your address</p>
                                <div class="form-group">
                                    <input name='street' type="text" class="form-control" placeholder="Enter Your Street and Home Number" required />
                                </div>
                                @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('street')}}</li>
                                </ul>
                                @endif
                            </div>
                            
                        </div>
                    </div>
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <div class="form-group">
                                        <input name='city' type="text" class="form-control" placeholder="Enter City" required />
                                    </div>
                                    @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('city')}}</li>
                                </ul>
                                @endif
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <div class="form-group">
                                        <input name='county' type="text" class="form-control" placeholder="Enter County" />
                                    </div>
                                    @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('county')}}</li>
                                </ul>
                                @endif
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <div class="form-group">
                                        <select  name="country" class="form-control" required>
                                            <option value="">Country You’re In?</option>
                                            @foreach($country_list as $country)
                                            <option value="{{$country->title}}">{{$country->title}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('country')}}</li>
                                </ul>
                                @endif
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <div class="form-group">
                                        <input name='postal_code' type="text" pattern="[0-9a-zA-Z]+" class="form-control" placeholder="Enter Your Postcode" required />
                                    </div>
                                    @if(ISSET($errors))
                                <ul class="parsley-errors-list filled" id="parsley-id-5">
                                    <li class="parsley-required">{{$errors->first('postal_code')}}</li>
                                </ul>
                                @endif
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container host-step2">
        <div class="row">
            <h3>Decide on Your Party Preferences</h3>
            <div class="dat-time">
                <div class="row">
                    <div class="col-xs-12 feild">
                        <h4>Food And Drinks</h4>
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Event Drink Preference</label>
                                    <select name='drink_preferences' class="form-control" id="sel1">
                                        <option selected="selected">No Alcohol</option>
                                        <option>Alcohol Ok</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Guests Bring Own Drinks</label>
                                    <select name='own_drinks' class="form-control" id="sel1">
                                        <option selected="selected">Don’t Mind</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Which Drinks If Any Are Included?</label>
                                    <input name='drinks_included' type="text" class="form-control" placeholder="Included Drinks" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Food Included</label>
                                    <select name='food_included' class="form-control" id="sel1"> 
                                        <option value="None">None</option>
                                        <option value="Every Guest To Bring A Dish">Every Guest To Bring A Dish</option>
                                        <option value="1 Course">1 Course</option>
                                        <option value="2 Courses">2 Courses</option>
                                        <option value="3 Courses">3 Courses</option>
                                        <option value="4 Courses">4 Courses</option>
                                        <option value="5 Courses">5 Courses</option>
                                        <option value="6 Courses">6 Courses</option>
                                        <option value="7 Courses">7 Courses</option>
                                        <option value="8 Courses">8 Courses</option>
                                        <option value="9 Courses">9 Courses</option>
                                        <option value="10 Courses">10 Courses</option>
                                        <option value="11 Courses">11 Courses</option>
                                        <option value="12 Courses">12 Courses</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Type</label>
                                    <select name='food_type' class="form-control" id="sel1"> 
                                        <option value="Breakfast">Breakfast</option>
                                        <option value="Brunch">Brunch</option>
                                        <option value="Lunch">Lunch</option>
                                        <option value="Afternoon Tea">Afternoon Tea</option>
                                        <option value="Dinner">Dinner</option>
                                        <option value="Miscellaneous">Miscellaneous</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="dat-time dietary-info" id="div_food_drinks">
                <div class="row">
                    <div class="col-xs-12 feild">
                        <h4>Food And Drinks</h4>
                        <label class="checkbox-inline"><input name='food_drink_type[]' type="checkbox" value="Vegetarian">Vegetarian</label>
                        <label class="checkbox-inline"><input name='food_drink_type[]' type="checkbox" value="Vegan">Vegan</label>
                        <label class="checkbox-inline"><input name='food_drink_type[]' type="checkbox" value="Pescatarian">Pescatarian</label> 
                    </div>
                    <div class="col-xs-12 feild">
                        <label class="checkbox-inline"><input name='food_drink_type[]' type="checkbox" value="Halal">Halal</label>
                        <label class="checkbox-inline"><input name='food_drink_type[]' type="checkbox" value="Kosher">Kosher</label>
                        <label class="checkbox-inline"><input name='food_drink_type[]' type="checkbox" value="Gluten Free">Gluten Free</label> 
                    </div>
                </div>
            </div>
            <div class="dat-time event-pre">
                <div class="row">
                    <div class="col-xs-12 feild">
                        <h4>Age and Gender Preference</h4>
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Open To</label>
                                    <select name='open_to' required class="form-control" id="sel1">
                                        <option selected="selected">Don’t Mind</option>
                                        <option>Singles Only</option>
                                        <option>Couples Only</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Gender</label>
                                    <select name='guest_gender' required class="form-control" id="sel1">
                                        <option selected="selected">Don’t Mind</option>
                                        <option>Men Only</option>
                                        <option>Women Only</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Min. Age</label>
                                    <select name='min_age' required class="form-control" id="sel1"> 
                                        <option selected="" value="18">18</option> 
                                        <option value="19">19</option> 
                                        <option value="20">20</option> 
                                        <option value="21">21</option> 
                                        <option value="22">22</option> 
                                        <option value="23">23</option> 
                                        <option value="24">24</option> 
                                        <option value="25">25</option> 
                                        <option value="26">26</option> 
                                        <option value="27">27</option> 
                                        <option value="28">28</option> 
                                        <option value="29">29</option> 
                                        <option value="30">30</option> 
                                        <option value="31">31</option> 
                                        <option value="32">32</option> 
                                        <option value="33">33</option> 
                                        <option value="34">34</option> 
                                        <option value="35">35</option> 
                                        <option value="36">36</option> 
                                        <option value="37">37</option> 
                                        <option value="38">38</option> 
                                        <option value="39">39</option> 
                                        <option value="40">40</option> 
                                        <option value="41">41</option> 
                                        <option value="42">42</option> 
                                        <option value="43">43</option> 
                                        <option value="44">44</option> 
                                        <option value="45">45</option> 
                                        <option value="46">46</option> 
                                        <option value="47">47</option> 
                                        <option value="48">48</option> 
                                        <option value="49">49</option> 
                                        <option value="50">50</option> 
                                        <option value="51">51</option> 
                                        <option value="52">52</option> 
                                        <option value="53">53</option> 
                                        <option value="54">54</option> 
                                        <option value="55">55</option> 
                                        <option value="56">56</option> 
                                        <option value="57">57</option> 
                                        <option value="58">58</option> 
                                        <option value="59">59</option> 
                                        <option value="60">60</option> 
                                        <option value="61">61</option> 
                                        <option value="62">62</option> 
                                        <option value="63">63</option> 
                                        <option value="64">64</option> 
                                        <option value="65">65</option>
                                        <option value="66">66</option> 
                                        <option value="67">67</option> 
                                        <option value="68">68</option> 
                                        <option value="69">69</option> 
                                        <option value="70">70</option> 
                                        <option value="71">71</option> 
                                        <option value="72">72</option> 
                                        <option value="73">73</option> 
                                        <option value="74">74</option> 
                                        <option value="75">75</option> 
                                        <option value="76">76</option>
                                        <option value="77">77</option> 
                                        <option value="78">78</option> 
                                        <option value="79">79</option> 
                                        <option value="80">80</option>
                                        <option value="81">81</option> 
                                        <option value="82">82</option> 
                                        <option value="83">83</option> 
                                        <option value="84">84</option> 
                                        <option value="85">85</option> 
                                        <option value="86">86</option> 
                                        <option value="87">87</option> 
                                        <option value="88">88</option> 
                                        <option value="89">89</option> 
                                        <option value="90">90</option> 
                                        <option value="91">91</option> 
                                        <option value="92">92</option> 
                                        <option value="93">93</option> 
                                        <option value="94">94</option>
                                        <option value="95">95</option> 
                                        <option value="96">96</option> 
                                        <option value="97">97</option> 
                                        <option value="98">98</option> 
                                        <option value="99">99</option> 
                                        <option value="100">100</option> 
                                        <option value="101">101</option> 
                                        <option value="102">102</option> 
                                        <option value="103">103</option> 
                                        <option value="104">104</option> 
                                        <option value="105">105</option> 
                                        <option value="106">106</option> 
                                        <option value="107">107</option> 
                                        <option value="108">108</option> 
                                        <option value="109">109</option>
                                        <option value="110">110</option> 
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Max. Age</label>
                                    <select name='max_age' required class="form-control" id="sel1"> 
                                        <option selected="" value="18">18</option> 
                                        <option value="19">19</option> 
                                        <option value="20">20</option> 
                                        <option value="21">21</option> 
                                        <option value="22">22</option> 
                                        <option value="23">23</option> 
                                        <option value="24">24</option> 
                                        <option value="25">25</option> 
                                        <option value="26">26</option> 
                                        <option value="27">27</option> 
                                        <option value="28">28</option> 
                                        <option value="29">29</option> 
                                        <option value="30">30</option> 
                                        <option value="31">31</option> 
                                        <option value="32">32</option> 
                                        <option value="33">33</option> 
                                        <option value="34">34</option> 
                                        <option value="35">35</option> 
                                        <option value="36">36</option> 
                                        <option value="37">37</option> 
                                        <option value="38">38</option> 
                                        <option value="39">39</option> 
                                        <option value="40">40</option> 
                                        <option value="41">41</option> 
                                        <option value="42">42</option> 
                                        <option value="43">43</option> 
                                        <option value="44">44</option> 
                                        <option value="45">45</option> 
                                        <option value="46">46</option> 
                                        <option value="47">47</option> 
                                        <option value="48">48</option> 
                                        <option value="49">49</option> 
                                        <option value="50">50</option> 
                                        <option value="51">51</option> 
                                        <option value="52">52</option> 
                                        <option value="53">53</option> 
                                        <option value="54">54</option> 
                                        <option value="55">55</option> 
                                        <option value="56">56</option> 
                                        <option value="57">57</option> 
                                        <option value="58">58</option> 
                                        <option value="59">59</option> 
                                        <option value="60">60</option> 
                                        <option value="61">61</option> 
                                        <option value="62">62</option> 
                                        <option value="63">63</option> 
                                        <option value="64">64</option> 
                                        <option value="65">65</option>
                                        <option value="66">66</option> 
                                        <option value="67">67</option> 
                                        <option value="68">68</option> 
                                        <option value="69">69</option> 
                                        <option value="70">70</option> 
                                        <option value="71">71</option> 
                                        <option value="72">72</option> 
                                        <option value="73">73</option> 
                                        <option value="74">74</option> 
                                        <option value="75">75</option> 
                                        <option value="76">76</option>
                                        <option value="77">77</option> 
                                        <option value="78">78</option> 
                                        <option value="79">79</option> 
                                        <option value="80">80</option>
                                        <option value="81">81</option> 
                                        <option value="82">82</option> 
                                        <option value="83">83</option> 
                                        <option value="84">84</option> 
                                        <option value="85">85</option> 
                                        <option value="86">86</option> 
                                        <option value="87">87</option> 
                                        <option value="88">88</option> 
                                        <option value="89">89</option> 
                                        <option value="90">90</option> 
                                        <option value="91">91</option> 
                                        <option value="92">92</option> 
                                        <option value="93">93</option> 
                                        <option value="94">94</option>
                                        <option value="95">95</option> 
                                        <option value="96">96</option> 
                                        <option value="97">97</option> 
                                        <option value="98">98</option> 
                                        <option value="99">99</option> 
                                        <option value="100">100</option> 
                                        <option value="101">101</option> 
                                        <option value="102">102</option> 
                                        <option value="103">103</option> 
                                        <option value="104">104</option> 
                                        <option value="105">105</option> 
                                        <option value="106">106</option> 
                                        <option value="107">107</option> 
                                        <option value="108">108</option> 
                                        <option value="109">109</option>
                                        <option value="110">110</option> 
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Orientation</label>
                                    <select name='orientation' required class="form-control" id="sel1">
                                        <option selected="selected">Don't Mind</option>
                                        <option>Straight</option>
                                        <option>Gay</option>
                                        <option>Lesbian</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dat-time event-pre">
                <div class="row">
                    <div class="col-xs-12 feild">
                        <h4>Event Preference</h4>
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Dress Code</label>
                                    <select name='dress_code' required class="form-control" id="sel1"> 
                                        <option value="As You Like">As You Like</option>
                                        <option value="Casual">Casual</option>
                                        <option value="Smart">Smart</option>
                                        <option value="Formal">Formal</option>
                                        <option value="Fancy Dress">Fancy Dress</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Setting</label>
                                    <select name='setting' required class="form-control" id="sel1">
                                        <option selected="selected">Indoor</option>
                                        <option>Outdoor</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Seating</label>
                                    <select name='seating' required class="form-control" id="sel1"> 
                                        <option value="Around A Table">Around A Table</option>
                                        <option value="Sofa And/or Chairs">Sofa And/or Chairs</option>
                                        <option value="Misc. Incl Sitting On Floor">Misc. Incl Sitting On Floor</option>
                                        <option value="Picnic">Picnic</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container host-step3">
        <div class="row">
            <h3>You’re almost there..</h3>
            <div class="dat-time pr-charity">
                <div class="row">
                    <div class="col-xs-12 feild">
                        <h4>Pricing and Charity</h4>
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Guests (Min)</label>
                                    <input name='min_guests' required type="number" class="form-control" placeholder="1" />
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Guests (Max)</label>
                                    <input name='max_guests' required type="number" class="form-control" placeholder="6" />
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Price Per Ticket ($1 - $100)</label>
                                    <input name='ticket_price' id='ticket_price' required type="number" class="form-control" placeholder="20" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-8 col-sm-12">
                                <div class="form-group">
                                    <label>Charity</label>
                                    <select  name="charity_id" class="form-control" required>
                                        <option value="">Pick A Charity That Means The Most To You</option>
                                        @foreach($charities as $charity)
                                        <option value="{{$charity->id}}">{{$charity->title}}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>Charity Receives</label>
                                    <select name='charity_cut' required class="form-control" id="charity_cut">
                                        <option value="100">100%</option>
                                        <option value="75">75%</option>
                                        <option value="50">50%</option>
                                    </select>
                                    <p id='charity_price'>$0.00 per ticket</p>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12">
                                <div class="form-group">
                                    <label>I Receive</label>
                                    <select class="form-control" id="my_cut">
                                        <option value='0' selected="selected">0%</option>
                                        <option value='25'>25%</option>
                                        <option value='50'>50%</option>
                                    </select>
                                    <p id='my_price'>$0.00 per ticket</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sx-12">
                <div class="row">
                    <div class="col-md-8 col-sm-12">
                        <div class="refer-number">
                            <p>Have you been given a sponsored event reference number for your chosen charity, <i class="fa fa-question-circle" aria-hidden="true"></i></p>
                            <p>If so, please enter this in the box provided below.</p>
                            <input name='reference_number' type="text" class="form-control" placeholder="Reference Number" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="dat-time finally-send">
                <div class="row">
                    <div class="col-xs-12 feild">
                        <div class="row">
                            <div class="col-md-8 col-sm-12">
                                <h4>Finally, Send Your Participants A Warm Welcoming Note</h4>
                                <p>Along with helpful travel instructions to help them get to your place.</p>
                                <div class="form-group">
                                    <textarea name='welcome_note' required class="form-control" placeholder="Say hi, and Tell Them How to Get To Your Place"></textarea>
                                </div>
                                <label><input name='agree' required type="checkbox" value="1">I agree to be contacted by Action Against Hunger to receive my free recipe and fundraising pack and hear more about their work.</label>

                                <label><input name='confirm' required type="checkbox" value="1">I have read and agree to the <a href="#">Terms And Conditions</a> and <a href="#">Privacy Policy</a></label>


                                <label>Confirmed</label>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tow-btn">
                <button type='submit' id='submit_event' class="btn2">Launch Your Dinner Party</button>
            </div>
        </div>
        </form>
    </div>
</section>
<script>
    $(document).ready(function () {
        $('.datepicker').datepicker();
        
        $('#charity_cut').change(function(){
            if($(this).val() == 100){
                $('#my_cut').val('0');
            }
            else if($(this).val() == 75){
                $('#my_cut').val('25');
            }
            else if($(this).val() == 50){
                $('#my_cut').val('50');
            }
            var amount_charity = ($(this).val()*$('#charity_cut').val())/100;
            var text_charity = '$'+amount_charity +' per ticket';
            var amount_my = ($(this).val()*$('#my_cut').val())/100;
            var text_my = '$'+amount_my +' per ticket';
            $('#charity_price').html(text_charity);
            $('#my_price').html(text_my);
        })
        
        $('#my_cut').change(function(){
            if($(this).val() == 50){
                $('#charity_cut').val('50');
            }
            else if($(this).val() == 25){
                $('#charity_cut').val('75');
            }
            else if($(this).val() == 0){
                $('#charity_cut').val('100');
            }
            var amount_charity = ($(this).val()*$('#charity_cut').val())/100;
            var text_charity = '$'+amount_charity +' per ticket';
            var amount_my = ($(this).val()*$('#my_cut').val())/100;
            var text_my = '$'+amount_my +' per ticket';
            $('#charity_price').html(text_charity);
            $('#my_price').html(text_my);
        })
        
        $('#ticket_price').keyup(function(){
            var amount_charity = ($(this).val()*$('#charity_cut').val())/100;
            var text_charity = '$'+amount_charity +' per ticket';
            var amount_my = ($(this).val()*$('#my_cut').val())/100;
            var text_my = '$'+amount_my +' per ticket';
            $('#charity_price').html(text_charity);
            $('#my_price').html(text_my);
        })
        
        $('#template').change(function(){
            var id = $(this).val();
            $.ajax({
                url: '{{Request::root()}}/user/getEventDetails',
                type: 'get',
                data: {'event_id':id},
                success: function(data){
                    data = $.parseJSON(data);
                    $('input[name=title]').val(data.title);
                    $('textarea[name=description]').html(data.description);
                    $('input[name=event_date]').val(data.event_date);
                    if(data.start_time.substr(0,1) == 0){
                        $('select[name=start_time_1]').val(data.start_time.substr(1,1));
                    }
                    else{
                        $('select[name=start_time_1]').val(data.start_time.substr(0,2));
                    }
                    $('select[name=start_time_2]').val(data.start_time.substr(3,2));
                    if(data.start_time.substr(0,1) == 0){
                        $('select[name=end_time_1]').val(data.end_time.substr(1,1));
                    }
                    else{
                        $('select[name=end_time_1]').val(data.end_time.substr(0,2));
                    }
                    $('select[name=end_time_2]').val(data.end_time.substr(3,2));
                    $('input[name=street]').val(data.street);
                    $('input[name=county]').val(data.county);
                    $('input[name=postal_code]').val(data.postal_code);
                    $('input[name=city]').val(data.city);
                    $('select[name=country]').val(data.country);
                    $('select[name=drink_preferences]').val(data.drink_preferences);
                    $('select[name=own_drinks]').val(data.own_drinks);
                    $('input[name=drinks_included]').val(data.drinks_included);
                    $('select[name=food_included]').val(data.food_included);
                    $('select[name=food_type]').val(data.food_type);
                    var food_drink_type = $.parseJSON(data.food_drink_type);
                    $('#div_food_drinks').find('input[type=checkbox]').each(function(){
                        for(var i=0; i<food_drink_type.length; i++){
                            if($(this).val() == food_drink_type[i]){
                                $(this).prop('checked',true);
                            }
                        }
                    });
                    $('select[name=open_to]').val(data.open_to);
                    $('select[name=guest_gender]').val(data.guest_gender);
                    $('select[name=min_age]').val(data.min_age);
                    $('select[name=max_age]').val(data.max_age);
                    $('select[name=orientation]').val(data.orientation);
                    $('select[name=dress_code]').val(data.dress_code);
                    $('select[name=setting]').val(data.setting);
                    $('select[name=seating]').val(data.seating);
                    $('input[name=min_guests]').val(data.min_guests);
                    $('input[name=max_guests]').val(data.max_guests);
                    $('input[name=ticket_price]').val(data.ticket_price);
                    $('select[name=charity_id]').val(data.charity_id);
                    $('select[name=charity_cut]').val(data.charity_cut);
                    $('select[name=my_cut]').val(data.my_cut);
                    $('input[name=reference_number]').val(data.reference_number);
                    $('textarea[name=welcome_note]').html(data.welcome_note);
                }
            })
        })
        
        $('#submit_event').click(function(event){
            event.preventDefault();
            if($('#end_time_1').val() >= $('#start_time_1').val()){
                var error = '<ul class="parsley-errors-list filled" id="parsley-id-5"><li class="parsley-required">Start Time Should Be Less Than End Time</li></ul>';
                $('#start_time_1').parent('div').parent('div').append(error);
                $('#start_time_1').focus();
            }
            else{
                $('#create_event_form').submit();
            }
        })

        $('form').parsley();
    });
</script>

@endsection