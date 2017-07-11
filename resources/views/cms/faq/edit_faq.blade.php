@extends('admin.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">Add Faq</h4>
            <ol class="breadcrumb p-0 m-0">

              <li>
                <a href="{{Request::root()}}/admin/home">Admin</a>
              </li>
              <li class="active">
                Add Faq
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

          <form enctype="multipart/form-data" id="demo-form" data-parsley-validate="" novalidate="" method="post" action="{{Request::root()}}/cms/faq/{{Request::segment(3)}}<?=(ISSET($faq)) ? '/'.$faq->id : '' ?>">
            <input type="hidden" class="form-control" value="{{csrf_token()}}" name="_token" id="faq">
            <div class="form-group">
              <label for="question">Question * :</label>
              <input type="text" class="form-control" value="<?= (Request::segment(3) == 'edit') ? $faq->question : old('question') ?>" name="question" id="question" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('question')}}</li>
              </ul>
              @endif
            </div>

			<div class="form-group">
              <label for="answer">Answer * :</label>
              <textarea class="form-control" name="answer" id="answer" required=""><?= (Request::segment(3) == 'edit') ? $faq->answer : old('answer') ?></textarea>	
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('answer')}}</li>
              </ul>
              @endif
            </div>
			
            <div class="form-group">
              <label for="fullname">Status * :</label>
			  <select class="form-control"  name="status" required="">
				<option <?= (Request::segment(3) == 'edit' && $faq->status == 1) ? 'checked' : '' ?> <?= (old('status') == 1) ? 'checked' : '' ?> value="1">Enabled</option>
				<option <?= (Request::segment(3) == 'edit' && $faq->status == 0) ? 'checked' : '' ?> <?= (old('status') == 0) ? 'checked' : '' ?> value="0">Disabled</option>
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
      $('.datepicker').datepicker();
      </script>

      <!-- end row -->

    </div> <!-- container -->

  </div> <!-- content -->

  @endsection
