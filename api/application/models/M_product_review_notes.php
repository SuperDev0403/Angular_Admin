<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_product_review_notes extends CI_Model{
	
	protected $table = 'product_review_note';
 
    public function __construct()
    {
        $this->load->database();
    }
     
    public function get_notes_list()
    {
        $query = $this->db->get('product_review_note');
        return $query->result_array();
    }

    public function insert_note($data) {
        $this->db->insert($this->table, $data);
        $result = $this->db->insert_id();
    
        if ($result) {
            return $result;
        } else {
            return 0;
        }
    }
}