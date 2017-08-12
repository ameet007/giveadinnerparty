@extends('admin.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">Tickets</h4>
            <ol class="breadcrumb p-0 m-0">
              <li>
                <a href="{{Request::root()}}/admin/home">Admin</a>
              </li>
              <li class="active">Tickets</li>
            </ol>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <!-- end row -->
	  
      <div class="row">
        <div class="col-sm-12">						
          <div class="card-box table-responsive">
			<a class="btn btn-warning {{ (Request::segment(3)=='all')?'active':'' }}" href="{{Request::root()}}/admin/tickets/all">All Tickets</a>
			<a class="btn btn-warning {{ (Request::segment(3)=='approve')?'active':'' }}" href="{{Request::root()}}/admin/tickets/approve">Approved Tickets</a>
			<a class="btn btn-warning {{ (Request::segment(3)=='unapprove')?'active':'' }}" href="{{Request::root()}}/admin/tickets/unapprove">Unapproved Tickets</a>
			<a class="btn btn-warning {{ (Request::segment(3)=='refaund')?'active':'' }}" href="{{Request::root()}}/admin/tickets/refaund">Refaunded Tickets</a>
			<a class="btn btn-warning {{ (Request::segment(3)=='cancel')?'active':'' }}" href="{{Request::root()}}/admin/tickets/cancel">Cancelled Tickets</a>
			<br>
            <div id="datatable_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"><div class="row"><div class="col-sm-12"><table id="datatable" class="table table-striped table-bordered dataTable no-footer" role="grid" aria-describedby="datatable_info">
              <thead>
                <tr role="row">
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Age: activate to sort column ascending" style="width: 67px;">ID</th>
                  <th class="sorting_asc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Name: activate to sort column descending" style="width: 197px;">Event Title</th>
				  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">User</th>
				  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">No. of Ticket</th>
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">Ticket Amount</th>
				  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">Request Date</th>
				  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">Status</th>
				  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">Action</th>	
                </tr>
              </thead>
              <tbody>
                @foreach($tickets as $item)
                <tr role="row" class="odd">
					<td>{{$item->id}}</td>
					<td class="sorting_1">{{$item->event_title}}</td>
					<td class="sorting_1">{{$item->user_name}}</td>
					<td class="sorting_1">{{$item->qty}}</td>
					<td class="sorting_1">{{$item->final_amount}}</td>
					<td class="sorting_1">{{$item->created_at}}</td>
					<td>{{$item->status}}</td>
					<td>
						<a href="{{Request::root()}}/admin/ticket/edit/{{$item->id}}" class="on-default edit-row"><i class="fa fa-pencil"></i></a>
						
						<?php /*
						<a href="{{Request::root()}}/admin/ticket/status_change/{{$item->id}}?status=<?= ($item->status==1) ? '0' : '1' ?>" class="on-default remove-row <?php echo ($item->status == 0) ? 'btn btn-danger' : 'btn btn-success' ?>">
							<?php echo ($item->status == 0) ? 'Unapproved' : 'Approved' ?>
						</a>*/ ?>	
					</td>					
                </tr>
                @endforeach
              </tbody>
              </table>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
      <!-- end row -->

    </div> <!-- container -->

  </div> <!-- content -->

  <script type="text/javascript">
  $(document).ready(function () {
    $('#datatable').dataTable();
  })
  </script>

  @endsection
