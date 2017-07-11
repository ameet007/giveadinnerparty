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

          <form  enctype="multipart/form-data" id="demo-form" data-parsley-validate="" novalidate="" method="post" action="{{Request::root()}}/admin/company/{{Request::segment(3)}}<?=(ISSET($company)) ? '/'.$company->id : '' ?>">
            <input type="hidden" class="form-control" value="{{csrf_token()}}" name="_token" id="fullname">
                  <div class="form-group">
                    <label>Company Name</label>
                    <div>
                      <input type="text" name='company_name' id='first_name' class="form-control" required="" value="<?= (Request::segment(3) == 'edit') ? $company->company_name : old('company_name') ?>" placeholder="Comapny Name">
                    </div>
                    @if(ISSET($errors))
                    <ul class="parsley-errors-list filled" id="parsley-id-5">
                      <li class="parsley-required">{{$errors->first('company_name')}}</li>
                    </ul>
                    @endif
                  </div>
                  <div class="form-group">
                    <label>Company Logo</label>
                    <div>
                      <input data-parsley-filemimetypes="image/jpeg, image/png"  data-parsley-trigger="change" type="file" name='company_logo' id='last_name' class="form-control">
                    </div>
                    @if(ISSET($errors))
                    <ul class="parsley-errors-list filled" id="parsley-id-5">
                      <li class="parsley-required">{{$errors->first('company_logo')}}</li>
                    </ul>
                    @endif
                  </div>
                  <div class="form-group">
                    <label>Company Logo</label>
                    <div>
                      <img style="width:100px; height:100px;" src="{{$company->company_logo}}" alt="" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Address 1</label>
                    <div>
                      <input type="text" name='address1' id='tertiary_fname' class="form-control" required="" placeholder="First Name" value="<?= (Request::segment(3) == 'edit') ? $company->address1 : old('address1') ?>">
                    </div>
                    @if(ISSET($errors))
                    <ul class="parsley-errors-list filled" id="parsley-id-5">
                      <li class="parsley-required">{{$errors->first('address1')}}</li>
                    </ul>
                    @endif
                  </div>
                  <div class="form-group">
                    <label>Address 2</label>
                    <div>
                      <input type="text" name='address2' id='tertiary_lname' class="form-control" required="" placeholder="Last Name" value="<?= (Request::segment(3) == 'edit') ? $company->address2 : old('address2') ?>">
                    </div>
                    @if(ISSET($errors))
                    <ul class="parsley-errors-list filled" id="parsley-id-5">
                      <li class="parsley-required">{{$errors->first('address2')}}</li>
                    </ul>
                    @endif
                  </div>

                  <div class="form-group">
                    <label>Address 3</label>
                    <div>
                      <input type="text" name='address3' id='tertiary_email' class="form-control" required="" placeholder="Email" value="<?= (Request::segment(3) == 'edit') ? $company->address3 : old('address3') ?>">
                    </div>
                    @if(ISSET($errors))
                    <ul class="parsley-errors-list filled" id="parsley-id-5">
                      <li class="parsley-required">{{$errors->first('address3')}}</li>
                    </ul>
                    @endif
                  </div>
                  <div class="form-group">
                    <label>Telephone</label>
                    <div>
                      <input type="number" name='telephone' id='tertiary_mobile' class="form-control" required="" placeholder="Mobile" value="<?= (Request::segment(3) == 'edit') ? $company->telephone : old('telephone') ?>">
                    </div>
                    @if(ISSET($errors))
                    <ul class="parsley-errors-list filled" id="parsley-id-5">
                      <li class="parsley-required">{{$errors->first('telephone')}}</li>
                    </ul>
                    @endif
                  </div>

                  <div class="form-group">
                    <label>Fax</label>
                    <div>
                      <input type="number" name='fax' id='tertiary_mobile' class="form-control" required="" placeholder="Mobile" value="<?= (Request::segment(3) == 'edit') ? $company->fax : old('fax') ?>">
                    </div>
                    @if(ISSET($errors))
                    <ul class="parsley-errors-list filled" id="parsley-id-5">
                      <li class="parsley-required">{{$errors->first('fax')}}</li>
                    </ul>
                    @endif
                  </div>

                  <div class="form-group">
                    <label>Facebook Link</label>
                    <div>
                      <input type="url" name='facebook' id='tertiary_mobile' class="form-control" required="" placeholder="Mobile" value="<?= (Request::segment(3) == 'edit') ? $company->facebook : old('facebook') ?>">
                    </div>
                    @if(ISSET($errors))
                    <ul class="parsley-errors-list filled" id="parsley-id-5">
                      <li class="parsley-required">{{$errors->first('facebook')}}</li>
                    </ul>
                    @endif
                  </div>

                  <div class="form-group">
                    <label>Twitter Link</label>
                    <div>
                      <input type="url" name='twitter' id='tertiary_mobile' class="form-control" required="" placeholder="Mobile" value="<?= (Request::segment(3) == 'edit') ? $company->twitter : old('twitter') ?>">
                    </div>
                    @if(ISSET($errors))
                    <ul class="parsley-errors-list filled" id="parsley-id-5">
                      <li class="parsley-required">{{$errors->first('twitter')}}</li>
                    </ul>
                    @endif
                  </div>

                  <div class="form-group">
                    <label>Linked In Link</label>
                    <div>
                      <input type="url" name='linkedIn' id='tertiary_mobile' class="form-control" required="" placeholder="Mobile" value="<?= (Request::segment(3) == 'edit') ? $company->linkedIn : old('linkedIn') ?>">
                    </div>
                    @if(ISSET($errors))
                    <ul class="parsley-errors-list filled" id="parsley-id-5">
                      <li class="parsley-required">{{$errors->first('linkedIn')}}</li>
                    </ul>
                    @endif
                  </div>


                </div>
                  <div class="form-group">
              <input type="submit" class="btn btn-success" value="Submit">
            </div>
          </form>
        </div>
      </div>

      <script type="text/javascript">
      $(document).ready(function() {
        window.Parsley
        .addValidator('filemimetypes', {
            requirementType: 'string',
            validateString: function (value, requirement, parsleyInstance) {

                var file = parsleyInstance.$element[0].files;

                if (file.length == 0) {
                    return true;
                }

                var allowedMimeTypes = requirement.replace(/\s/g, "").split(',');
                return allowedMimeTypes.indexOf(file[0].type) !== -1;

            },
            messages: {
                en: 'File mime type not allowed'
            }
        });

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
