@extends('user.layout.fronLayout')
@section('content')
<div class="middle-content account-section dinnerhost-party">
    <div class="container">
        <div class="row">
            <aside class="col-md-2 left-sidebar">
                <div class="sidenav-list">
                    <ul>
                        <li class=''><a href='#'>Host New Event</a></li>
                        <li class=''><a href='#'>My Active Events</a></li>
                        <li class=''><a href='#'>My Ended Events</a></li>
                        <li class=''><a href='#'>Verify Me As A Host</a></li>
                        <li class=''><a href='#'>Invite Users</a></li>
                    </ul>
                </div>
            </aside>
            <div class="col-md-6 col-sm-12">
                <h2>Friday Night Macaroni And Cheese</h2>
                <ul class="date">
                    <li>Date: 21st May 2016</li>
                    <li>Time: 8.00pm to 9.00pm</li>
                    <li><span>Where <a href="#" data-toggle="tooltip" data-placement="bottom" title="Only guests who purchase tickets will receive these details"><i class="fa fa-question-circle" aria-hidden="true"></i></a>:</span> <span class="addre-s">Aldersgate St, London, EC1A </span></li>
                    <li>Tickets: £80.00 (guests also pay a booking fee)</li>
                    <li>Availability: 0/6 Sold</li>
                    <li>Requiement: This event requires a minimum of <strong>1 ticket sold</strong> to proceed</li>
                    <li>Viewed: 52 times</li>
                </ul>
                <div class="event-o">
                    <h3>Event Description</h3>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    <div class="row">
                        <ul>
                            <li>
                                <div class="col-md-4">
                                    <h4>Age Range:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                                <div class="col-md-4">
                                    <h4>Open To:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                                <div class="col-md-4">
                                    <h4>Gender:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                            </li>
                            <li>
                                <div class="col-md-4">
                                    <h4>Age Range:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                                <div class="col-md-4">
                                    <h4>Open To:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                                <div class="col-md-4">
                                    <h4>Gender:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                            </li>
                            <li>
                                <div class="col-md-4">
                                    <h4>Age Range:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                                <div class="col-md-4">
                                    <h4>Open To:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                                <div class="col-md-4">
                                    <h4>Gender:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                            </li>
                            <li>
                                <div class="col-md-4">
                                    <h4>Age Range:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                                <div class="col-md-4">
                                    <h4>Open To:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                                <div class="col-md-4">
                                    <h4>Gender:</h4>
                                    <p>Don’t Mind</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="event-o parti">
                    <h3>Participants</h3>
                    <p>There are currently 0 participants :(</p>
                </div>
                <div class="event-o ab-charity">
                    <h3>About The Charity</h3>
                    <div class="media">
                        <div class="media-left">
                            <div class="inner">
                                <img src="img/host-logo-big.png" alt="" />
                            </div>
                        </div>
                        <div class="media-body">
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-12">
                <div class="dinner-hostright">
                    <header><span>0/6</span> participants</header>
                    <div class="con-gratulation">
                        <h3>Congratulations on Hosting Your Dinner Party!!</h3>
                        <button class="btn2 btn-block">Edit Event</button>
                        <button class="grey-btn btn-block">Cancel Event</button>
                    </div>
                    <footer>
                        <div class="media">
                            <div class="media-left">
                                <div class="inner">
                                    <img src="img/host-logo-whight.png" class="media-object" />
                                </div>
                            </div>
                            <div class="media-body">
                                <p>100% of ticket price will go to Action Against Hunger</p>
                            </div>
                        </div>
                    </footer>
                </div>
                <div class="dinner-hostright invite-your">
                    <header><a href="invite-friends.html">Invite <img src="img/logo.png" alt="" /> Users</a></header>
                    <header class="mr0">SHARE YOUR EVENT WITH FRIENDS</header>
                    <div class="con-gratulation">
                        <ul>
                            <li><a href="#"><i class="fa fa-facebook-square" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i class="fa fa-twitter-square" aria-hidden="true"></i></i></a></li>
                            <li><a href="#"><i class="fa fa-envelope-square" aria-hidden="true"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection