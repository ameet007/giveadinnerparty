@extends('admin.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">Add SEO</h4>
            <ol class="breadcrumb p-0 m-0">

              <li>
                <a href="{{Request::root()}}/admin/home">Admin</a>
              </li>
              <li class="active">
                Add SEO
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

          <form enctype="multipart/form-data" id="demo-form" data-parsley-validate="" novalidate="" method="post" action="{{Request::root()}}/admin/seo/{{Request::segment(3)}}<?=(ISSET($seo)) ? '/'.$seo->id : '' ?>">
            <input type="hidden" class="form-control" value="{{csrf_token()}}" name="_token" id="seo">
            <div class="form-group">
              <label for="question">URL * :</label>
              <input type="text" class="form-control" value="<?= (Request::segment(3) == 'edit') ? $seo->url : old('url') ?>" name="url" id="url" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('url')}}</li>
              </ul>
              @endif
            </div>

			<div class="form-group">
              <label for="answer">Title * :</label>
              <input type="text" class="form-control" name="title" id="title" required="" value="<?= (Request::segment(3) == 'edit') ? $seo->title : old('title') ?>"/>	
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('title')}}</li>
              </ul>
              @endif
            </div>
			
            <div class="form-group">
              <label for="fullname">Keyword * :</label>
			  <input type="text" class="form-control"  name="keyword" id="keyword" required="" value="<?= (Request::segment(3) == 'edit') ? $seo->keyword : old('keyword') ?>"/>
				 
			  
             @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
				<li class="parsley-required">{{$errors->first('keyword')}}</li>
              </ul>
              @endif			  
            <div class="form-group">
              <label for="fullname">Description * :</label>
	<textarea class="form-control"  name="description" id="description" required=""><?= (Request::segment(3) == 'edit') ? $seo->description : old ('description') ?>
				
			  </textarea>  			  
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
