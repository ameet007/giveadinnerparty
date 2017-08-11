@extends('admin.layout.adminLayout')

@section('content')
<div class="content-page">
  <!-- Start content -->
  <div class="content">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="page-title-box">
            <h4 class="page-title">Edit Weekly Payout</h4>
            <ol class="breadcrumb p-0 m-0">

              <li>
                <a href="{{Request::root()}}/charity/home">Admin</a>
              </li>
              <li class="active">Edit Weekly Payout</li>
            </ol>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <!-- end row -->

      <div class="row m-t-50">
        <div class="col-sm-12">
          
          <form enctype="multipart/form-data" id="demo-form" data-parsley-validate="" novalidate="" method="post" action="{{Request::root()}}/admin/charity/edit_weekly_payout/{{Request::segment(4)}}">
            <input type="hidden" class="form-control" value="{{csrf_token()}}" name="_token" id="title">
            <div class="form-group">
              <label for="title">Charity Name * :</label>
              <input type="text" class="form-control" value="<?php echo $report_data->title; ?>" readonly>
            </div>
			
			<div class="form-group">
              <label for="email">Amount</label>
              <input type="text" class="form-control" value="<?php echo $report_data->amount; ?>" readonly>
            </div>
			
			<div class="form-group">
              <label for="email">Transactiopn ID</label>
              <input type="text" class="form-control" name="transaction_id" value="<?php echo $report_data->transaction_id; ?>" required>
            </div>
			
            <div class="form-group">
              <label for="fullname">Status * :</label>
			  <select class="form-control"  name="status" required="">
				<option <?php echo ($report_data->status == 'pending') ? 'selected' : '' ?> value="pending">Pending</option>
				<option <?php echo ($report_data->status == 'paid') ? 'selected' : '' ?> value="paid">Paid</option>
			  </select>
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