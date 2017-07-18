@extends("admin.layout.adminLayout")
@section("content")

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

@if(Session::get('success')!='')
    <div class="alert alert-success">
        {{Session::get('success')}}
    </div>
@endif
@if(Session::get('error')!='')
    <div class="alert alert-danger">
        {{Session::get('error')}}
    </div>
@endif

      <div class="row">
        <div class="col-sm-12">
<!--          <a class="btn btn-success" href="{{Request::root()}}/admin/users/add">Add</a>-->
          <div class="card-box table-responsive">
            <div id="datatable_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"><div class="row"><div class="col-sm-12"><table id="datatable" class="table table-striped table-bordered dataTable no-footer" role="grid" aria-describedby="datatable_info">
              <thead>
                <tr role="row">
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Age: activate to sort column ascending" style="width: 67px;">ID</th>
                  <th class="sorting_asc" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Name: activate to sort column descending" style="width: 197px;">Title</th>
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Position: activate to sort column ascending" style="width: 326px;">Description</th>
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 142px;">Event Date</th>
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 127px;">Start Time</th>
                  <th class="sorting" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label="Salary: activate to sort column ascending" style="width: 117px;">End Time</th>
                  <th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 127px;">Host Name</th>
                  <th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 127px;">Price</th>
                  <th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 127px;">Min Guests</th>
                  <th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 127px;">Max Guests</th>
                  <th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 127px;">Already Joined!!</th>
                  <th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Actions" style="width: 127px;">Status</th>
                </tr>
              </thead>
              <tbody>
                @foreach($events as $item)
                <tr role="row" class="odd">
                  <td>{{$item->id}}</td>
                  <td class="sorting_1">{{$item->title}}</td>
                  <td>{{$item->description}}</td>
                  <td>{{$item->event_date}}</td>
                  <td>{{$item->start_time}}</td>
                  <td>{{$item->end_time}}</td>
                  <td>{{$item->name}}</td>
                  <td>{{$item->ticket_price}}</td>
                  <td>{{$item->min_guests}}</td>
                  <td>{{$item->max_guests}}</td>
                  <td>Coming...</td>
                  <td> <a href="{{Request::root()}}/admin/events/status/{{$item->id}}?status=<?= ($item->status==1) ? '0' : '1' ?>" class="on-default remove-row"><?= ($item->status==1) ? 'Enabled' : 'Disabled' ?></a></td>
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
