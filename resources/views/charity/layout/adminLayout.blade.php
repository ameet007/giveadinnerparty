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
  <title>Admin Panel</title>
  <!--Morris Chart CSS -->
  <link rel="stylesheet" href="{{Request::root()}}/assets/admin/plugins/morris/morris.css">
  <!-- App css -->
  <link href="{{Request::root()}}/assets/admin/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
  <link href="{{Request::root()}}/assets/admin/css/core.css" rel="stylesheet" type="text/css" />
  <link href="{{Request::root()}}/assets/admin/css/components.css" rel="stylesheet" type="text/css" />
  <link href="{{Request::root()}}/assets/admin/css/icons.css" rel="stylesheet" type="text/css" />
  <link href="{{Request::root()}}/assets/admin/css/pages.css" rel="stylesheet" type="text/css" />
  <link href="{{Request::root()}}/assets/admin/css/menu.css" rel="stylesheet" type="text/css" />
  <link href="{{Request::root()}}/assets/admin/css/responsive.css" rel="stylesheet" type="text/css" />
  <link href="{{Request::root()}}/assets/admin/plugins/switchery/switchery.min.css" rel="stylesheet" type="text/css" >
  <!-- DataTables -->
  <link href="{{Request::root()}}/assets/admin/plugins/datatables/jquery.dataTables.min.css" rel="stylesheet" type="text/css"/>
  <link href="{{Request::root()}}/assets/admin/plugins/datatables/responsive.bootstrap.min.css" rel="stylesheet" type="text/css"/>
  <link href="{{Request::root()}}/assets/admin/plugins/datatables/dataTables.bootstrap.min.css" rel="stylesheet" type="text/css"/>
  <!-- Notification css (Toastr) -->
  <link href="{{Request::root()}}/assets/admin/plugins/toastr/toastr.min.css" rel="stylesheet" type="text/css" />
  <link href="{{Request::root()}}/assets/admin/css/bootstrap-datepicker.min.css" rel="stylesheet" type="text/css" />

  <script>
  var resizefunc = [];
  </script>

  <!-- jQuery  -->

</head>
<body class="fixed-left">
  @include('charity.layout.header')
  @include('charity.layout.sidebar')
  @yield('content')
  @include('charity.layout.footer')
</body>
</html>
