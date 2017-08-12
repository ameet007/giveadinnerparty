@extends('admin.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">Edit Ticket</h4>
            <ol class="breadcrumb p-0 m-0">

              <li>
                <a href="{{Request::root()}}/admin/home">Admin</a>
              </li>
              <li class="active">Edit Ticket</li>
            </ol>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <!-- end row -->

      <div class="row m-t-50">
        <div class="col-sm-12">

          <div class="alert alert-warning hidden fade in">
            <p>Please fill out all the fields correctly</p>
          </div>

          <form enctype="multipart/form-data" id="demo-form" method="post" action="{{Request::root()}}/admin/ticket/edit/{{$ticket->id}}" >
            <input type="hidden" class="form-control" value="{{csrf_token()}}" name="_token" >
            <div class="form-group">
              <label for="question">Event Title:</label>
              <input type="text" class="form-control" value="{{ $event[0]->title }}" readonly >            
            </div>
			
			<div class="form-group">
              <label for="question">Name :</label>
              <input type="text" class="form-control" value="{{ (isset($user[0]->name))?$user[0]->name:'' }}" readonly >            
            </div>
			
			<div class="form-group">
              <label for="question">email :</label>
              <input type="text" class="form-control" value="{{ (isset($user->email))?$user[0]->email:''}}" readonly >          
            </div>
			
			<div class="form-group">
              <label for="question">Transaction ID :</label>
              <input type="text" class="form-control" value="{{ (isset($transaction[0]->transaction_id))?$transaction[0]->transaction_id:'' }}" readonly >            
            </div>
			
			<div class="form-group">
              <label for="question">Ticket Price :</label>
              <input type="text" class="form-control" value="{{ $ticket->ticket_price+$ticket->booking_fee }}" readonly >            
            </div>			
			
			<div class="form-group">
              <label for="question">Qty :</label>
              <input type="text" class="form-control" value="{{ $ticket->qty }}" readonly >            
            </div>
			
			<div class="form-group">
              <label for="question">Final Amount :</label>
              <input type="text" class="form-control" value="{{$ticket->final_amount}}" readonly >            
            </div>
				
            <div class="form-group">
              <label for="fullname">Status * :</label>
			  <select class="form-control"  name="status" required="">
				<option <?= ($ticket->status == 'approve') ? 'checked' : '' ?> value="approve">Approve</option>
				<option <?= ($ticket->status == 'unapprove') ? 'checked' : '' ?> value="unapprove">Unapprove</option>
				<option <?= ($ticket->status == 'refaund') ? 'checked' : '' ?> value="refaund">Refaund</option>
				<option <?= ($ticket->status == 'cancel') ? 'checked' : '' ?> value="cancel">Cancel</option>
			  </select>
            </div>

            <div class="form-group">
              <input type="submit" class="btn btn-success" value="Submit">
            </div>

          </form>
        </div>
      </div>
      <!-- end row -->

    </div> <!-- container -->

  </div> <!-- content -->

  @endsection
