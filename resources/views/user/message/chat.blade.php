@extends('user.layout.fronLayout')
@section('content')

<section class="in-box">
    <div class="container">
        <!-- Page-Title -->
        <div class="row">
            <div class="col-sm-12">
                <div class="page-title-box">
                   
                </div>
            </div>
        </div>
        <!-- end page title end breadcrumb -->
        <div class="row">
            <div class="col-xs-12">
                <div class="mails">
                    <div class="table-box">
                        <div class="table-detail">
                            <div class="p-20">
                                <a href="email-compose.html" class="btn2">Compose</a>
                                <div class="chat-widget hidden-xxs">
                                    <a href="message-inbox-chat.html">
                                        <div class="chat-item">
                                            <div class="chat-item-img">
                                                <div class="over-lay"></div>
                                                <img src="{{Request::root()}}/assets/front/img/avatar-1.jpg" class="" alt="" width="50px" height="50px">
                                            </div>
                                            <div class="chat-right-text">
                                                <strong><p class="chat-item-author">{{$withUser->name}}</p></strong>
                                               
                                            </div>
                                        </div>
                                    </a>

                                </div>

                            </div>
                        </div>

                        <div class="table-detail mail-right">
                            <div class="chat-section">
                                <div class="updated_conversation">
                                @foreach($messages as $msg)
                                <div class="@if($msg->user_id == Auth::guard('user')->user()->id) user2 @else user1 @endif clearfix">
                                    @if($msg->user_id == Auth::guard('user')->user()->id)
                                    <div class="pull-right">
                                    @else
                                    <div class="pull-left">
                                    @endif
                                        <div class="content">
                                            <div class="only-text">
                                                <p>{{$msg->message}}</p>
                                            </div>
                                            <span>{{$msg->humans_time}} ago</span>
                                        </div>
                                    </div>
                                </div>
                                @endforeach
                                </div>
                                <div class="message-send clearfix">
                                    <div class="row">
                                        <div class="col-md-10">
                                            <textarea id='message' class="textarea" placeholder="Message..."></textarea>
                                        </div>
                                        <div class="col-md-2">
                                            <button id='send' class="btn2">Send</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div> <!-- end mails -->
            </div><!-- end col -->
        </div>
        <!-- end row -->
    </div> <!-- end container -->
</section>

<script>
    $('#send').click(function(){
        var message = $('#message').val();
        if(message == ''){
            alert('Please input some message');
            return false;
        }
        else{
            $.ajax({
                url: '{{Request::root()}}/user/sendMessage/{{$withUser->id}}',
                type: 'post',
                data: {'_token':'{{csrf_token()}}','message':message},
                success: function(data){
                    window.location.reload();
                }
            })
        }
    })
    
    var ajaxCall = {
        url: '{{Request::root()}}/user/getUpdatedConversation/{{$withUser->id}}',
        type: 'post',
        data: {'_token':'{{csrf_token()}}'},
        success: function(data){
            $('.updated_conversation').html(data);
        }
    }

    var worker = function worker(){
        $.ajax(ajaxCall);
        setTimeout(worker, 5000);
    }
    
    setTimeout(worker, 5000);
</script>

@endsection