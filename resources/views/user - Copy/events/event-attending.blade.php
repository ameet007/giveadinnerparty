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
<div class="middle-content account-section your-hosting even-ts">
    <div class="container">
        <div class="row clearfix">
            <aside class="col-md-2 left-sidebar">
                <div class="sidenav-list">
                    <ul>
                        <li class=''><a href='#'>Events You’re Following </a></li>
                        <li class=''><a href='{{ Request::root()}}/user/requested_tickets'>Tickets You Requested</a></li>
                        <li class=''><a href='{{ Request::root()}}/user/events_attending'>Events You’re Attending</a></li>
                        <li class=''><a href='{{ Request::root()}}/user/events_attended'>Events You Attended</a></li>
                    </ul>
                </div>
            </aside>
            <article class="col-md-10">
                <div class="dinner-parties">
                    <div class="main-heading">
                        <h2>Events You’re Attending</h2>
                    </div>
                    <div class="row">
                        @foreach($events as $item)
                        <div class="col-md-4">
                            <div class="item">
                                <div class="parties-wrap">
                                    <div class="parties-head">
                                        <h3><a href="{{Request::root()}}/user/event/guest/{{$item->id}}">{{$item->title}}</a></h3>
                                        <p>{{ $item->description }}</p> 
                                        <p>Tickets <span class="price"><i class="fa fa-gbp" aria-hidden="true"></i>{{ $item->ticket_price }} + <i class="fa fa-gbp" aria-hidden="true"></i><a href="#" data-toggle="tooltip" data-placement="bottom" title="">80.00</a></span> booking fee</p>
                                        <div class="event-mf">
                                            <i class="fa <?php
                                                                if ($item->guest_gender == 'Men Only') {
                                                                    echo 'fa-male';
                                                                } elseif ($item->guest_gender == 'Ladies only') {
                                                                    echo 'fa-female';
                                                                } elseif ($item->guest_gender == 'Singles only') {
                                                                    echo "fa-user";
                                                                }
                                                                ?>" aria-hidden="true"></i>
                                            <p>{{ $item->guest_gender }}</p>
                                        </div>
                                    </div>
                                    <div class="parties-host">
                                        <div class="hosted-by">
                                            <div class="img">
                                                <div class="inner">
                                                    <div class="circle-img"></div>
                                                    <img src="{{Request::root()}}/assets/front/img/host-pic.png" alt="" />
                                                </div>
                                                <div class="rateyo-readonly-widg"></div>
                                            </div>
                                            <div class="content">
                                                <p>Hosted By: <strong>{{ $item->name.' '.$item->last_name }}</strong></p>
                                                <p>Aged: <strong><?php /*{{ /8date('Y') - explode('/', $item->dob)[2] }}</strong>*/ ?></p>
                                                <p>Friday {{ $item->event_date }}</p>
                                                <p>{{ $item->start_time }} - {{$item->end_time }}</p>
                                                <p>{{ $item->street }}, {{ $item->city }}, {{ $item->county }}</p>
                                            </div>  
                                        </div>
                                        <div class="hosted-by parties-foot">
                                            <div class="img">
                                                <div class="inner">
                                                    <img src="{{Request::root()}}/assets/admin/uploads/charity/{{ $item->logo }}" alt="" />
                                                </div>
                                            </div>
                                            <div class="content">
                                                 <p><strong>{{ $item->charity_cut }}%</strong> of ticket price will go to {{ $item->title }}</p>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endforeach
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
    
    $(document).ready(function(){
        $('.follow-ing').each(function(){
            var id = $(this).attr('user_id');
            $.ajax({
                url: '{{Request::root()}}/user/follow/'+id,
                type: 'get',
                data: {'type':'check_follow'},
                success: function(result){
                    $('.follow-ing[user_id='+id+']').html(result);
                }
            })
        })
        
        $('.follow-ing').click(function(){
            var id = $(this).attr('user_id');
            $.ajax({
                url: '{{Request::root()}}/user/follow/'+id,
                type: 'get',
                data: {'type':'follow'},
                success: function(result){
                    $('.follow-ing[user_id='+id+']').html(result);
                }
            })
        })
    })
</script>
@endsection('content')