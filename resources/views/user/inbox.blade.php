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

                                    <a href="{{Request::root()}}/user/chat">
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
                            <div class="table-responsive m-t-20">
                                <table class="table table-hover mails m-0">
                                    <tbody>
                                        <tr class="unread">
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox1" type="checkbox">
                                                    <label for="checkbox1"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="{{Request::root()}}/user/chat" class="email-name">Google Inc</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="{{Request::root()}}/user/chat" class="email-msg">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                07:23 AM
                                            </td>
                                        </tr>

                                        <tr class="unread">
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox2" type="checkbox">
                                                    <label for="checkbox2"></label>
                                                </div>
                                            </td>
                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">John Deo</a>
                                            </td>
                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Hi Bro, How are you?</a>
                                            </td>
                                            <td style="width: 20px;">
                                            </td>
                                            <td class="text-right">
                                                07:23 AM
                                            </td>
                                        </tr>

                                        <tr class="unread">
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox3" type="checkbox">
                                                    <label for="checkbox3"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Manager</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Dolor sit amet, consectetuer adipiscing</a>
                                            </td>
                                            <td style="width: 20px;">

                                            </td>
                                            <td class="text-right">
                                                03:00 AM
                                            </td>
                                        </tr>

                                        <tr class="unread">
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox4" type="checkbox">
                                                    <label for="checkbox4"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Google Inc</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                01:23 AM
                                            </td>
                                        </tr>

                                        <tr class="unread">
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox5" type="checkbox">
                                                    <label for="checkbox5"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">John Deo</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Hi Bro, How are you?</a>
                                            </td>
                                            <td style="width: 20px;">

                                            </td>
                                            <td class="text-right">
                                                11 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox6" type="checkbox">
                                                    <label for="checkbox6"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Manager</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Dolor sit amet, consectetuer adipiscing</a>
                                            </td>
                                            <td style="width: 20px;">

                                            </td>
                                            <td class="text-right">
                                                11 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox7" type="checkbox">
                                                    <label for="checkbox7"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Google Inc</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                11 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox8" type="checkbox">
                                                    <label for="checkbox8"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">John Deo</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Hi Bro, How are you?</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                10 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox9" type="checkbox">
                                                    <label for="checkbox9"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Manager</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Dolor sit amet, consectetuer adipiscing</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                10 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox10" type="checkbox">
                                                    <label for="checkbox10"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Google Inc</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</a>
                                            </td>
                                            <td style="width: 20px;">

                                            </td>
                                            <td class="text-right">
                                                10 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox11" type="checkbox">
                                                    <label for="checkbox11"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">John Deo</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Hi Bro, How are you?</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                9 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox12" type="checkbox">
                                                    <label for="checkbox12"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Manager</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Dolor sit amet, consectetuer adipiscing</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                9 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox13" type="checkbox">
                                                    <label for="checkbox13"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Google Inc</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</a>
                                            </td>
                                            <td style="width: 20px;">
                                            </td>
                                            <td class="text-right">
                                                9 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox14" type="checkbox">
                                                    <label for="checkbox14"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">John Deo</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Hi Bro, How are you?</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                9 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox15" type="checkbox">
                                                    <label for="checkbox15"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Manager</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Dolor sit amet, consectetuer adipiscing</a>
                                            </td>
                                            <td style="width: 20px;">

                                            </td>
                                            <td class="text-right">
                                                7 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox16" type="checkbox">
                                                    <label for="checkbox16"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Google Inc</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                7 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox17" type="checkbox">
                                                    <label for="checkbox17"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">John Deo</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Hi Bro, How are you?</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                7 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox18" type="checkbox">
                                                    <label for="checkbox18"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Manager</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Dolor sit amet, consectetuer adipiscing</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                7 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox19" type="checkbox">
                                                    <label for="checkbox19"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">Google Inc</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Lorem ipsum dolor sit amet, consectetuer adipiscing elit</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                7 Oct
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="mail-select">
                                                <div class="checkbox checkbox-primary m-r-15">
                                                    <input id="checkbox20" type="checkbox">
                                                    <label for="checkbox20"></label>
                                                </div>
                                            </td>

                                            <td>
                                                <a href="message-inbox-chat.html" class="email-name">John Deo</a>
                                            </td>

                                            <td class="hidden-xs">
                                                <a href="message-inbox-chat.html" class="email-msg">Hi Bro, How are you?</a>
                                            </td>
                                            <td style="width: 20px;">
                                                <i class="fa fa-paperclip"></i>
                                            </td>
                                            <td class="text-right">
                                                7 Oct
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>


                            <div class="row m-t-20 m-b-30">
                                <div class="col-xs-7 m-t-20">
                                    Showing 1 - 20 of 289
                                </div>
                                <div class="col-xs-5 m-t-20">
                                    <div class="btn-group pull-right">
                                        <button type="button" class="btn btn-default waves-effect"><i class="fa fa-chevron-left"></i></button>
                                        <button type="button" class="btn btn-default waves-effect"><i class="fa fa-chevron-right"></i></button>
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
@endsection('content')