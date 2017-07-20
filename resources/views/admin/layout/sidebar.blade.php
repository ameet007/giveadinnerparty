<div class="left side-menu">
  <div class="sidebar-inner slimscrollleft">

    <!--- Sidemenu -->
    <div id="sidebar-menu">
      <ul>
        <li class="menu-title">Navigation</li>

        <li class="has_sub">
          <a href="{{Request::root()}}/admin/home" class="waves-effect"><i class="mdi mdi-view-dashboard"></i> <span> Dashboard </span> </a>
          <ul class="list-unstyled">
          </ul>
        </li>

        <li class="has_sub">
          <a href="javascript:void(0);" class="waves-effect"><i class="fa fa-cog"></i> <span> System Settings </span> <span class="menu-arrow"></span></a>
          <ul class="list-unstyled">
            <li <?= (Request::segment(2) == 'company') ? 'class="active"' : '' ?>>
              <a <?= (Request::segment(2) == 'company') ? 'class="active"' : '' ?> href="{{Request::root()}}/admin/company">Company Details</a>
            </li>
            <li>
              <a href="javascript:void(0);">Terms & Conditions</a>
            </li>

            <li <?= (Request::segment(2) == 'admins') ? 'class="active"' : '' ?>>
              <a <?= (Request::segment(2) == 'admins') ? 'class="active"' : '' ?> href="{{Request::root()}}/admin/admins">Manage Admins</a>
            </li>
          </ul>
        </li>
        <li class="has_sub">
          <a href="{{Request::root()}}/admin/users" class="waves-effect <?= (Request::segment(2) == 'users') ? 'active' : '' ?>"><i class="fa fa-users"></i> <span> Manage Users </span> </a>
        </li>
        <li class="has_sub">
          <a href="{{Request::root()}}/admin/events" class="waves-effect"><i class="fa fa-calendar"></i> <span> Manage Events </span></a>
        </li>
        <li class="has_sub">
          <a href="javascript:void(0);" class="waves-effect"><i class="fa fa-dollar"></i> <span> Transaction Reports </span></a>
        </li>
        <li class="has_sub">
          <a href="javascript:void(0);" class="waves-effect"><i class="fa fa-bolt"></i> <span> CMS </span> <span class="menu-arrow"></span></a>
          <ul class="list-unstyled">
            <li>
              <a href="javascript:void(0);">Social Links</a>
            </li>
            <li>
              <a href="javascript:void(0);">Contact Us</a>
            </li>
            <li <?= (Request::segment(2) == 'admin') ? 'class="active"' : '' ?>>
              <a  <?= (Request::segment(2) == 'admin') ? 'class="active"' : '' ?> href="{{Request::root()}}/admin/aboutus">About Us</a>
            </li>
            <li <?= (Request::segment(2) == 'admin') ? 'class="active"' : '' ?>>
              <a <?= (Request::segment(2) == 'admin') ? 'class="active"' : '' ?> href="{{Request::root()}}/admin/faq">FAQs</a>
            </li>
            <li <?= (Request::segment(2) == 'admin') ? 'class="active"' : '' ?>>
              <a <?= (Request::segment(2) == 'admin') ? 'class="active"' : '' ?> href="{{Request::root()}}/admin/banners">Banners and Images</a>
            </li>
            <li>
              <a href="javascript:void(0);">SEO</a>
            </li>
          </ul>
        </li>
        <li class="has_sub">
          <a href="javascript:void(0);" class="waves-effect"><i class="fa fa-heart"></i> <span> Charities </span> <span class="menu-arrow"></span></a>
          <ul class="list-unstyled">
            <li <?= (Request::segment(2) == 'admin') ? 'class="active"' : '' ?>>
              <a <?= (Request::segment(2) == 'admin') ? 'class="active"' : '' ?> href="{{Request::root()}}/admin/charity">Manage Charities</a>
            </li>
            <li>
              <a href="javascript:void(0);">Weekly Payout</a>
            </li>
            <li>
              <a href="javascript:void(0);">Transaction Reports</a>
            </li>
          </ul>
        </li>
		 <li class="has_sub">
          <a href="{{Request::root()}}/admin/offers" class="waves-effect <?= (Request::segment(2) == 'offers') ? 'active' : '' ?>"><i class="fa fa-users"></i> <span> Manage Offers </span> </a>
        </li>
      </ul>
    </div>
    <!-- Sidebar -->
    <div class="clearfix"></div>
  </div>
</div>

<script src="{{Request::root()}}/assets/admin/js/jquery.min.js"></script>
<script src="{{Request::root()}}/assets/admin/js/bootstrap.min.js"></script>
<script src="{{Request::root()}}/assets/admin/js/detect.js"></script>
<script src="{{Request::root()}}/assets/admin/js/fastclick.js"></script>
<script src="{{Request::root()}}/assets/admin/js/jquery.blockUI.js"></script>
<script src="{{Request::root()}}/assets/admin/js/waves.js"></script>
<script src="{{Request::root()}}/assets/admin/js/jquery.slimscroll.js"></script>
<script src="{{Request::root()}}/assets/admin/js/jquery.scrollTo.min.js"></script>
<script src="{{Request::root()}}/assets/admin/plugins/switchery/switchery.min.js"></script>
<!-- Counter js  -->
<script src="{{Request::root()}}/assets/admin/plugins/waypoints/jquery.waypoints.min.js"></script>
<script src="{{Request::root()}}/assets/admin/plugins/counterup/jquery.counterup.min.js"></script>
<!--Morris Chart-->
<script src="{{Request::root()}}/assets/admin/plugins/morris/morris.min.js"></script>
<script src="{{Request::root()}}/assets/admin/plugins/raphael/raphael-min.js"></script>
<!-- Dashboard init -->
<script src="{{Request::root()}}/assets/admin/pages/jquery.dashboard.js"></script>
<!-- App js -->
<script src="{{Request::root()}}/assets/admin/js/jquery.core.js"></script>
<script src="{{Request::root()}}/assets/admin/js/jquery.app.js"></script>
<!-- Toastr js -->
<script src="{{Request::root()}}/assets/admin/plugins/toastr/toastr.min.js"></script>
<!-- Toastr init js (Demo)-->
<script src="{{Request::root()}}/assets/admin/pages/jquery.toastr.js"></script>
<!-- init -->
<script src="{{Request::root()}}/assets/admin/pages/jquery.datatables.init.js"></script>
<script src="{{Request::root()}}/assets/admin/plugins/datatables/jquery.dataTables.min.js"></script>
<script src="{{Request::root()}}/assets/admin/plugins/datatables/dataTables.bootstrap.js"></script>
<!-- HTML5 Shiv and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
<script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
<![endif]-->
<script src="{{Request::root()}}/assets/admin/js/modernizr.min.js"></script>
<script type="text/javascript" src="{{Request::root()}}/assets/admin/plugins/parsleyjs/parsley.min.js"></script>
<script type="text/javascript" src="{{Request::root()}}/assets/admin/js/bootstrap-datepicker.min.js"></script>






