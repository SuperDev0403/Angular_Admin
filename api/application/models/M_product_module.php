<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_product_module extends CI_Model{
	
	protected $table = 'product_module';
 
    public function __construct()
    {
        $this->load->database();
    }
     
    public function product_modules_list()
    {
        $query = $this->db->get('product_module');
        return $query->result();
    }
     
    public function get_product_modules_num_by_collectionid($collectionid)
    {
        $sql = "select product_module_id from product_module where product_module_collectionid='".$collectionid."'";
        $query = $this->db->query($sql);
        $count = $query->num_rows();
        return $count;
    }
     
    public function get_product_modules_without_request()
    {
        $sql = "SELECT product_module_id, product_asin, marketplace_domain, product_module_is_review, product_module_is_price 
        FROM product_module, product, marketplace 
        WHERE product_module.product_module_product_id=product.product_id 
        AND product_module.product_module_collectionid IS NULL 
        AND product_module.product_module_marketplace_id=marketplace.marketplace_id";
        $result = $this->db->query($sql)->result_array();
        return $result;
    }

    public function insert_review_request($id, $requestid, $collectionid)
    {
        $data = array(
            'product_module_request_review_id' => $requestid,
            'product_module_collectionid' => $collectionid
        );
        
        $this->db->where('product_module_id', $id);
        $this->db->update('product_module', $data);
    }

    public function insert_offer_request($id, $requestid, $collectionid)
    {
        $data = array(
            'product_module_request_offer_id' => $requestid,
            'product_module_collectionid' => $collectionid
        );
        
        $this->db->where('product_module_id', $id);
        $this->db->update('product_module', $data);
    }

    public function get_marketplace_id_from_review($request_review_id)
    {
        $query = $this->db->get_where('product_module', array('product_module_request_review_id' => $request_review_id));
        if ($query->num_rows() > 0)
            return $query->row()->product_module_marketplace_id;
        else
            return 0;
    }

    public function get_marketplace_id_from_offer($request_offer_id)
    {
        $query = $this->db->get_where('product_module', array('product_module_request_offer_id' => $request_offer_id));
        if ($query->num_rows() > 0)
            return $query->row()->product_module_marketplace_id;
        else
            return 0;
    }

    public function get_product_asins() {
        $sql = "SELECT product_module_id, product_module_product_id, client_id, client_name, product_asin, product_module_marketplace_id, 
        marketplace_code, product_module_is_review, product_module_is_content, product_module_is_price, product_module_is_answers, 
        product_module_price_msrp, product_module_price_base, product_module_image_thumbnail
        FROM (SELECT product_module_id, product_module_product_id, product_module_marketplace_id, marketplace_code, product_module_is_review, product_module_is_content, product_module_is_price, product_module_is_answers, 
        product_module_price_msrp, product_module_price_base, product_module_image_thumbnail FROM product_module LEFT JOIN marketplace ON marketplace.marketplace_id=product_module.product_module_marketplace_id) AS a 
        LEFT JOIN (SELECT product_id, product_asin, client_id, client_name FROM product LEFT JOIN client ON product.product_client_id=client.client_id) AS b
        ON a.product_module_product_id=b.product_id";
        $result = $this->db->query($sql)->result_array();
    	return $result;
    }

    public function delete_module($id) {
        $this->db->where('product_module_id', $id);
        $result = $this->db->delete($this->table);
        return $result;
    }

    public function edit_module($id, $data) {
        $this->db->where('product_module_id', $id);
        $result = $this->db->update($this->table, $data);
        return $result;
    }

    public function add_module($data) {
        $result = $this->db->insert($this->table, $data);
        return $result;
    }
}