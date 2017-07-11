@extends('admin.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">Dashboard</h4>
            <ol class="breadcrumb p-0 m-0">

              <li>
                <a href="{{Request::root()}}/admin/home">Admin</a>
              </li>
              <li class="active">
                Dashboard
              </li>
            </ol>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <!-- end row -->



      <div class="row">
        <div class="col-sm-12">
          <a class="btn btn-success" href="{{Request::root()}}/admin/users/add">Add</a>
          <div class="card-box table-responsive">
            <div id="datatable_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"><div class="row"><div class="col-sm-12"><table id="datatable" class="table table-striped table-bordered dataTable no-footer" role="grid" aria-describedby="datatable_info">
              <thead>
                <tr role="row">
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Age: activate to sort column ascending" style="width: 67px;">ID</th>
                  <th class="sorting_asc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Name: activate to sort column descending" style="width: 197px;">Name</th>
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Position: activate to sort column ascending" style="width: 326px;">Gender</th>
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 142px;">Email</th>
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">Status</th>
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Salary: activate to sort column ascending" style="width: 117px;">Image</th>
                  <th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 127px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @foreach($users as $item)
                <tr role="row" class="odd">
                  <td>{{$item->id}}</td>
                  <td class="sorting_1">{{$item->name}} {{$item->last_name}}</td>
                  <td>{{$item->gender}}</td>
                  <td>{{$item->email}}</td>
                  <td><?= ($item->is_disabled == 1) ? 'Disabled' : 'Enabled' ?></td>
                  <td></td>
                  <td class="actions">
                      <a href="{{Request::root()}}/admin/users/edit/{{$item->id}}" class="on-default edit-row"><i class="fa fa-pencil"></i></a>
                      <a href="{{Request::root()}}/admin/users/delete/{{$item->id}}" class="on-default remove-row"><i class="fa fa-trash-o"></i></a>
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
