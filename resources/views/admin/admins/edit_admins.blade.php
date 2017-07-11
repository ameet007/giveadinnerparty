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

      <div class="row m-t-50">
        <div class="col-sm-12">

          <div class="alert alert-warning hidden fade in">
            <p>Please fill out all the fields correctly</p>
          </div>

          <form id="demo-form" data-parsley-validate="" novalidate="" method="post" action="{{Request::root()}}/admin/admins/{{Request::segment(3)}}<?=(ISSET($admin)) ? '/'.$admin->id : '' ?>">
            <input type="hidden" class="form-control" value="{{csrf_token()}}" name="_token" id="fullname">
            <div class="form-group">
              <label for="fullname">Name * :</label>
              <input type="text" class="form-control" value="<?= (Request::segment(3) == 'edit') ? $admin->name : old('name') ?>" name="name" id="fullname" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('name')}}</li>
              </ul>
              @endif
            </div>

            <div class="form-group">
              <label for="fullname">Email * :</label>
              <input type="email" value="<?= (Request::segment(3) == 'edit') ? $admin->email : old('email') ?>" class="form-control" name="email" id="fullname" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('email')}}</li>
              </ul>
              @endif
            </div>

            <div class="form-group">
              <label for="fullname">Password * :</label>
              <input type="password" class="form-control" name="password" id="fullname" <?= (Request::segment(3) == 'edit') ? '' : 'required' ?>>
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('password')}}</li>
              </ul>
              @endif
            </div>

            <div class="form-group">
              <input type="submit" class="btn btn-success" value="Submit">
            </div>

          </form>
        </div>
      </div>

      <script type="text/javascript">
      $(document).ready(function() {
        $('form').parsley();
      });
      $(function () {
        $('#demo-form').parsley().on('field:validated', function () {
          var ok = $('.parsley-error').length === 0;
          $('.alert-info').toggleClass('hidden', !ok);
          $('.alert-warning').toggleClass('hidden', ok);
        })
      });
      $('.datepicker').datepicker();
      </script>

      <!-- end row -->

    </div> <!-- container -->

  </div> <!-- content -->

  @endsection
