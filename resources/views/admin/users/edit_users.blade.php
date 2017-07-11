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

          <form id="demo-form" data-parsley-validate="" novalidate="" method="post" action="{{Request::root()}}/admin/users/{{Request::segment(3)}}<?=(ISSET($user)) ? '/'.$user->id : '' ?>">
            <input type="hidden" class="form-control" value="{{csrf_token()}}" name="_token" id="fullname">
            <div class="form-group">
              <label for="fullname">First Name * :</label>
              <input type="text" class="form-control" value="<?= (Request::segment(3) == 'edit') ? $user->name : old('name') ?>" name="name" id="fullname" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('name')}}</li>
              </ul>
              @endif
            </div>

            <div class="form-group">
              <label for="email">Last Name * :</label>
              <input type="text" id="email" value="<?= (Request::segment(3) == 'edit') ? $user->last_name : old('last_name') ?>" class="form-control" name="last_name" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('last_name')}}</li>
              </ul>
              @endif
            </div>

            <div class="form-group">
              <label>Gender *:</label>

              <div class="radio">
                <input type="radio" name="gender" <?= (Request::segment(3) == 'edit' && $user->gender == 'Male') ? 'checked' : '' ?> <?= (old('gender') == 'Male') ? 'checked' : '' ?> id="genderM" value="Male" required="" data-parsley-multiple="gender">
                <label for="genderM">
                  Male
                </label>
              </div>
              <div class="radio">
                <input type="radio" name="gender" <?= (Request::segment(3) == 'edit' && $user->gender == 'Female') ? 'checked' : '' ?> <?= (old('gender') == 'Female') ? 'checked' : '' ?> id="genderF" value="Female" data-parsley-multiple="gender">
                <label for="genderF">
                  Female
                </label>
              </div>
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('gender')}}</li>
              </ul>
              @endif
            </div>

            <div class="form-group">
                <label>Date of Birth *</label>
                <div>
                    <div class="input-group">
                        <input name="dob" value="<?= (Request::segment(3) == 'edit') ? $user->dob : old('dob') ?>" type="text" class="form-control datepicker" placeholder="mm/dd/yyyy" id="datepicker-autoclose" reqired="">
                        <span class="input-group-addon bg-custom b-0"><i class="mdi mdi-calendar text-white"></i></span>
                    </div><!-- input-group -->
                </div>
                @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('dob')}}</li>
              </ul>
              @endif
            </div>

            <div class="form-group">
              <label for="fullname">Email * :</label>
              <input type="email" value="<?= (Request::segment(3) == 'edit') ? $user->email : old('email') ?>" class="form-control" name="email" id="fullname" required="">
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
              <label for="fullname">Status * :</label>
              <div class="radio">
                <input type="radio" <?= (Request::segment(3) == 'edit' && $user->gender == 0) ? 'checked' : '' ?> <?= (old('gender') == 0) ? 'checked' : '' ?> name="is_disabled" id="genderM" value="0" required="" data-parsley-multiple="is_disabled">
                <label for="genderM">
                  Enabled
                </label>
              </div>
              <div class="radio">
                <input type="radio" <?= (Request::segment(3) == 'edit' && $user->gender == 1) ? 'checked' : '' ?> <?= (old('gender') == 1) ? 'checked' : '' ?> name="is_disabled" id="genderF" value="1" data-parsley-multiple="is_disabled">
                <label for="genderF">
                  Disabled
                </label>
              </div>
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('is_disabled')}}</li>
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
