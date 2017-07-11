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
              <li><a href="{{Request::root()}}/admin/home">Admin</a></li>
              <li class="active">About Us</li>
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

          <form enctype="multipart/form-data" id="demo-form" data-parsley-validate="" novalidate="" method="post" action="{{Request::root()}}/cms/aboutus/{{Request::segment(3)}}<?=(ISSET($aboutus)) ? '/'.$aboutus->id : '' ?>">
            <input type="hidden" class="form-control" value="{{csrf_token()}}" name="_token" id="title">
            <div class="form-group">
              <label for="title">Title * :</label>
              <input type="text" class="form-control" value="<?= (Request::segment(3) == 'edit') ? $aboutus->title : old('title') ?>" name="title" id="title" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('title')}}</li>
              </ul>
              @endif
            </div>
			
			<?php if((Request::segment(3) == 'edit')){ ?>
			<div class="form-group">
				<label for="title">Preview</label>
				<img style="width:100px; height:100px;" src="{{Request::root()}}/assets/admin/uploads/images/{{$aboutus->image}}">
            </div>
			<input type="hidden" name="old_image" value="<?php echo $aboutus->image; ?>">
			<?php } ?>
			<div class="form-group">
              <label for="title">Image* :</label>
              <input type="file" class="form-control" name="image" id="title" <?php (Request::segment(3) == 'edit')?'':'required';?> >
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('image')}}</li>
              </ul>
              @endif
            </div>   
			
			<div class="form-group">
              <label for="content">Content * :</label>
              <textarea class="form-control" name="description" id="textarea" required=""><?= (Request::segment(3) == 'edit') ? $aboutus->description : old('description') ?></textarea>
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('description')}}</li>
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
