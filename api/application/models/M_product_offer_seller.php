<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_product_offer_seller extends CI_Model{
	
	protected $table = 'product_offer_seller';
 
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
                return -1;
            }
        }
    }

    function exist($data){       
        $sql = "SELECT * FROM product_offer_seller WHERE product_offer_seller_amazon_id='".$data['product_offer_seller_amazon_id']."'";
        $query = $this->db->query($sql);
        $count = $query->num_rows();
      
        return ($count > 0) ? TRUE : FALSE;
    }
}