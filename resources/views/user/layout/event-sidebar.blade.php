<ul>
    <li class='{{ (request()->segment(2)=='my_events')?'active':'' }}'><a href='{{ Request::root()}}/user/my_events'>Events You’re Following </a></li>
    <li class='{{ (request()->segment(2)=='requested_tickets')?'active':'' }}'><a href='{{ Request::root()}}/user/requested_tickets'>Tickets You Requested</a></li>
    <li class='{{ (request()->segment(2)=='events_attending')?'active':'' }}'><a href='{{ Request::root()}}/user/events_attending'>Events You’re Attending</a></li>
    <li class='{{ (request()->segment(2)=='events_attended')?'active':'' }}'><a href='{{ Request::root()}}/user/events_attended'>Events You Attended</a></li>
</ul>
