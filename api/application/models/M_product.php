<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_product extends CI_Model{
	
	protected $table = 'product';
 
    public function __construct()
    {
        $this->load->database();
    }

    public function insert($data) {
        $this->db->insert($this->table, $data);
        $insert_id = $this->db->insert_id();
     
        return  $insert_id;
    }

    public function get_id($data) {
        $this->db->select('product_id');
        $this->db->from($this->table);
        $this->db->where($data);
        $query = $this->db->get()->result();
        if ($query) {
            return $query[0]->product_id;
        } else {
            return $this->insert($data);
        }
    }
}