@extends('admin.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">Charities</h4>
            <ol class="breadcrumb p-0 m-0">
              <li>
                <a href="{{Request::root()}}/admin/home">Admin</a>
              </li>
              <li class="active">Charities</li>
            </ol>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <!-- end row -->

      <div class="row">
        <div class="col-sm-12">
          <a class="btn btn-success" href="{{Request::root()}}/admin/charity/add">Add</a>
          <div class="card-box table-responsive">
            <div id="datatable_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"><div class="row"><div class="col-sm-12"><table id="datatable" class="table table-striped table-bordered dataTable no-footer" role="grid" aria-describedby="datatable_info">
              <thead>
                <tr role="row">
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Age: activate to sort column ascending" style="width: 67px;">ID</th>
                  <th class="sorting_asc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Name: activate to sort column descending" style="width: 197px;">Title</th>
				  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">Email</th>
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">Logo</th>
				  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">Status</th>                 
                  <th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 127px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @foreach($charity as $item)
                <tr role="row" class="odd">
					<td>{{$item->id}}</td>
					<td class="sorting_1">{{$item->title}}</td>
					<td class="sorting_1">{{$item->email}}</td>
					<td class="sorting_1"><img style="width:80px; height:80px;" src="{{Request::root()}}/assets/admin/uploads/charity/{{$item->logo}}" /></td>
					<td><?= ($item->status == 0) ? 'Disabled' : 'Enabled' ?></td>
					<td class="actions">
						<a href="{{Request::root()}}/admin/charity/edit/{{$item->id}}" class="on-default edit-row"><i class="fa fa-pencil"></i></a>
						<a href="{{Request::root()}}/admin/charity/delete/{{$item->id}}" class="on-default remove-row"><i class="fa fa-trash-o"></i></a>
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
