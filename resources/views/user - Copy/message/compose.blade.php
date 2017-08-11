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
                                <a href="#" class="btn2">Compose</a>
                                <div class="chat-widget hidden-xxs">
                                    <a href="#">
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

                                    <a href="#">
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
                                    <a href="#">
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
                                    <a href="#">
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
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="card-box m-t-20">
                                        <div class="">
                                            <form role="form">
                                                <div class="form-group">
                                                    <p>To</p>
                                                </div>
                                                <div class="form-group">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <select class="form-control">
                                                                <option selected="selected">Friends</option>
                                                                <option>Events Guests</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-md-6">
                                                            <select class="form-control">
                                                                <option selected="selected">Friend1</option>
                                                                <option>Friend2</option>
                                                                <option>Friend3</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <input type="text" class="form-control" placeholder="Subject" />
                                                </div>
                                                <div class="form-group">
                                                    <textarea id="ckeditor"></textarea>
                                                </div>
                                                <div class="btn-toolbar form-group m-b-0">
                                                    <div class="pull-right">
                                                        <button class="btn2"> <span>Send</span> <i class="fa fa-send m-l-10"></i> </button>
                                                    </div>
                                                </div>
                                            </form>
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
	CKEDITOR.replace( 'ckeditor' );
</script>

@endsection