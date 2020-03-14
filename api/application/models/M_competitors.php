<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_competitors extends CI_Model{
	
	protected $table = 'boardfy_competitors';
	
	public function insert($data) {
        $this->db->insert($this->table, $data);
        $result = $this->db->insert_id();

        if ($result) {
            return $result;
        } else {
            return 0;
        }
    }

    public function getSellerPricingStats($date, $mc) {
    	$sql = "SELECT SUM(IF(belowCounttbl.bellowCount > 0,1, 0)) AS belowCount, COUNT(*) AS totalvendors FROM (SELECT seller.name AS seller_name, seller.seller_id AS seller_id, SUM(IF(products.msrp >= seller.price,1, 0)) AS bellowCount, COUNT(products.id) as totalProducts FROM `boardfy_competitors` AS seller LEFT JOIN `boardfy_products` AS products ON seller.producttb_id = products.id WHERE products.date = '".$date."' AND seller.seller_id IS NOT NULL AND products.mc = '".$mc."' GROUP BY seller.seller_id) AS belowCounttbl";
    	$result = $this->db->query($sql)->result_array();
    	return $result;

    }

    public function getSellerPricing($date, $mc) {
    	$sql = "SELECT seller.name AS seller_name, seller.seller_id AS seller_id, SUM(IF(products.msrp >= seller.price,1, 0)) AS bellowCount, COUNT(products.id) as totalProducts FROM `boardfy_competitors` AS seller LEFT JOIN `boardfy_products` AS products ON seller.producttb_id = products.id WHERE products.date = '".$date."' AND seller.seller_id IS NOT NULL AND products.mc = '".$mc."' GROUP BY seller.seller_id";
    	$result = $this->db->query($sql)->result_array();
    	return $result;

    }

    public function getSellerProductListing($date, $seller_id, $mc) {
    	$sql = "SELECT products.ean AS ean, products.productName AS productName, products.msrp AS rrp, seller.price AS price, products.platform, products.country, products.photoUri FROM boardfy_products AS products LEFT JOIN boardfy_competitors AS seller ON seller.producttb_id = products.id WHERE seller.seller_id = '".$seller_id."' AND products.mc = '".$mc."' AND products.date = '".$date."'";
    	$result = $this->db->query($sql)->result_array();
    	return $result;
    }

    public function getProductListingStats($fromDate, $toDate, $mc) {
    	$sql = "SELECT products.ean AS ean, products.date, products.platform, products.country FROM boardfy_products AS products LEFT JOIN boardfy_competitors AS seller ON products.id = seller.producttb_id WHERE products.date BETWEEN '".$fromDate."' AND '".$toDate."' AND products.mc = '".$mc."' GROUP BY products.id";    	
    	$result = $this->db->query($sql)->result_array();
    	return $result;
    }

    public function getProductListing($fromDate, $toDate, $mc) {
    	$sql = "SELECT MAX(seller.price) AS max_price, MIN(seller.price) AS min_price, products.msrp AS rrp, products.id AS product_id, products.ean AS ean, products.productName AS productName, products.photoUri, products.date, products.platform, products.country FROM boardfy_products AS products LEFT JOIN boardfy_competitors AS seller ON products.id = seller.producttb_id WHERE products.date BETWEEN '".$fromDate."' AND '".$toDate."' AND products.mc = '".$mc."' GROUP BY products.id";    	
    	$result = $this->db->query($sql)->result_array();
    	return $result;
    }

    public function getSellerProductComparison($date, $mc, $ean) {
    	$sql = "SELECT seller.name AS seller_name, seller.price AS price, products.msrp AS rrp, products.platform, products.country  FROM boardfy_products AS products LEFT JOIN boardfy_competitors AS seller ON products.id = seller.producttb_id WHERE products.date = '".$date."' AND products.mc = '".$mc."' AND products.ean = '".$ean."'";
    	$result = $this->db->query($sql)->result_array();
    	return $result;
    }

    public function getAllProductsAndSellersStats($date, $mc) {
        $sql = "SELECT SUM(IF(diff<-15,1, 0)) AS a1, SUM(IF(diff>=-15 AND diff<-10,1, 0)) AS a2, SUM(IF(diff>=-10 AND diff<0,1, 0)) AS a3, SUM(IF(diff=0,1, 0)) AS a4, SUM(IF(diff>0 AND diff<=10,1, 0)) AS a5, SUM(IF(diff>10 AND diff<=25,1, 0)) AS a6,SUM(IF(diff>25 AND diff<=50,1, 0)) AS a7, SUM(IF(diff>50,1, 0)) AS a8 FROM (SELECT (sellers.price - products.msrp) / products.msrp * 100 AS diff FROM boardfy_products AS products LEFT JOIN boardfy_competitors AS sellers ON products.id = sellers.producttb_id WHERE products.date = '".$date."' AND mc = '".$mc."') AS difftbl";
        $result = $this->db->query($sql)->result_array();
        return $result;
    }

    public function getAllProductsAndSellers($date, $mc) {
        $sql = "SELECT products.ean, sellers.name, products.msrp, sellers.price FROM boardfy_products AS products LEFT JOIN boardfy_competitors AS sellers ON products.id = sellers.producttb_id WHERE products.date = '".$date."' AND mc = '".$mc."'";
        $result = $this->db->query($sql)->result_array();
        return $result;
    }

    public function removePreviousData($prevDate) {
        $sql = "DELETE products, sellers FROM boardfy_products AS products LEFT JOIN boardfy_competitors AS sellers ON products.id = sellers.producttb_id WHERE products.date < '".$prevDate."'";
        $result = $this->db->query($sql);
        return $result;
    }
	
}