@extends('charity.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">Edit Profile</h4>
            <ol class="breadcrumb p-0 m-0">

              <li>
                <a href="{{Request::root()}}/charity/home">Admin</a>
              </li>
              <li class="active">Edit Profile</li>
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

          <form enctype="multipart/form-data" id="demo-form" data-parsley-validate="" novalidate="" method="post" action="{{Request::root()}}/charity/{{Request::segment(2)}}">
            <input type="hidden" class="form-control" value="{{csrf_token()}}" name="_token" id="title">
            <div class="form-group">
              <label for="title">Title * :</label>
              <input type="text" class="form-control" value="<?php echo $charity->title; ?>" name="title" id="title" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('title')}}</li>
              </ul>
              @endif
            </div>
			
			<div class="form-group">
              <label for="email">Email * :</label>
              <input type="text" class="form-control" value="<?php echo $charity->email; ?>" name="email" id="email" required="" >
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('email')}}</li>
              </ul>
              @endif
            </div>
			
			<div class="form-group">
              <label for="password">Password * :</label>
              <input type="text" class="form-control" value="<?php old('password') ?>" name="password" id="password" >
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('password')}}</li>
              </ul>
              @endif
            </div>
			
			<div class="form-group">
				<label for="title">Preview</label>
				<img style="width:100px; height:100px;" src="{{Request::root()}}/assets/admin/uploads/charity/{{$charity->logo}}">
            </div>
			<input type="hidden" name="old_image" value="<?php echo $charity->logo; ?>">
			<div class="form-group">
              <label for="title">Logo* :</label>
              <input type="file" class="form-control" name="logo" id="title" >
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
					<li class="parsley-required">{{$errors->first('logo')}}</li>
              </ul>
              @endif
            </div>
			
			
			<div class="form-group">
              <label for="description">Description * :</label>
              <textarea class="form-control" name="description" id="description" required=""><?php echo $charity->description; ?></textarea>	
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
				  <li class="parsley-required">{{$errors->first('description')}}</li>
              </ul>
              @endif
            </div>
			
			
			<div class="form-group">
              <label for="reference">Reference * :</label>
              <input type="text" class="form-control" value="<?php echo $charity->reference; ?>" name="reference" id="reference" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('reference')}}</li>
              </ul>
              @endif
            </div>
			
			<div class="form-group">
              <label for="website">Website * :</label>
              <input type="text" class="form-control" value="<?php echo $charity->website; ?>" name="website" id="website" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('website')}}</li>
              </ul>
              @endif
            </div>
			
            <div class="form-group">
              <label for="fullname">Status * :</label>
			  <select class="form-control"  name="status" required="">
				<option <?= ($charity->status == 1) ? 'checked' : '' ?> <?= (old('status') == 1) ? 'checked' : '' ?> value="1">Enabled</option>
				<option <?= ($charity->status == 0) ? 'checked' : '' ?> <?= (old('status') == 0) ? 'checked' : '' ?> value="0">Disabled</option>
			  </select>              
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
				<li class="parsley-required">{{$errors->first('status')}}</li>
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
      $('.datepicker').datepicker({ format: 'yyyy-mm-dd' });
      </script>
      <!-- end row -->
    </div> <!-- container -->
  </div> <!-- content -->
  @endsection