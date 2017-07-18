<?php 
//***********For Making Meta Tags dynamic***********\\
use App\Http\Controllers\cmsController;
 
 $url=$_SERVER['REQUEST_URI'];
 $meta_data =  cmsController::get_metatag($url);
 //**************************************************\\
 ?>
<!DOCTYPE html>
<html>
    <head>
        <?php if(count($meta_data)==1){ ?>
			<title>{{ $meta_data[0]->title }}</title>
			<meta name="description" content=">{{ $meta_data[0]->description }}</">
			<meta name="keywords" content=">{{ $meta_data[0]->keyword }}</">
		<?php } else { ?>
			<title>Give A Dinner Party</title>
		<?php } ?>
		
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
        <link href="{{Request::root()}}/assets/front/css/jquery-ui.css" rel="stylesheet" type="text/css" >
        <link href="{{Request::root()}}/assets/front/css/bootstrap.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/core.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/components.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/icons.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/pages.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/menu.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/responsive.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/main.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/media.css" rel="stylesheet" type="text/css" />
        <link href="https://cdn.datatables.net/1.10.15/css/dataTables.bootstrap.min.css" rel="stylesheet" type="text/css" />


        <script src="{{Request::root()}}/assets/front/js/jQuery.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/dropzone.min.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/bxslider.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/owl.carousel.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/bootstrap.min.js" type="text/javascript"></script>		
        <script src="{{Request::root()}}/assets/front/js/jquery-ui.js"></script>
        <script src="{{Request::root()}}/assets/front/js/detect.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/fastclick.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/jquery.blockUI.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/jquery.core.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/ckeditor/ckeditor.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/bootstrap-datepicker.js" type="text/javascript"></script>
        <script type="text/javascript" src="{{Request::root()}}/assets/admin/plugins/parsleyjs/parsley.min.js"></script>
        <script type="text/javascript" src="//cdn.datatables.net/1.10.15/js/jquery.dataTables.min.js" ></script>
        <script type="text/javascript" src="https://cdn.datatables.net/1.10.15/js/dataTables.bootstrap.min.js" ></script>
        
    </head>
    <body>
        @include('user.layout.header')
        @yield('content')
        @include('user.layout.footer')
    </body>
</html>