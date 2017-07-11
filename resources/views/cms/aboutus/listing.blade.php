@extends('admin.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">About Us</h4>
            <ol class="breadcrumb p-0 m-0">
              <li>
                <a href="{{Request::root()}}/admin/home">Admin</a>
              </li>
              <li class="active">
                About Us
              </li>
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
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Age: activate to sort column ascending" style="width: 67px;">ID</th>
                  <th class="sorting_asc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Name: activate to sort column descending" style="width: 197px;">Title</th>
                  <th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 127px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                @foreach($aboutus as $item)
                <tr role="row" class="odd">
					<td>{{$item->id}}</td>
					<td class="sorting_1">{{$item->title}}</td>
					<td class="actions">
						<a href="{{Request::root()}}/cms/aboutus/edit/{{$item->id}}" class="on-default edit-row"><i class="fa fa-pencil"></i></a>
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
