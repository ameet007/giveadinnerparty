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
                                <a href="email-compose.html" class="btn2">Compose</a>
                                <div class="chat-widget hidden-xxs">
                                    <a href="message-inbox-chat.html">
                                        <div class="chat-item">
                                            <div class="chat-item-img">
                                                <div class="over-lay"></div>
                                                <img src="{{Request::root()}}/assets/front/img/avatar-1.jpg" class="" alt="" width="50px" height="50px">
                                            </div>
                                            <div class="chat-right-text">
                                                <p class="chat-item-author">Chadengle</p>
                                                <p class="chat-item-text">Hey! there I'm available...</p>
                                            </div>
                                        </div>
                                    </a>

                                    <a href="message-inbox-chat.html">
                                        <div class="chat-item">
                                            <div class="chat-item-img">
                                                <div class="over-lay"></div>
                                                <img src="{{Request::root()}}/assets/front/img/avatar-2.jpg" alt="">
                                            </div>
                                            <div class="chat-right-text">
                                                <p class="chat-item-author">Chadengle</p>
                                                <p class="chat-item-text">Hey! there I'm available...</p>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="message-inbox-chat.html">
                                        <div class="chat-item">
                                            <div class="chat-item-img">
                                                <div class="over-lay"></div>
                                                <img src="{{Request::root()}}/assets/front/img/avatar-3.jpg" alt="">
                                            </div>
                                            <div class="chat-right-text">
                                                <p class="chat-item-author">Chadengle</p>
                                                <p class="chat-item-text">Hey! there I'm available...</p>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="message-inbox-chat.html">
                                        <div class="chat-item">
                                            <div class="chat-item-img">
                                                <div class="over-lay"></div>
                                                <img src="{{Request::root()}}/assets/front/img/avatar-4.jpg" alt="">
                                            </div>
                                            <div class="chat-right-text">
                                                <p class="chat-item-author">Chadengle</p>
                                                <p class="chat-item-text">Hey! there I'm available...</p>
                                            </div>
                                        </div>
                                    </a>

                                </div>

                            </div>
                        </div>

                        <div class="table-detail mail-right">
                            <div class="chat-section">
                                <div class="user1 clearfix">
                                    <div class="pull-left">
                                        <div class="img">
                                            <img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="">
                                        </div>
                                        <div class="content">
                                            <div class="only-text">
                                                <p>Nam dapibus nisl vitae elit fringilla</p>
                                            </div>
                                            <div class="send-img">
                                                <img src="{{Request::root()}}/assets/front/img/chat-send-pic.jpg" alt="">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="user2 clearfix">
                                    <div class="pull-right">
                                        <div class="content">
                                            <div class="only-text">
                                                <p>Nam dapibus nisl vitae elit fringilla</p>
                                            </div>
                                            <div class="send-img">
                                                <img src="{{Request::root()}}/assets/front/img/chat-send-pic.jpg" alt="">
                                            </div>
                                        </div>
                                        <div class="img">
                                            <img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="">
                                        </div>
                                    </div>
                                </div>
                                <div class="message-send clearfix">
                                    <div class="row">
                                        <div class="col-md-10">
                                            <textarea class="textarea" placeholder="Message..."></textarea>
                                        </div>
                                        <div class="col-md-2">
                                            <button class="btn2">Send</button>
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

@endsection