<?php
//error_reporting(E_ALL);
ob_start();
session_start ();
ini_set('max_execution_time', 123456);
ini_set("memory_limit", "200M");
ini_set("upload_max_filesize", "18M");
ini_set("post_max_size", "18M");
date_default_timezone_set('Asia/Singapore');

//print '/home/champtutor/public_html/config/config.php';
//include required files
include '/home/champtutor2/public_html/config/config.php';
//print BASEPATH.'global/global_util.php';
include 'global/global_util.php';
include 'global/messages.php';
include LIBRARY_PATH . 'database/db_util.php';
include 'global/global_func.php';
/*mailer function*/
include_once ('phpmailer/class.phpmailer.php');

//objects instantiation
$obj_global = new global_util ();

//variable declaration
$title = "Champion Tutor";
$user_id = $obj_global->get_session ( 'user_id' );
//print_r($_SESSION);
//set session timeout of 15 mins
/*
$inactive = 900; // Set timeout period in seconds
if (isset($_SESSION['start_time'])) {
   $session_life = time() - $_SESSION['start_time'];
    if ($session_life > $inactive) {
        session_destroy();
        header("Location: index.php");
    }
}
$_SESSION['start_time'] = time();
*/


//collect get/post values	
$action = $obj_global->get_query_string_var ( 'action' );

//select page to execute based on module
if ($action == NULL || $action == "" || ! file_exists ( $action . '.php' )) {
	$action_php = 'home.php';
	$action_html = 'html/home.html';
	$action_html_ref = 'html_ref/home_ref.html';	
} else {

	$action_php = $action . '.php';
	$action_html = 'html/' . $action . '.html';
	$action_html_ref = 'html_ref/' . $action . '_ref.html';

	if(isset($_GET['option']) && $_GET['option'] == 'show'){
		$action='view_tutor';
	}

}

//execute module
include_once ($action_php);
?>
