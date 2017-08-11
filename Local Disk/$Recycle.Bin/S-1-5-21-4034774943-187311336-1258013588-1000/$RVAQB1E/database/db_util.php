<?php

class db_util {

	var $db; //db connection
	var $table_name; //name of the table on which common operations, insert;update;delete;get_list;, will be performed.

	//constructor
	function __construct() {

		//get global db object
		global $db_info;

		include_once LIBRARY_PATH . "database/Common.php";
		include_once LIBRARY_PATH . "database/DB.php";

		$db_conn = DB ( $db_info, ACTIVE_RECORD );
		//set db property so that we can access db using it.
		$this->db = $db_conn;
	}

	/*
		@name	insert()
		@arg1 	$arr_data		array('field_name'=>'value', 'field_name2'=>'value', 'field_name'=>BLANK)
								Use BLANK to set the field value to ''. Fields manually set to '' will not empty the field value and will not affect the existing field value.
		@return	insert_id of the new record

	*/
	function insert($arr_data) {


		$this->db->insert ( $this->table_name, $arr_data );

		return $this->db->insert_id (); //return insert id
	}

	/*
		@name	update()
		@desc	Update the records for matched where condition.
		@arg1 	$arr_data		array('field_name'=>'value', 'field_name2'=>'value', 'field_name'=>BLANK)
								Use BLANK to set the field value to ''. Fields manually set to '' will not empty the field value and will not affect the existing field value.
		@arg2	$where			associative array with coditions		array('id < '=>'5', 'name' => 'ash')
								Produces: where id < 5 and name = 'ash'
		@return	number of rows updated

	*/
	function update($arr_data, $where) {
		//update table records
		//echo"<pre>";print_r($arr_data);
		//echo $where;exit;
		$this->db->update ( $this->table_name, $arr_data, $where );

		return $this->db->affected_rows (); //return affeted rows
	}


	/*
		@name	delete()
		@arg1 	where 	delete matched records
						syntax	array('id <' => '5', 'name' => 'ash')
								Produces:	where id < 5 and name = 'ash'
		@return	number of rows deleted

	*/
	function delete($where = array()) {
		//delete records matching the where condition
		$this->db->delete ( $this->table_name, $where );

		return $this->db->affected_rows (); //return affeted rows
	}


	/*
		@name		get_list($columns = array(), $where = array())
		@desc		fetch all the records
		@arg1 		columns		names of required fields
									array('name_of_field','name_of_field','name_of_field','name_of_field','name_of_field')
		@arg2		where		associative array with coditions
									array('id < '=>'5', 'name' => 'ash')
									Produces: where id < 5 and name = 'ash'
		@return 	array() of matched records or emtpy array.

	*/
	function get_list($columns, $where) {

		//declare variables
		$arr_data = array ();

		//set query
		$this->db->select ( $columns );

		$this->db->from ( $this->table_name ); //set table name


		$this->db->where ( $where ); //set where condition


		$result_set = $this->db->get (); //execute qurey


		//fetch data
		$arr_data = $this->get_array_records_from_result_set ( $result_set );

		return $arr_data;
	}


	/*
		@name		get_paging_list($columns, $where, $limit, $offset)
		@desc		fetch all the records
		@arg1 		columns		names of required fields
									array('name_of_field','name_of_field','name_of_field','name_of_field','name_of_field')
								empty array
									it will return all the columns
		@arg2		where		associative array with coditions
									array('id < '=>'5', 'name' => 'ash')
									Produces: where id < 5 and name = 'ash'
		@arg3		limit		no of required records
		@arg4		offset		Starting record number where you want to start fetching the data.
		@return 	array() of matched records or emtpy array.

	*/
	function get_paging_list($columns, $where, $limit, $offset) {

		//declare variables
		$arr_data = array ();

		//set query
		$this->db->select ( $columns );

		$this->db->from ( $this->table_name ); //set table name


		$this->db->where ( $where ); //set where condition


		$this->db->limit ( $limit, $offset ); //set limit and offset


		$result_set = $this->db->get (); //execute qurey


		//fetch data
		$arr_data = $this->get_array_records_from_result_set ( $result_set );

		return $arr_data;
	}

	/*
		@name		get_array_result_for_query($query)
		@arg1 		query	select query
		@return		array of array for the given query or empty array
	*/
	function get_array_result_for_query($query) {

		//declare variables
		$arr_data = array ();

		//execute query
		$result_set = $this->db->query ( $query );

		//fetch data
		$arr_data = $this->get_array_records_from_result_set ( $result_set );

		return $arr_data;
	}

	/*
		@name		get_array_result_for_query($query)
		@arg1 		query	select query
		@return		array of objects for the given query or empty array
	*/
	function get_object_result_for_query($query) {

		//declare variables
		$arr_data = array ();

		//execute query
		$result_set = $this->db->query ( $query );

		//fetch data
		$arr_data = $this->get_object_records_from_result_set ( $result_set );

		return $arr_data;
	}

	/*
		@name		get_array_records_from_result_set()
		@desc		get result_set as argument and return array of all the records available
		@arg1		$result_set 	returned result set after executing select query.
		@return  	if record(s) avialable return array of array
					else empty array
	*/
	function get_array_records_from_result_set($result_set) {
		$arr_data = array ();

		foreach ( $result_set->result_array () as $row ) {
			$arr_data [] = $row;
		}
		return $arr_data;
	}

	/*
		@name		get_object_records_from_result_set()
		@desc		get result_set as argument and return array of all the records available
		@arg1		$result_set 	returned result set after executing select query.
		@return  	if record(s) avialable return array of objects
					else empty array
	*/
	function get_object_records_from_result_set($result_set) {
		$arr_data = array ();

		foreach ( $result_set->result () as $row ) {
			$arr_data [] = $row;
		}
		return $arr_data;
	}

	/*
		@desc 	this function can be used to print the last executed query
	*/
	function print_last_query() {
		echo $this->db->last_query ();
	}

/*
		@name	get_db_connection()
		@desc 	This function can be used to get connection and can be used for executing queries.
		@return DB connection

	function get_db_connection(){
		return $this->db;
	}
	*/
/*
		@name		get_list($columns = array(), $where = array(), $like = array(), $order_by = '', $limit = '', $offset = '')
		@desc		fetch all the records
		@arg1 		columns		names of required fields
									array('name_of_field','name_of_field','name_of_field','name_of_field','name_of_field')
								empty array
									it will return all the columns
		@arg2		where		associative array with coditions
									array('id < '=>'5', 'name' => 'ash')
									Produces: where id < 5 and name = 'ash'
		@arg3		order_by	'title desc, name asc'	Produces: ORDER BY title DESC, name ASC
		@arg4		like		array(
										array(
												'field'  => 'field_name',
												'match'  => 'string to match',
												'percent_place' =>	should be one among : 'before','after','both'
											)
										array(
												'field'  => 'field_name',
												'match'  => 'string to match',
												'percent_place' =>	should be one among : 'before','after','both'
											)
									)
									e.g.	array(
													array(
															'field'  => 'name',
															'match'  => 'ash',
															'percent_place' =>	'before'
														)
													array(
															'field'  => 'class',
															'match'  => 'm',
															'percent_place' =>	'both'
														)
											)
									Produce	:	WHERE  `name`  LIKE '%ash' AND  `class`  LIKE '%m%'
		@arg5		limit		no of required records
		@arg6		offset		@required to specify limit. Starting record number where you want to start fetching the data.
		@return 	array() of matched records or emtpy array.

	*/
/*function get_list($columns = array(), $where = array(), $like = array(), $order_by = '', $limit = '', $offset = ''){

		//declare variables
		$arr_data = array();

		//set query
		if(count($columns)>0) // if columns are specified then fetch only those columns
			$this->db->select($columns);
		else	// if no column specified then fetch all the columns
			$this->db->select('*');

		$this->db->from($this->table_name);	//set table name

		$this->db->where($where);	//set where condition

		//set like clause
		if(count($like)>0){
			foreach($like as $single){
				extract($single);	//make variables from array keys. Variables are field, match and percent_place
				$this->db->like($field, $match, $percent_place);
			}
		}

		//set order by clause
		if($order_by != ''){
			$this->db->order_by($order_by);
		}

		//set limit
		if($limit!=""){
			if($offset!="")	//if offset not empty then set offset
				$this->db->limit($limit, $offset);
			else
				$this->db->limit($limit);	//if offset is not there simply set limit
		}

		$result_set = $this->db->get();	//execute qurey

		//fetch data
		$arr_data = $this->get_array_records_from_result_set($result_set);

		return $arr_data;
	}*/
}
?>
