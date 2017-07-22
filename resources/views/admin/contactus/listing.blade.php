@extends('admin.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">Contact Us</h4>
            <ol class="breadcrumb p-0 m-0">
              <li>
                <a href="{{Request::root()}}/admin/home">Admin</a>
              </li>
              <li class="active">
                Contact Us
              </li>
            </ol>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <!-- end row -->

      <div class="row">
        <div class="col-sm-12">
          <!--<a class="btn btn-success" href="{{Request::root()}}/admin/seo/add">Add</a>-->
          <div class="card-box table-responsive">
            <div id="datatable_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"><div class="row"><div class="col-sm-12"><table id="datatable" class="table table-striped table-bordered dataTable no-footer" role="grid" aria-describedby="datatable_info">
              <thead>
                <tr role="row">
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Age: activate to sort column ascending" style="width: 67px;">S. No.</th>
                  <th class="sorting_asc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Name: activate to sort column descending" style="width: 197px;">Name</th>
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">Email</th> 
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">PhoneNumber</th> 
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">Message</th> 
                  				  
                  <th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 127px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                
                <tr role="row" class="odd">
				<?php
				$counter=0;
				?>
				@foreach($contact as $item)
				<td>{{++$counter}}</td>
					<td class="sorting_1">{{$item->name}}</td>
					<td>{{$item->email}}</td>
					<td>{{$item->number}}</td>
					<td>{{$item->message}}</td>
					
					<td class="actions">
						<!--<a href="#" class="on-default edit-row"><i class="fa fa-pencil"></i></a>-->
						<a href="{{Request::root()}}/admin/contactus/delete/{{$item->id}}" class="on-default remove-row"><i class="fa fa-trash-o"></i></a>
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
