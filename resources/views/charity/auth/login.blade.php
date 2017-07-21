<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="A fully featured admin theme which can be used to build CRM, CMS, etc.">
        <meta name="author" content="Coderthemes">

        <!-- App favicon -->
        <link rel="shortcut icon" href="{{Request::root()}}/assets/admin/images/favicon.ico">
        <!-- App title -->
        <title>Admin Login</title>

        <!-- App css -->
        <link href="{{Request::root()}}/assets/admin/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/admin/css/core.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/admin/css/components.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/admin/css/icons.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/admin/css/pages.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/admin/css/menu.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/admin/css/responsive.css" rel="stylesheet" type="text/css" />
        <script src="{{Request::root()}}/assets/admin/js/modernizr.min.js"></script>

    </head>


    <body class="bg-transparent">

        <!-- HOME -->
        <section>
            <div class="container-alt">
                <div class="row">
                    <div class="col-sm-12">

                        <div class="wrapper-page">

                            <div class="m-t-40 account-pages">
                                <div class="text-center account-logo-box">
                                    <h2 class="text-uppercase">
                                        <a href="index.html" class="text-success">
                                            <span> Charity Login </span>
                                        </a>
                                    </h2>
                                    <!--<h4 class="text-uppercase font-bold m-b-0">Sign In</h4>-->
                                </div>
                                <div class="account-content">
                                    <form class="form-horizontal" method="post" action="{{ url('/charity/login') }}">
                                      {{ csrf_field() }}

                                        <div class="form-group ">
                                            <div class="col-xs-12">
                                              <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" autofocus>

                                              @if ($errors->has('email'))
                                                  <span class="help-block">
                                                      <strong>{{ $errors->first('email') }}</strong>
                                                  </span>
                                              @endif
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <div class="col-xs-12">
                                              <input id="password" type="password" class="form-control" name="password">

                                              @if ($errors->has('password'))
                                                  <span class="help-block">
                                                      <strong>{{ $errors->first('password') }}</strong>
                                                  </span>
                                              @endif
                                            </div>
                                        </div>

                                        <div class="form-group ">
                                            <div class="col-xs-12">
                                                <div class="checkbox checkbox-success">
                                                    <input type="checkbox" name="remember">
                                                    <label for="checkbox-signup">
                                                        Remember me
                                                    </label>
                                                </div>

                                            </div>
                                        </div>

                                        <div class="form-group text-center m-t-30">
                                            <div class="col-sm-12">
                                                <a href="{{ url('/charity/password/reset') }}" class="text-muted"><i class="fa fa-lock m-r-5"></i> Forgot your password?</a>
                                            </div>
                                        </div>

                                        <div class="form-group account-btn text-center m-t-10">
                                            <div class="col-xs-12">
                                                <button class="btn w-md btn-bordered btn-danger waves-effect waves-light" type="submit">Log In</button>
                                            </div>
                                        </div>

                                    </form>

                                    <div class="clearfix"></div>

                                </div>
                            </div>
                            <!-- end card-box-->

                        </div>
                        <!-- end wrapper -->

                    </div>
                </div>
            </div>
          </section>
          <!-- END HOME -->

        <script>
            var resizefunc = [];
        </script>

        <!-- jQuery  -->
        <script src="{{Request::root()}}/assets/admin/js/jquery.min.js"></script>
        <script src="{{Request::root()}}/assets/admin/js/bootstrap.min.js"></script>
        <script src="{{Request::root()}}/assets/admin/js/detect.js"></script>
        <script src="{{Request::root()}}/assets/admin/js/fastclick.js"></script>
        <script src="{{Request::root()}}/assets/admin/js/jquery.blockUI.js"></script>
        <script src="{{Request::root()}}/assets/admin/js/waves.js"></script>
        <script src="{{Request::root()}}/assets/admin/js/jquery.slimscroll.js"></script>
        <script src="{{Request::root()}}/assets/admin/js/jquery.scrollTo.min.js"></script>

        <!-- App js -->
        <script src="{{Request::root()}}/assets/admin/js/jquery.core.js"></script>
        <script src="{{Request::root()}}/assets/admin/js/jquery.app.js"></script>

    </body>
</html>
