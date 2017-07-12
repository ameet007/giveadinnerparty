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

          <form id="demo-form" data-parsley-validate="" novalidate="" method="post" action="{{Request::root()}}/admin/{{Request::segment(2)}}/{{Request::segment(3)}}">
            <input type="hidden" class="form-control" value="{{csrf_token()}}" name="_token" id="fullname">
          
			<b><?php echo $user->name.' '.$user->last_name; ?></b><br><br>
			<div class="form-group">
              <label for="fullname">ID Proof * : </label>
			  <?php if(file_exists('assets/admin/uploads/users/'.$user->id_proof) && !empty($user->id_proof)){ ?>				  
				<a href="{{Request::root()}}/admin/document_download/{{$user->id_proof}}">Download</a> || 
				<a href="{{Request::root()}}/admin/delete_document/{{$user->id_proof}}" >Delete</a>					
			  <?php } ?>
              <select name="approve_id" required="" class="form-control">
				<option value="0" <?php echo ($user->approve_id==0)?'selected':''; ?> >Unapproved</option>
				<option value="1" <?php echo ($user->approve_id==1)?'selected':''; ?>>Approved</option>
			  </select>
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('approve_id')}}</li>
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
