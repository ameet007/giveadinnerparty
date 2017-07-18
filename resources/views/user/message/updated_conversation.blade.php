
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