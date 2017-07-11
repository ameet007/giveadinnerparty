@extends('user.layout.fronLayout')
@section('content')
 <section class="middle-content profile-edit">
            <div class="container">
                <div class="row per-details">
                    <div class="col-xs-12">
                        <h2>Personal Details</h2>
                    </div>                    
					<div class="col-md-3">
						<div class="pro-pic">
							<div class="over-lay"></div>
							<img src="{{Request::root()}}/assets/front/img/pro-pic.jpg" alt="" />
						</div>
					</div>
					<input type="hidden" id="user_id" value="{{Auth::user()->id}}">
                    <div class="col-md-9">
                        <div class="per-details-right">
                            <div class="table-responsive">
                                <table class="table">
                                    <tbody>
                                        <tr>
                                            <td style="width: 25%;">Name:</td>
                                            <td style="width: 40%"><strong><span id="name">{{Auth::user()->name}} {{Auth::user()->last_name}}</span></strong><input id="name_text" type="text" style="display:none;" value="{{Auth::user()->name}} {{Auth::user()->last_name}}"/></td>
                                            <td style="width: 35%;"><a href="#/" id="edit_name" >Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td>Birth Date:</td>
                                            <td><strong><span id="dob">{{date('d M Y', strtotime(Auth::user()->dob))}}</span></strong>
												<input id="dob_text" class="datepicker" type="text" style="display:none;" value="{{date('m/d/y', strtotime(Auth::user()->dob))}}"/>
											</td>
                                            <td><a href="#/" id="edit_dob">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td>Gender:</td>
                                            <td><span id="gender_text"><strong>{{Auth::user()->gender}}</span>
												<select id="gender" style="display:none;">
													<option {{ (Auth::user()->gender=='Male')?'selected':'' }} value="Male">Male</option>
													<option {{ (Auth::user()->gender=='Female')?'selected':'' }} value="Female">Female</option>													
												</select>
											</strong>
												
											</td>
                                            <td><a href="#/" id="edit_gender">Edit</a></td>
                                        </tr>
                                        <tr>
                                            <td>Status:</td>
                                            <td><strong><span id="status_text">@if(!EMPTY(Auth::user()->status)) {{Auth::user()->status}} @else Not Specified @endif</span></strong>
											<select id="status" style="display:none;"> 
												<option  value="Not Specified">Not Specified</option>
												<option {{ (Auth::user()->status=='Single')?'selected':'' }} value="Single">Single</option>
												<option {{ (Auth::user()->status=='In A Relationship')?'selected':'' }} value="In A Relationship">In A Relationship</option>
												<option {{ (Auth::user()->status=='Married')?'selected':'' }} value="Married">Married</option>
											</select>
											
											</td>
                                            <td><a href="#/" id="edit_status">Edit</a></td>
                                        </tr>
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row con-details">
                    <h2>Contact Details</h2>
                    <p>(These Details Are Not Availble to Other Users)</p>
                    <div class="table-responsive">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td style="width: 15%;">Email:</td>
                                    <td style="width: 25%"><strong>{{Auth::user()->email}}</strong></td>
                                    <td><!--<a href="#">Edit</a>--></td>
                                </tr>
                                <tr>
                                    <td>Tel No:</td>
                                    <td><strong><span id="telephone">{{Auth::user()->telephone}}</span></strong>
										<input id="telephone_text" type="text" value="{{Auth::user()->telephone}}" style="display:none;" />
									</td>
                                    <td><a href="#/" id="telephone_edit">Edit</a></td>
                                </tr>
                                <tr>
                                    <td>Address:</td>
                                    <td><strong><span id="address_text">{{Auth::user()->address}}<br>{{Auth::user()->town}}<br>{{Auth::user()->county}}<br>{{Auth::user()->country}}<br>{{Auth::user()->postcode}}</span></strong>
										<span id="address_row" style="display:none;">
											<input id="address" type="text" value="{{Auth::user()->address}}" placeholder="address"/><br>
											<input id="town" type="text" value="{{Auth::user()->town}}" placeholder="town"/><br>
											<input id="county" type="text" value="{{Auth::user()->county}}" placeholder="county"/><br>
											<input id="country" type="text" value="{{Auth::user()->country}}" placeholder="country"/><br>
											<input id="postcode" type="text" value="{{Auth::user()->postcode}}" placeholder="postcode"/>											
										</span>
									</td>
                                    <td><a href="#/" id="edit_address">Edit</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row con-details a-little">
                    <h2>A little More About You..</h2>
                    <div class="table-responsive">
                        <table class="table">
                            <tbody>
								<tr>
                                    <td>Biography:</td>
                                    <td><strong><span id="bio">@if(!EMPTY(Auth::user()->about)) {{Auth::user()->about}} @else Not Specified @endif</span></strong>
										<textarea id="bio_text" class="bio_text" style="display:none;" />@if(!EMPTY(Auth::user()->about)) {{Auth::user()->about}} @else Not Specified @endif</textarea>
									</td>
                                    <td><a href="#/" id="edit_bio">Edit</a></td>
                                </tr>
                                <tr>
                                    <td style="width: 15%;">Profession:</td>
                                    <td style="width: 25%"><strong><span id="profession_text">@if(!EMPTY(Auth::user()->profession)) {{Auth::user()->profession}} @else Not Specified @endif</span></strong>
										<input id="profession" type="text" style="display:none;" value="@if(!EMPTY(Auth::user()->profession)) {{Auth::user()->profession}} @else Not Specified @endif" />
									</td>
                                    <td><a href="#/" id="edit_profession">Edit</a></td>
                                </tr>
                                <tr>
                                    <td>Education:</td>
                                    <td><strong><span id="education_text">@if(!EMPTY(Auth::user()->education)) {{Auth::user()->education}} @else Not Specified @endif</span></strong>
									<input id="education" type="text" style="display:none;" value="@if(!EMPTY(Auth::user()->education)) {{Auth::user()->education}} @else  @endif" />	
									</td>
                                    <td><a href="#/" id="edit_education">Edit</a></td>
                                </tr>
								<tr>
                                            <td>Ethnicity:</td>
                                            <td><strong><span id="ethnicity_text">@if(!EMPTY(Auth::user()->ethnicity)) {{Auth::user()->ethnicity}} @else Not Specified @endif</span></strong>
											<select id="ethnicity" style="display:none;"> 
												<option  value="Not Specified">Not Specified</option>
												<option {{ (Auth::user()->ethnicity=='Mixed')?'selected':'' }} value="Mixed">Mixed</option>
												<option {{ (Auth::user()->ethnicity=='African (Central)')?'selected':'' }} value="African (Central)">African (Central)</option>
												<option {{ (Auth::user()->ethnicity=='African (North)')?'selected':'' }} value="African (North)">African (North)</option>
												<option {{ (Auth::user()->ethnicity=='African (South)')?'selected':'' }} value="African (South)">African (South)</option>
												<option {{ (Auth::user()->ethnicity=='African (East)')?'selected':'' }} value="African (East)">African (East)</option>
												<option {{ (Auth::user()->ethnicity=='African (West)')?'selected':'' }} value="African (West)">African (West)</option>
												<option {{ (Auth::user()->ethnicity=='American')?'selected':'' }} value="American">American</option>
												<option {{ (Auth::user()->ethnicity=='Arab')?'selected':'' }} value="Arab">Arab</option>
												<option {{ (Auth::user()->ethnicity=='Australian')?'selected':'' }} value="Australian">Australian</option>
												<option {{ (Auth::user()->ethnicity=='Bengali')?'selected':'' }} value="Bengali">Bengali</option>
												<option {{ (Auth::user()->ethnicity=='Canadian')?'selected':'' }} value="Canadian">Canadian</option>
												<option {{ (Auth::user()->ethnicity=='Chinese')?'selected':'' }} value="Chinese">Chinese</option>
												<option {{ (Auth::user()->ethnicity=='Cypriot')?'selected':'' }} value="Cypriot">Cypriot</option>
												<option {{ (Auth::user()->ethnicity=='Danish')?'selected':'' }} value="Danish">Danish</option>
												<option {{ (Auth::user()->ethnicity=='Dutch')?'selected':'' }} value="Dutch">Dutch</option>
												<option {{ (Auth::user()->ethnicity=='English')?'selected':'' }} value="English">English</option>
												<option {{ (Auth::user()->ethnicity=='Filipino')?'selected':'' }} value="Filipino">Filipino</option>
												<option {{ (Auth::user()->ethnicity=='Finn')?'selected':'' }} value="Finn">Finn</option>
												<option {{ (Auth::user()->ethnicity=='French')?'selected':'' }} value="French">French</option>
												<option {{ (Auth::user()->ethnicity=='German')?'selected':'' }} value="German">German</option>
												<option {{ (Auth::user()->ethnicity=='Greek')?'selected':'' }} value="Greek">Greek</option>
												<option {{ (Auth::user()->ethnicity=='Hungarian')?'selected':'' }} value="Hungarian">Hungarian</option>
												<option {{ (Auth::user()->ethnicity=='Indian')?'selected':'' }} value="Indian">Indian</option>
												<option {{ (Auth::user()->ethnicity=='Irish')?'selected':'' }} value="Irish">Irish</option>
												<option {{ (Auth::user()->ethnicity=='Italian')?'selected':'' }} value="Italian">Italian</option>
												<option {{ (Auth::user()->ethnicity=='Japanese')?'selected':'' }} value="Japanese">Japanese</option>
												<option {{ (Auth::user()->ethnicity=='Jewish')?'selected':'' }} value="Jewish">Jewish</option>
												<option {{ (Auth::user()->ethnicity=='Korean')?'selected':'' }} value="Korean">Korean</option>
												<option {{ (Auth::user()->ethnicity=='Kiwi')?'selected':'' }} value="Kiwi">Kiwi</option>
												<option {{ (Auth::user()->ethnicity=='Malaysian')?'selected':'' }} value="Malaysian">Malaysian</option>
												<option {{ (Auth::user()->ethnicity=='Norwegian')?'selected':'' }} value="Norwegian">Norwegian</option>
												<option {{ (Auth::user()->ethnicity=='Pakistani')?'selected':'' }} value="Pakistani">Pakistani</option>
												<option {{ (Auth::user()->ethnicity=='Persian')?'selected':'' }} value="Persian">Persian</option>
												<option {{ (Auth::user()->ethnicity=='Polish')?'selected':'' }} value="Polish">Polish</option>
												<option {{ (Auth::user()->ethnicity=='Portuguese')?'selected':'' }} value="Portuguese">Portuguese</option>
												<option {{ (Auth::user()->ethnicity=='Punjabi')?'selected':'' }} value="Punjabi">Punjabi</option>
												<option {{ (Auth::user()->ethnicity=='Romanian')?'selected':'' }} value="Romanian">Romanian</option>
												<option {{ (Auth::user()->ethnicity=='Russian')?'selected':'' }} value="Russian">Russian</option>
												<option {{ (Auth::user()->ethnicity=='Scottish')?'selected':'' }} value="Scottish">Scottish</option>
												<option {{ (Auth::user()->ethnicity=='Slavic')?'selected':'' }} value="Slavic">Slavic</option>
												<option {{ (Auth::user()->ethnicity=='South American')?'selected':'' }} value="South American">South American</option>
												<option {{ (Auth::user()->ethnicity=='Spanish')?'selected':'' }} value="Spanish">Spanish</option>
												<option {{ (Auth::user()->ethnicity=='Sri Lankan')?'selected':'' }} value="Sri Lankan">Sri Lankan</option>
												<option {{ (Auth::user()->ethnicity=='Thai')?'selected':'' }} value="Thai">Thai</option>
												<option {{ (Auth::user()->ethnicity=='Turkish')?'selected':'' }} value="Turkish">Turkish</option>
												<option {{ (Auth::user()->ethnicity=='Vietnamese')?'selected':'' }} value="Vietnamese">Vietnamese</option>
												<option {{ (Auth::user()->ethnicity=='Welsh')?'selected':'' }} value="Welsh">Welsh</option>
											</select>
											
											</td>
                                            <td><a href="#/" id="edit_ethnicity">Edit</a></td>
                                        </tr>
										
										
										<tr>
                                            <td>Sexuality:</td>
                                            <td><strong><span id="sexuality_text">@if(!EMPTY(Auth::user()->sexuality)) {{Auth::user()->sexuality}} @else Not Specified @endif</span></strong>
											<select id="sexuality" style="display:none;"> 
												<option  value="Not Specified">Not Specified</option>
												<option {{ (Auth::user()->sexuality=='Straight')?'selected':'' }} value="Straight">Straight</option> 
												<option {{ (Auth::user()->sexuality=='Gay')?'selected':'' }} value="Gay">Gay</option> 
												<option {{ (Auth::user()->sexuality=='Lesbian')?'selected':'' }} value="Lesbian">Lesbian</option>
											</select>
											
											</td>
                                            <td><a href="#/" id="edit_sexuality">Edit</a></td>
                                        </tr>
                                <tr>
                                    <td>Religion:</td>
                                    <td><strong><span id="religion_text">@if(!EMPTY(Auth::user()->religion)) {{Auth::user()->religion}} @else Not Specified @endif</span></strong>
									<input id="religion" type="text" style="display:none;" value="@if(!EMPTY(Auth::user()->religion)) {{Auth::user()->religion}} @else @endif" />
									</td>
                                    <td><a href="#/" id="edit_religion">Edit</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row spo-lang">
                    <div class="table-responsive spokenlanguage">
						<input type="hidden" id="spokenlanguage_data" value="{{ Auth::user()->spoken_languages }}">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td style="width: 15%"><strong>Spoken Language:</strong></td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Arabic" /> Arabic
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Bengali"/> Bengali
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Czech"/> Czech
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Dutch"/> Dutch
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="English"/> English
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="French"/> French
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="German"/> German
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Greek"/> Greek
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Hindi"/> Hindi
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Italian"/> Italian
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Japanese"/> Japanese
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Korean"/> Korean
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Malay" /> Malay
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Mandarin"/> Mandarin
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Polish"/> Polish
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Portuguese"/> Portuguese
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Punjabi"/> Punjabi
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Romanian"/> Romanian
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Russian"/> Russian
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Spanish" /> Spanish
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Swedish"/> Swedish
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Thai"/> Thai
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Turkish"/> Turkish
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Ukrainian" /> Ukrainian
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Vietnamese" /> Vietnamese
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row spo-lang hob-interest hobbies">
                    <div class="table-responsive" >
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td style="width: 15%"><strong>Hobbies &amp; Interest</strong></td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Socialising & Friendship" /> Socialising & Friendship
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Dating" /> Dating
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Travel & Culture" /> Travel & Culture
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Kids & Parenting" /> Kids & Parenting
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Charity & Fundraising" /> Charity & Fundraising
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Religion & Spirituality" /> Religion & Spirituality
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Meditation, Yoga & Healing" /> Meditation, Yoga & Healing
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Board Games" /> Board Games
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Video Games" /> Video Games
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Card Games" /> Card Games
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Art & Antiques" /> Art & Antiques
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Crafts & Hobbies" /> Crafts & Hobbies
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Reading & Writing" /> Reading & Writing
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Tv & Cinema" /> Tv & Cinema
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Instruments & Singing" /> Instruments & Singing
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Listening To Music" /> Listening To Music
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Dancing" /> Dancing
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Sports & Fitness" /> Sports & Fitness
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Outdoor Pursuits" /> Outdoor Pursuits
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Cars & Motorcycles" /> Cars & Motorcycles
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Food & Drink" /> Food & Drink
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Vegetarian & Vegan" /> Vegetarian & Vegan
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Celebrations & Events" /> Celebrations & Events
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Hair & Beauty" /> Hair & Beauty
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Home Decor & Interior Design" /> Home Decor & Interior Design
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Animals & Pets" /> Animals & Pets
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Science & Nature" /> Science & Nature
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Gardening" /> Gardening
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Photography & Videography" /> Photography & Videography
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" value="Entrepreneurship & Business" /> Entrepreneurship & Business
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
		<input type="hidden" id="token" name="_token" value="{{ csrf_token() }}">
		 <script type="text/javascript">		
        $(document).on('click','#edit_name',function(){
            var name = $('#name').html();
			var name_text = $('#name_text').val();
            $('#name').toggle();
            //$('#name_text').val(name);
            $('#name_text').toggle();
            if($(this).html() == "Edit")
			{				
                $(this).html('Save');
            }
            else
			{
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();				
				
				var full_name_split = name_text.split(" ");
				var first_name = full_name_split[0];
				var lname = full_name_split.length > 1 ? full_name_split[full_name_split.length - 1] : null;
				
				$.ajax({
					url: '<?php echo url('/user/ajax_user_update'); ?>',
					type: 'POST',
					data : { '_token': token, id : user_id, name : first_name, last_name:lname },
					//dataType: 'JSON',
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#name').html(name_text);
                $(this).html('Edit');
            }
        })
		
		$(document).on('click','#edit_dob',function(){
            var dob = $('#dob').html();
            $('#dob').toggle();
            //$('#dob_text').val(dob);
            $('#dob_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{					
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();		
				var dob_text = $('.datepicker').val();
				if(dob_text!="")
				{	
					$.ajax({
						url: '<?php echo url('/user/ajax_user_update'); ?>',
						type: 'POST',
						data : { '_token': token, id : user_id, dob : dob_text },
						//dataType: 'JSON',
						success: function(data)
						{
							//alert(dob_text);
							console.log(data);
						},
						error: function(xhr, ajaxOptions, thrownError)
						{
							alert(xhr.status);
						},	
					});
					
					$('#dob').html(dob_text);
					$(this).html('Edit');
				}
            }
        })
		
		$(document).on('click','#edit_bio',function(){
            var bio = $('#bio').html();
            $('#bio').toggle();
			//$('#bio_text').val(bio);
            $('#bio_text').toggle();
            if($(this).html() == "Edit"){
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var bio_text = $('.bio_text').val();				
				$.ajax({
					url: '<?php echo url('/user/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, about:bio_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(bio_text);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#bio').html(bio_text);
                $(this).html('Edit');
            }
        })
		
		
		$(document).on('click','#telephone_edit',function(){
            var telephone = $('#telephone').html();
            $('#telephone').toggle();
            $('#telephone_text').toggle();
            if($(this).html() == "Edit"){
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var telephone_text = $('#telephone_text').val();				
				$.ajax({
					url: '<?php echo url('/user/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, telephone:telephone_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#telephone').html(telephone_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		$(document).on('click','#edit_profession',function(){
            var profession = $('#profession').html();
            $('#profession').toggle();
            $('#profession_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var profession_text = $('#profession').val();				
				$.ajax({
					url: '<?php echo url('/user/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, profession:profession_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#profession_text').html(profession_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		
		$(document).on('click','#edit_education',function(){
            var education = $('#education').html();
            $('#education').toggle();
            $('#education_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var education_text = $('#education').val();				
				$.ajax({
					url: '<?php echo url('/user/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, education:education_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#education_text').html(education_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		$(document).on('click','#edit_religion',function(){
            var religion = $('#religion').html();
            $('#religion').toggle();
            $('#religion_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var religion_text = $('#religion').val();				
				$.ajax({
					url: '<?php echo url('/user/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, religion:religion_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#religion_text').html(religion_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		$(document).on('click','#edit_status',function(){
            var status = $('#status').html();
            $('#status').toggle();
            $('#status_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var status_text = $('#status').val();				
				$.ajax({
					url: '<?php echo url('/user/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, status:status_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#status_text').html(status_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		$(document).on('click','#edit_sexuality',function(){
            var sexuality = $('#sexuality').html();
            $('#sexuality').toggle();
            $('#sexuality_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var sexuality_text = $('#sexuality').val();				
				$.ajax({
					url: '<?php echo url('/user/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, sexuality:sexuality_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#sexuality_text').html(sexuality_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		$(document).on('click','#edit_ethnicity',function(){
            var ethnicity = $('#ethnicity').html();
            $('#ethnicity').toggle();
            $('#ethnicity_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var ethnicity_text = $('#ethnicity').val();				
				$.ajax({
					url: '<?php echo url('/user/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, ethnicity:ethnicity_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#ethnicity_text').html(ethnicity_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		$(document).on('click','#edit_address',function(){
           // var name = $('#name').html();
            $('#address_text').toggle();
            //$('#name_text').val(name);
            $('#address_row').toggle();
            if($(this).html() == "Edit"){
                $(this).html('Save');
            }
            else
			{
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				
				var address = $('#address').val();
				var town = $('#town').val();
				var county = $('#county').val();
				var country = $('#country').val();
				var postcode = $('#postcode').val();
				
				$.ajax({
					url: '<?php echo url('/user/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, address:address, town:town, county:county, country:country, postcode:postcode },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				$('#address_text').html(address+'<br>'+town+'<br>'+county+'<br>'+country+'<br>'+postcode);
                $(this).html('Edit');
            }
        })
		
		
		$(document).on('click','#edit_gender',function(){
            var gender = $('#gender').html();
            $('#gender').toggle();
            $('#gender_text').toggle();
            if($(this).html() == "Edit")
			{
                $(this).html('Save');
            }
            else
			{				
				var token = $('#token').val(); 
				var user_id = $('#user_id').val();
				var gender_text = $('#gender').val();				
				$.ajax({
					url: '<?php echo url('/user/ajax_user_update'); ?>',
					type: 'POST',
					data : {'_token': token, id : user_id, gender:gender_text },
					//dataType: 'JSON',
					cache: false,
					success: function(data)
					{
						//alert(data);
						console.log(data);
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						alert(xhr.status);
					},	
				});
				
				$('#gender_text').html(gender_text);
                $(this).html('Edit');
                //$(this).html('Edit');
            }
        })
		
		/*
		$(document).on('click','#edit_name',function(){
            var name = $('#name').html();
            $('#name').toggle();
            $('#name_text').val(name);
            $('#name_text').toggle();
            if($(this).html() == "Edit"){
                $(this).html('Save');
            }
            else{
                $(this).html('Edit');
            }
        })*/		
		
		
		$('.spokenlanguage').find('input[type=checkbox]').click(function(event) {
			var values = {};
			$('.spokenlanguage input:checkbox:checked').each(function() {
				if (values[this.title])
				  values[this.title].push(this.value);
				else
				  values[this.title] = [this.value];
			});
			
			var token = $('#token').val(); 
			var user_id = $('#user_id').val();
			var languages = JSON.stringify(values).replace('{"":[', '[').replace(']}', ']');				
			$.ajax({
				url: '<?php echo url('/user/ajax_user_update'); ?>',
				type: 'POST',
				data : {'_token': token, id : user_id, spoken_languages:languages },
				//dataType: 'JSON',
				cache: false,
				success: function(data)
				{
					//alert(data);
					console.log(data);
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					alert(xhr.status);
				},	
			});			
		});
		
		$('.hobbies').find('input[type=checkbox]').click(function(event) {
			var values = {};
			$('.hobbies input:checkbox:checked').each(function() {
				if (values[this.title])
				  values[this.title].push(this.value);
				else
				  values[this.title] = [this.value];
			});
			
			var token = $('#token').val(); 
			var user_id = $('#user_id').val();
			var hobbies_data = JSON.stringify(values).replace('{"":[', '[').replace(']}', ']');	
			//alert(hobbies_data);
			$.ajax({
				url: '<?php echo url('/user/ajax_user_update'); ?>',
				type: 'POST',
				data : {'_token': '{{csrf_token()}}', id : user_id, hobbies:hobbies_data },
				//dataType: 'JSON',
				cache: false,
				success: function(data)
				{
					//alert(data);
					console.log(data);
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					alert(xhr.status);
				},	
			});			
		});
		@if (Auth::guard('user')->check())
		$(document).ready(function(){			
			var language_data = {!! (Auth::user()->spoken_languages!="")?Auth::user()->spoken_languages:"['no data']"; !!};
			$('.spokenlanguage input[type=checkbox]').each(function(){
				var checked = false;
				for(var i=0; i<language_data.length; i++){					
					if($(this).val() == language_data[i]){
						$(this).prop('checked',true);
					}
				}
			})
			
			var hosting_option = {!! (Auth::user()->hobbies!="")?Auth::user()->hobbies:"['no data']"; !!};
			$('.hobbies input[type=checkbox]').each(function(){
				var checked = false;
				for(var i=0; i<hosting_option.length; i++){					
					if($(this).val() == hosting_option[i]){
						$(this).prop('checked',true);
					}
				}
			})
		})
		@endif
        </script>
@endsection
