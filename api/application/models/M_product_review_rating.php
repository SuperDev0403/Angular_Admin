<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_product_review_rating extends CI_Model{
	
	protected $table = 'product_review_rating';
 
    public function __construct()
    {
        $this->load->database();
    }

    public function insert($data)
    {
        if ($this->exist($data)) {
            return 0;
        } else {
            $this->db->insert($this->table, $data);
            $result = $this->db->insert_id();
        
            if ($result) {
                return $result;
            } else {
                return 0;
            }
        }
    }

    function exist($data){       
        $sql = "SELECT * FROM product_review_rating WHERE product_review_rating_asin='".$data['product_review_rating_asin']."' AND product_review_rating_marketplace_id='".$data['product_review_rating_marketplace_id']."' AND product_review_rating_datetime='".$data['product_review_rating_datetime']."'";
        $query = $this->db->query($sql);
        $count = $query->num_rows();
      
        return ($count > 0) ? TRUE : FALSE;
    }
}