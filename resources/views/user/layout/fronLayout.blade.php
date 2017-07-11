<!DOCTYPE html>
<html>
    <head>
        <title>Give A Dinner Party</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <link href="{{Request::root()}}/assets/front/css/fileuploader.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/dropzone.min.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/owl.carousel.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/owl.theme.default.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/nav.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/bootstrap.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/main.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/media.css" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="{{Request::root()}}/assets/front/css/jquery-ui.css">


        <script src="{{Request::root()}}/assets/front/js/jQuery.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/dropzone.min.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/bxslider.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/owl.carousel.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/bootstrap.min.js" type="text/javascript"></script>		
        <script src="{{Request::root()}}/assets/front/js/jquery-ui.js"></script>
    </head>
    <body>
        @include('user.layout.header')
        @yield('content')
        @include('user.layout.footer')
    </body>
</html>