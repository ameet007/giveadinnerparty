@extends('user.layout.fronLayout')
@section('content')

<section class="in-box">
    <div class="container">
        <!-- Page-Title -->
        <div class="row">
            <div class="col-sm-12">
                <div class="page-title-box">
                    <h4 class="page-title">Inbox</h4>
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
                                <a href="{{Request::root()}}/user/compose" class="btn2">Compose</a>
                                <div class="chat-widget hidden-xxs">
                                    @foreach($inboxes as $inbox)
                                    <a href="{{Request::root()}}/user/chat/{{$inbox->thread->conversation_id}}">
                                        <div class="chat-item">
                                            <div class="chat-item-img">
                                                <div class="over-lay"></div>
                                                <img src="{{Request::root()}}/assets/front/img/avatar-1.jpg" class="" alt="" width="50px" height="50px">
                                            </div>
                                            <div class="chat-right-text">
                                                <strong><p class="chat-item-author">{{$inbox->withUser->name}}</p></strong>
                                                
                                            </div>
                                        </div>
                                    </a>
                                    @endforeach
                                </div>

                            </div>
                        </div>

                        <div class="table-detail mail-right">
                            <div class="table-responsive m-t-20">
                                <table class="table table-hover mails m-0 myTable">
                                    <thead>
                                        <tr class="unread" style="display:none;">
                                            <td class="mail-select">
                                                
                                            </td>

                                            <td>
                                                
                                            </td>

                                            <td class="hidden-xs" style="min-width: 370px;">
                                                
                                            </td>
                                            <td style="width: 20px;">
                                                
                                            </td>
                                            <td class="text-right">
                                               
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach($inboxes as $inbox)
                                        <tr class="unread">
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox1" type="checkbox">
                                                    <label for="checkbox1"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="{{Request::root()}}/user/chat/{{$inbox->thread->conversation_id}}" class="email-name">{{$inbox->withUser->name}}</a>
                                            </td>

                                            <td class="hidden-xs" style="min-width: 370px;">
                                                <a href="{{Request::root()}}/user/chat/{{$inbox->thread->conversation_id}}" class="email-msg">{{$inbox->thread->message}}</a>
                                            </td>
                                            <td style="width: 20px;">
                                                
                                            </td>
                                            <td class="text-right">
                                                {{$inbox->thread->humans_time}}
                                            </td>
                                        </tr>
                                        @endforeach

                                        

                                    </tbody>
                                </table>
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
$(document).ready(function(){
    $('.myTable').DataTable();
});
</script>
@endsection('content')