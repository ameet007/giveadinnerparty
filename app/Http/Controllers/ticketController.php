<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\events;
use App\Charity;
use App\tickets;
use DB;

class ticketController extends Controller
{
    public function ticket_listing(Request $request, $args='all')
	{
		
		//$methods = get_class_methods('Controller');
		//print_r($methods); die;
		
		
		if($args!='all')
		{	
			if($args=='cancel_request')
			{
				$where = "where tickets.cancel='yes' and tickets.status!='cancel'";
			}
			else
			{
				$where = "where tickets.status='$args'";
			}
		}
		else
		{
			$where ="";
		}
		$tickets = DB::select("select tickets.* ,users.name as user_name ,events.title as event_title from tickets inner join users on tickets.user_id = users.id inner join events on events.id=tickets.event_id $where ");
	
		return view('admin.tickets.listing')->with(['tickets'=>$tickets,]);
	}
	
	
	public function change_ticket_status(Request $request, $id='0')
	{	
		tickets::where('id',$id)->update(['status'=>$request->input('status'), ]);
		return redirect('admin/tickets/all')->with(['success'=>'Status changed successfully']);
	}
	
	public function edit_ticket(Request $request, $id='0')
	{	
	
		if ($request->isMethod('post'))
		{
			$data = $request->all();
			unset($data['_token']);
			tickets::where('id', $id)->update($data);
					
			return redirect('admin/tickets/all')->with(['success' => "status updated successfully"]);
		}	
		$ticket_data = tickets::where('id',$id)->first();
		$event_data = DB::select("SELECT * FROM events where id='$ticket_data->event_id' ");
		
		if($ticket_data->user_type=='user')
		{
			$user_data = DB::select("SELECT name,email FROM users where id='$ticket_data->user_id' ");
		}		
		else
		{
			$user_data = DB::select("SELECT name,email FROM invitefriends where email='$ticket_data->user_id' ");
		}		
		
		$transaction_data = DB::select("SELECT transaction_id FROM transactions where id='$ticket_data->transaction_id'");
		return view('admin.tickets.edit_ticket')->with([ 'ticket'=>$ticket_data,'event'=>$event_data,'user'=>$user_data, 'transaction'=>$transaction_data ]);
	}
}
