@extends('user.layout.fronLayout')
@section('content')

<section class="in-box">
	<div class="container">
		<div class="row">
			<div class="col-md-4">
				<div class="search-chat">
					<div class="feild">
						<input type="text" class="textbox" placeholder="Search Messages..." />
					</div>
					<ul>
						<li class="active">
							<div class="img"><img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="" /></div>
							<div class="text">
								<h4>Lim Keat Kuang</h4>
								<p>Lorem Ipsum is simply dummy text of the...</p>
							</div>
						</li>
						<li>
							<div class="img"><img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="" /></div>
							<div class="text">
								<h4>Lim Keat Kuang</h4>
								<p>Lorem Ipsum is simply dummy text of the...</p>
							</div>
						</li>
						<li>
							<div class="img"><img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="" /></div>
							<div class="text">
								<h4>Lim Keat Kuang</h4>
								<p>Lorem Ipsum is simply dummy text of the...</p>
							</div>
						</li>
						<li>
							<div class="img"><img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="" /></div>
							<div class="text">
								<h4>Lim Keat Kuang</h4>
								<p>Lorem Ipsum is simply dummy text of the...</p>
							</div>
						</li>
						<li>
							<div class="img"><img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="" /></div>
							<div class="text">
								<h4>Lim Keat Kuang</h4>
								<p>Lorem Ipsum is simply dummy text of the...</p>
							</div>
						</li>
						<li>
							<div class="img"><img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="" /></div>
							<div class="text">
								<h4>Lim Keat Kuang</h4>
								<p>Lorem Ipsum is simply dummy text of the...</p>
							</div>
						</li>
						<li>
							<div class="img"><img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="" /></div>
							<div class="text">
								<h4>Lim Keat Kuang</h4>
								<p>Lorem Ipsum is simply dummy text of the...</p>
							</div>
						</li>
						<li>
							<div class="img"><img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="" /></div>
							<div class="text">
								<h4>Lim Keat Kuang</h4>
								<p>Lorem Ipsum is simply dummy text of the...</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="col-md-8">
				<div class="chat-section">
					<div class="user1 clearfix">
						<div class="pull-left">
							<div class="img">
								<img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="" />
							</div>
							<div class="content">
								<div class="only-text">
									<p>Nam dapibus nisl vitae elit fringilla</p>
								</div>
								<div class="send-img">
									<img src="{{Request::root()}}/assets/front/img/chat-send-pic.jpg" alt="" />
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
									<img src="{{Request::root()}}/assets/front/img/chat-send-pic.jpg" alt="" />
								</div>
							</div>
							<div class="img">
								<img src="{{Request::root()}}/assets/front/img/chat-pic.jpg" alt="" />
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
	</div>
</section>
 @endsection('content')