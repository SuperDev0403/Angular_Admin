<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_collection extends CI_Model{
	
	protected $table = 'collection';
 
    public function __construct()
    {
        $this->load->database();
    }
     
    public function collections_list()
    {
        $query = $this->db->get('collection');
        return $query->result_array();
    }
     
    public function get_collections_by_id($id)
    {
        $query = $this->db->get_where('collection', array('id' => $id));
        return $query->row();
    }
     
    public function insert_collection($collection_id)
    {
        $data = array(
            'collection_id' => $collection_id
        );
        if ($this->collection_exists($collection_id)) {
            $this->db->insert('collection', $data);
            return $this->db->insert_id();
        } else {
            return 0;
        }
    }
    
    function collection_exists($collection_id)
    {
        $this->db->where('collection_id',$collection_id);
        $query = $this->db->get('collection');
        if ($query->num_rows() > 0){
            return false;
        }
        else{
            return true;
        }
    }
    public function delete($id)
    {
        $this->db->where('id', $id);
        return $this->db->delete('collection');
    }
}