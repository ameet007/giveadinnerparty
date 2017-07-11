@extends('admin.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">Add Offers</h4>
            <ol class="breadcrumb p-0 m-0">

              <li>
                <a href="{{Request::root()}}/admin/home">Admin</a>
              </li>
              <li class="active">Add Offers</li>
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

          <form enctype="multipart/form-data" id="demo-form" data-parsley-validate="" novalidate="" method="post" action="{{Request::root()}}/admin/offer/{{Request::segment(3)}}<?=(ISSET($offer_data)) ? '/'.$offer_data->id : '' ?>">
            <input type="hidden" class="form-control" value="{{csrf_token()}}" name="_token" id="title">
            <div class="form-group">
              <label for="title">Title * :</label>
              <input type="text" class="form-control" value="<?= (Request::segment(3) == 'edit') ? $offer_data->title : old('title') ?>" name="title" id="title" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('title')}}</li>
              </ul>
              @endif
            </div>
			
			<div class="form-group">
              <label for="rule">Discount * :</label>
              <input type="text" class="form-control" value="<?= (Request::segment(3) == 'edit') ? $offer_data->rule : old('rule') ?>" name="rule" id="rule" required="">
              @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('rule')}}</li>
              </ul>
              @endif
            </div>
			
			<div class="form-group">
              <label for="from_date">From Date * :</label>
             <div>
                    <div class="input-group">
                        <input name="from_date" value="<?= (Request::segment(3) == 'edit') ? $offer_data->from_date : old('from_date') ?>" type="text" class="form-control datepicker" placeholder="yyyy-mm-dd" id="datepicker-autoclose" reqired="">
                        <span class="input-group-addon bg-custom b-0"><i class="mdi mdi-calendar text-white"></i></span>
                    </div><!-- input-group -->
                </div>

			 @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('from_date')}}</li>
              </ul>
              @endif
            </div>
			
			<div class="form-group">
              <label for="to_date">To Date * :</label>           
			  <div>
                  <div class="input-group">
                      <input name="to_date" value="<?= (Request::segment(3) == 'edit') ? $offer_data->to_date : old('to_date') ?>" type="text" class="form-control datepicker" placeholder="yyyy-mm-dd" id="datepicker-autoclose" reqired="">
                      <span class="input-group-addon bg-custom b-0"><i class="mdi mdi-calendar text-white"></i></span>
                  </div><!-- input-group -->
              </div>
			 @if(ISSET($errors))
              <ul class="parsley-errors-list filled" id="parsley-id-5">
                <li class="parsley-required">{{$errors->first('to_date')}}</li>
              </ul>
              @endif
            </div>
			
            <div class="form-group">
              <label for="fullname">Status * :</label>
			  <select class="form-control"  name="status" required="">
				<option <?= (Request::segment(3) == 'edit' && $offer_data->status == 1) ? 'checked' : '' ?> <?= (old('status') == 1) ? 'checked' : '' ?> value="1">Enabled</option>
				<option <?= (Request::segment(3) == 'edit' && $offer_data->status == 0) ? 'checked' : '' ?> <?= (old('status') == 0) ? 'checked' : '' ?> value="0">Disabled</option>
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
