<?php use App\Http\Controllers\cmsController; ?>
<?php $url = Request::url();  ?>
<?php $meta_data =  cmsController::get_metatag($url);?>
<!DOCTYPE html>
<html>
    <head>
		<?php if(count($meta_data)>0){ ?>
			<title>{{ $meta_data->title }}</title>
			<meta name="description" content=">{{ $meta_data->description }}</">
			<meta name="keywords" content=">{{ $meta_data->keyword }}</">
		<?php } else { ?>
			<title>Give A Dinner Party</title>
		<?php } ?>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <link href="{{Request::root()}}/assets/front/css/owl.carousel.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/owl.theme.default.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/rateyo.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/bxslider.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/nav.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/datepicker.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/bootstrap.css" rel="stylesheet" type="text/css" />
        <link href="{{Request::root()}}/assets/front/css/main.css" rel="stylesheet" type="text/css" />
        <script src="{{Request::root()}}/assets/front/js/html5.js"></script>
        <link href="{{Request::root()}}/assets/front/css/media.css" rel="stylesheet" type="text/css" />
        <script src="{{Request::root()}}/assets/front/js/jQuery.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/rateyo.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/owl.carousel.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/bxslider.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/fancySelect.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/bootstrap.min.js" type="text/javascript"></script>
        <script src="{{Request::root()}}/assets/front/js/bootstrap-datepicker.js" type="text/javascript"></script>
		<script src="{{Request::root()}}/assets/admin/plugins/parsleyjs/parsley.min.js" type="text/javascript"></script>
		<script>
			$(document).ready(function() {
				$('#demo-form').parsley();
			});			
		</script>
		
    </head>
    <body>
        @include('common.layout.front-header')
        @yield('content')
        @include('common.layout.front-footer')
    </body>
</html>
