@extends('admin.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">Transaction Report</h4>
            <ol class="breadcrumb p-0 m-0">
              <li>
                <a href="{{Request::root()}}/charity/home">admin</a>
              </li>
              <li class="active">Transaction Report</li>
            </ol>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <!-- end row -->

      <div class="row">
        <div class="col-sm-12">         
          <div class="card-box table-responsive">
            <div id="datatable_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"><div class="row"><div class="col-sm-12"><table id="datatable" class="table table-striped table-bordered dataTable no-footer" role="grid" aria-describedby="datatable_info">
              <thead>
                <tr role="row">
                  <th class="sorting" style="width: 25px;">ID</th>
				  <th class="sorting" style="width: 150px;">Charity</th>
				  <th class="sorting" style="width: 100px;">Transaction ID</th>				  
                  <th class="sorting" style="width: 127px;">Amount</th>
				  <th class="sorting" style="width: 127px;">Date</th>                 
                  <th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 127px;">Status</th>
                </tr>
              </thead>
              <tbody>
                @foreach($report_data as $item)
                <tr role="row" class="odd">
					<td>{{$item->id}}</td>
					<td class="sorting_1">{{ $item->title }}</td>
					<td class="sorting_1">{{ $item->transaction_id }}</td>
					<td class="sorting_1">{{ $item->amount }}</td>
					<td class="sorting_1">{{ $item->created_at }}</td>				
					<td>
						<?php if($item->status=='paid'){ ?>
							<button type="button" class="btn btn-success btn-xs">Paid</button>
						<?php }else{ ?>
							<button type="button" class="btn btn-danger btn-xs">pending</button>
						<?php } ?>
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
  $(document).ready(function ()
  {
    $('#datatable').dataTable({
		//dom: 'Bfrtip',
		//buttons: ['excel', 'pdf']
	});
  })
  </script>

  @endsection