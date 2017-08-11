<?php
//echo "<pre>";print_r($_SERVER);die;
error_reporting(E_ALL);
//error_reporting(0);

ini_set('display_errors', 1);
ob_start();
session_start ();
ini_set('max_execution_time', 123456);
ini_set("memory_limit", "200M");
ini_set("upload_max_filesize", "18M");
ini_set("post_max_size", "18M");
date_default_timezone_set('Asia/Singapore');

	if($_GET['action']=='accept_email_notification'||$_GET['action']=='friend_recommendation'||$_GET['action']=='reject_email_notification'){
		require 'config/config_live.php';
	}
	else{
		require 'config/config.php';
	}
	

include 'global/global_util.php';
include 'global/messages.php';
include LIBRARY_PATH . 'database/db_util.php';
include 'global/global_func.php';
include_once ('phpmailer/class.phpmailer.php');
$obj_global = new global_util ();
$title = "Champion Tutor";
$user_id = $obj_global->get_session ( 'user_id' );
$action = $obj_global->get_query_string_var ( 'action' );
if($user_id == '')
{
  $user_id = $obj_global->get_session ( 'student_id' );
}
// echo "<pre>";
// print_r($_SESSION);
// exit;
if(isset($_SESSION['tution_centre']['user']) and !empty($_SESSION['tution_centre']['user'])){
  $centreDetails=$_SESSION['tution_centre']['user'];
  if(isset($centreDetails->tutor_id) and !empty($centreDetails->tutor_id)){
    $obj_db_util1 = new db_util;
    $obj_db_global_func1 = new db_global_func;
    $query_login11 = "select * from tutor where tutor_id =".$centreDetails->tutor_id;
    $res_login11 = $obj_db_util1->get_array_result_for_query($query_login11);
    $rows_login11 = count($res_login11);
    if($rows_login11 > 0){
      $_SESSION['tutor_id'] = $res_login11[0]['tutor_id'];
      $tutor_id = $res_login11[0]['tutor_id'];
      $_SESSION['tutor_email'] = $res_login11[0]['email'];
      $_SESSION['start_time'] = time();
    }
  }
}

//var_dump($action);
if ($action == NULL || $action == "" || ! file_exists ( $action . '.php' )) {
    $action_php = 'home.php';

    $action_html = 'html/home.html';
    $action_html_ref = 'html_ref/home_ref.html';

} else {
    if ($action == 'Proceed_download') {
        echo "<script type='text/javascript'>window.location = 'https://www.championtutor.com/free-test-papers-download';</script>";
    }else{
        $action_php = $action . '.php';
        $action_html = 'html/' . $action . '.html';
        $action_html_ref = 'html_ref/' . $action . '_ref.html';
        if(isset($_GET['option']) && $_GET['option'] == 'show'){
            $action='view_tutor';
        }
    }
}
include_once ($action_php);

?>
