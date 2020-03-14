<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_product_review extends CI_Model{
	
	protected $table = 'product_review';
 
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
        $sql = "SELECT * FROM product_review WHERE product_review_amazon_id='".$data['product_review_amazon_id']."'";
        $query = $this->db->query($sql);
        $count = $query->num_rows();
      
        return ($count > 0) ? TRUE : FALSE;
    }

    public function get_product_reviews() {
        $sql = "SELECT product_review_id, product_review_amazon_id, product_review_asin, product_review_marketplace_id, product_review_title, product_review_body,
        product_review_rating, product_review_date, product_review_link, product_review_profile_name, product_id, product_client_id, product_module_image_thumbnail
        FROM (SELECT product_review_id, product_review_amazon_id, product_review_asin, product_review_marketplace_id, product_review_title, product_review_body,
        product_review_rating, product_review_date, product_review_link, product_review_profile_name, product_id, product_client_id
        FROM product_review, product WHERE product_review_datetime='".date("Y-m-d")."' AND product_asin=product_review_asin) AS review, product_module 
        WHERE review.product_id=product_module.product_module_product_id AND review.product_review_marketplace_id=product_module.product_module_marketplace_id";
        $result = $this->db->query($sql)->result_array();
    	return $result;
    }

    public function get_reviews_status() {
        $sql = "SELECT product_review_status_id,product_review_status_user_id,product_review_status_amazon_id,product_review_status_type_name FROM product_review_status LEFT JOIN product_review_status_type ON product_review_status.product_review_status_type_id=product_review_status_type.product_review_status_type_id";
        $result = $this->db->query($sql)->result_array();
    	return $result;
    }

    public function get_globalReputation($from, $to, $marketplace_id, $product_client_id) {
        $sql = "select SUM(product_review_rating)/count(product_review_id) as global_reputation from product_review, (select product_asin from product where product_client_id='".$product_client_id."') as a where product_review_asin=product_asin and product_review_datetime='".date("Y-m-d")."' and product_review_date between '".$from."' and '".$to."'";
        if ($marketplace_id)
            $sql .= "and product_review_marketplace_id='".$marketplace_id."'";
        $result = $this->db->query($sql)->result();
    	return $result;
    }

    public function get_totalNumofReviews($marketplace_id, $product_client_id) {
        $sql = "SELECT COUNT(product_review_id) AS total_reviews_cnt FROM product_review, (select product_asin from product where product_client_id='".$product_client_id."') as a where product_review_asin=product_asin and product_review_datetime='".date("Y-m-d")."'";
        if ($marketplace_id)
            $sql .= "and product_review_marketplace_id='".$marketplace_id."'";
        $result = $this->db->query($sql)->result();
    	return $result;
    }

    public function get_NumofReviews($from, $to, $marketplace_id, $product_client_id) {
        $sql = "SELECT COUNT(product_review_id) AS total_reviews_cnt FROM product_review, (SELECT product_asin FROM product WHERE product_client_id='".$product_client_id."') AS a WHERE product_review_asin=product_asin AND product_review_datetime='".date("Y-m-d")."' and product_review_date BETWEEN '".$from."' AND '".$to."'";
        if ($marketplace_id)
            $sql .= "and product_review_marketplace_id='".$marketplace_id."'";
        $result = $this->db->query($sql)->result();
    	return $result;
    }

    public function get_sellerReputation($marketplace_id, $product_client_id, $date) {
        $sql = "select SUM(product_offer_seller_rating_ratings_total*product_offer_seller_rating_percentage_positive)/sum(product_offer_seller_rating_ratings_total) as seller_reputation 
        from product_offer_seller_rating, 
        (select product_offer_seller_amazon_id from product_offer, (select product_asin from product where product_client_id='".$product_client_id."') as a where product_offer_asin=product_asin group by product_offer_seller_amazon_id) as b
        WHERE product_offer_seller_rating_amazon_id=product_offer_seller_amazon_id and product_offer_seller_rating_date='".$date."'";
        if ($marketplace_id)
            $sql .= "and product_offer_seller_rating_marketplace_id='".$marketplace_id."'";
        $result = $this->db->query($sql)->result();
    	return $result;
    }

    public function get_sellerNum($marketplace_id, $product_client_id) {
        $sql = "SELECT product_offer_seller_amazon_id FROM product_offer, (SELECT product_asin FROM product WHERE product_client_id='".$product_client_id."') AS a WHERE product_offer_asin=product_asin GROUP BY product_offer_seller_amazon_id";
        if ($marketplace_id)
            $sql = "SELECT product_offer_seller_amazon_id FROM product_offer, (SELECT product_asin FROM product WHERE product_client_id='".$product_client_id."') AS a WHERE product_offer_asin=product_asin AND product_offer_marketplace_id='".$marketplace_id."' GROUP BY product_offer_seller_amazon_id";
        $query = $this->db->query($sql);
        return $query->num_rows();
    }

    public function get_productNum($marketplace_id, $product_client_id) {
        $sql = "SELECT product_module_product_id, product_module_marketplace_id FROM product_module, (SELECT product_id FROM product WHERE product_client_id='".$product_client_id."') AS a WHERE 1=1 GROUP BY product_module_product_id, product_module_marketplace_id";
        if ($marketplace_id)
            $sql = "SELECT product_module_product_id, product_module_marketplace_id FROM product_module, (SELECT product_id FROM product WHERE product_client_id='".$product_client_id."') AS a WHERE 1=1 and product_module_marketplace_id='".$marketplace_id."' GROUP BY product_module_product_id, product_module_marketplace_id";
        $query = $this->db->query($sql);
        return $query->num_rows();
    }

    public function get_productRating($from, $to, $marketplace_id, $product_client_id, $star1, $star2) {
        $sql = "SELECT COUNT(product_review_id) AS total_reviews_cnt FROM product_review, (SELECT product_asin FROM product WHERE product_client_id='".$product_client_id."') AS a WHERE product_review_asin=product_asin AND product_review_datetime='".date("Y-m-d")."' and product_review_date BETWEEN '".$from."' AND '".$to."' and (product_review_rating='".$star1."' or product_review_rating='".$star2."')";
        if ($marketplace_id)
            $sql .= "and product_review_marketplace_id='".$marketplace_id."'";
        $result = $this->db->query($sql)->result();
    	return $result;
    }

    public function get_starRating($date, $marketplace_id, $product_client_id) {
        $sql = "select sum(product_review_rating_summary_rating_5_stars_count) as s5, sum(product_review_rating_summary_rating_4_stars_count) as s4, sum(product_review_rating_summary_rating_3_stars_count) as s3,
        sum(product_review_rating_summary_rating_2_stars_count) as s2, sum(product_review_rating_summary_rating_1_stars_count) as s1 from product_review_rating,
        (SELECT product_asin FROM product WHERE product_client_id='".$product_client_id."') AS a WHERE product_review_rating_asin=product_asin AND product_review_rating_datetime='".$date."'";
        if ($marketplace_id)
            $sql .= "and product_review_rating_marketplace_id='".$marketplace_id."'";
        $result = $this->db->query($sql)->result();
    	return $result;
    }

    public function get_productReputation($marketplace_id, $product_client_id) {
        $sql = "SELECT COUNT(product_review_id) AS total_reviews_cnt, product_review_rating FROM product_review, (SELECT product_asin FROM product WHERE product_client_id='".$product_client_id."') AS a WHERE product_review_asin=product_asin AND product_review_datetime='".date("Y-m-d")."' GROUP BY product_review_rating";
        if ($marketplace_id)
            $sql = "SELECT COUNT(product_review_id) AS total_reviews_cnt, product_review_rating FROM product_review, (SELECT product_asin FROM product WHERE product_client_id='".$product_client_id."') AS a WHERE product_review_asin=product_asin AND product_review_datetime='".date("Y-m-d")."' and product_review_marketplace_id='".$marketplace_id."' GROUP BY product_review_rating";
        $result = $this->db->query($sql)->result();
    	return $result;   
    }

    public function get_sellerRatingReputation($marketplace_id, $product_client_id, $below_perc, $above_perc, $date) {
        $sql = "SELECT COUNT(product_offer_seller_rating_id) AS seller_reputation FROM product_offer_seller_rating,
        (SELECT product_offer_seller_amazon_id FROM product_offer, (SELECT product_asin FROM product WHERE product_client_id='".$product_client_id."') AS a WHERE product_offer_asin=product_asin GROUP BY product_offer_seller_amazon_id) AS b
        WHERE product_offer_seller_rating_amazon_id=product_offer_seller_amazon_id AND product_offer_seller_rating_date='".$date."' AND (product_offer_seller_rating_percentage_positive>='".$below_perc."' AND product_offer_seller_rating_percentage_positive<'".$above_perc."')";
        if ($marketplace_id)
            $sql .= "and product_offer_seller_rating_marketplace_id='".$marketplace_id."'";
        $result = $this->db->query($sql)->result();
    	return $result;
    }
}