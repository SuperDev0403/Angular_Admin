<?php if(!defined('BASEPATH')) exit('No direct script allowed');

class M_vendor_po extends CI_Model{
	
    protected $table = 'vendor_po';
    
    public function getMonthtodatesales($id, $from, $to) {
        $sql = "SELECT SUM(vendor_po_total_cost) as total_cost, SUM(vendor_po_received) AS total_count FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
        WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND vendor_po.vendor_po_accepted > 0 AND
        vendor_po.vendor_po_delivery_window_start BETWEEN '".$from."' AND '".$to."'";
        $result = $this->db->query($sql)->result_array();
    	return $result;
    }

    public function getMonthtodatesales1($id, $vc, $day, $month, $year) {
        $sql = "SELECT DAY(vendor_po.vendor_po_delivery_window_start) AS day, SUM(vendor_po_total_cost) as total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
        WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
        WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND vendor_po.vendor_po_accepted > 0 AND
        YEAR(vendor_po.vendor_po_delivery_window_start) = '".$year."' AND 
        MONTH(vendor_po.vendor_po_delivery_window_start) = '".$month."' AND DAY(vendor_po.vendor_po_delivery_window_start) <= '".$day."' 
        GROUP BY day ORDER BY day";
        if ($vc != '0') {
            $sql = "SELECT DAY(vendor_po.vendor_po_delivery_window_start) AS day, SUM(vendor_po_total_cost) as total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
            WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
            WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND vendor_po.vendor_po_code = '".$vc."' AND vendor_po.vendor_po_accepted > 0 AND
            YEAR(vendor_po.vendor_po_delivery_window_start) = '".$year."' AND 
            MONTH(vendor_po.vendor_po_delivery_window_start) = '".$month."' AND DAY(vendor_po.vendor_po_delivery_window_start) <= '".$day."' 
            GROUP BY day ORDER BY day";           
        }
        $result = $this->db->query($sql)->result_array();
    	return $result;
    }

    public function getInvoiceEvolution($id, $start, $end) {
        $sql = "SELECT vendor_po.vendor_po_code AS ven_code, YEAR(vendor_po.vendor_po_delivery_window_start) AS yr, MONTH(vendor_po.vendor_po_delivery_window_start) AS mon, SUM(vendor_po_total_cost) AS total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
        WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
        WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND vendor_po.vendor_po_accepted > 0 AND
        vendor_po.vendor_po_delivery_window_start BETWEEN '".$start."' AND '".$end."' GROUP BY ven_code, yr, mon";
        $result = $this->db->query($sql)->result_array();
        return $result;
    }

    public function getYeartodatesales($id, $from, $to) {
        $sql = "SELECT MONTH(vendor_po.vendor_po_delivery_window_start) AS month, SUM(vendor_po_total_cost) as total_cost, SUM(vendor_po_received) AS total_count FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code
         WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
        WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND vendor_po.vendor_po_accepted > 0 AND
        vendor_po.vendor_po_delivery_window_start BETWEEN '".$from."' AND '".$to."' GROUP BY month ORDER BY month";
        $result = $this->db->query($sql)->result_array();
    	return $result;
    }

    public function getKeyFifures($id, $vc) {
        $sql = "SELECT SUM(vendor_po_accepted*vendor_po_unit_cost) AS total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
        WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
        WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND vendor_po_accepted > 0 ";
        if ($vc != "0") {
            $sql = $sql."AND vendor_po.vendor_po_code = '".$vc."' ";
        }
        $sql = $sql."GROUP BY vendor_po_asin ORDER BY total_cost DESC";
        $result = $this->db->query($sql)->result_array();
        return $result;
    }

    public function getVendorCodes($id) {
        $sql = "SELECT vendor_code_code FROM vendor_code WHERE vendor_code_user_id = '".$id."'";
        $result = $this->db->query($sql)->result_array();
        return $result;
    }

    public function getMostInvoicedProducts($id, $vc, $from, $to) {
        $sql = "SELECT vendor_po_asin, vendor_po_title, SUM(vendor_po_received) AS total_count, SUM(vendor_po_received*vendor_po_unit_cost) AS total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
        WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
        WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND vendor_po_accepted > 0 AND vendor_po_delivery_window_start BETWEEN '".$from."' AND '".$to."' GROUP BY vendor_po_asin ORDER BY total_cost DESC";
        if ($vc != '0') {
            $sql = "SELECT vendor_po_asin, vendor_po_title, SUM(vendor_po_received) AS total_count, SUM(vendor_po_received*vendor_po_unit_cost) AS total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
            WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
            WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND vendor_po.vendor_po_code = '".$vc."' AND vendor_po_accepted > 0 AND vendor_po_delivery_window_start BETWEEN '".$from."' AND '".$to."' GROUP BY vendor_po_asin ORDER BY total_cost DESC";
        }
        $result = $this->db->query($sql)->result_array();
        return $result;
    }

    public function getTotalCosts($id, $vc) {
        $sql = "SELECT SUM(total_cost) AS total_order_cost from (SELECT SUM(vendor_po_submitted*vendor_po_unit_cost) AS total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code
        WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
        WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND (vendor_po_status = 'Closed' OR vendor_po_status = 'Confirmed') AND vendor_po_submitted > 0 ";
        if ($vc != "0") {
            $sql = $sql."AND vendor_po.vendor_po_code = '".$vc."' ";
        }
        $sql = $sql."GROUP BY vendor_po_asin ORDER BY total_cost DESC) temp";
        $result = $this->db->query($sql)->result_array();
        return $result;        
    }

    public function getTotalLostCosts($id, $vc) {
        $sql = "SELECT SUM(total_cost) AS total_lost_cost from (SELECT SUM((vendor_po_submitted-vendor_po_received)*vendor_po_unit_cost) AS total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
        WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
        WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND (vendor_po_status = 'Closed' OR vendor_po_status = 'Confirmed') AND vendor_po_submitted > 0 ";
        if ($vc != "0") {
            $sql = $sql."AND vendor_po.vendor_po_code = '".$vc."' ";
        }
        $sql = $sql."GROUP BY vendor_po_asin ORDER BY total_cost DESC) temp";
        $result = $this->db->query($sql)->result_array();
        return $result;        
    }

    public function getInvoiceLoss($id, $from, $to)
    {
        $sql = "SELECT vendor_po.vendor_po_code AS ven_code, YEAR(vendor_po.vendor_po_delivery_window_start) AS yr, MONTH(vendor_po.vendor_po_delivery_window_start) AS mon, SUM((vendor_po_submitted-vendor_po_received)*vendor_po_unit_cost) AS total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
        WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
        WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND vendor_po.vendor_po_submitted > 0 AND
        vendor_po.vendor_po_delivery_window_start BETWEEN '".$from."' AND '".$to."' GROUP BY ven_code, yr, mon";
        $result = $this->db->query($sql)->result_array();
        return $result;
    }

    public function getMonthlyInvoiceLoss($id, $vc, $day, $month, $year) {
        $sql = "SELECT DAY(vendor_po.vendor_po_delivery_window_start) AS day, SUM((vendor_po_submitted-vendor_po_received)*vendor_po_unit_cost) as total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
        WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
        WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND (vendor_po_status = 'Closed' OR vendor_po_status = 'Confirmed') AND vendor_po_submitted > 0 AND
        YEAR(vendor_po.vendor_po_delivery_window_start) = '".$year."' AND 
        MONTH(vendor_po.vendor_po_delivery_window_start) = '".$month."' AND DAY(vendor_po.vendor_po_delivery_window_start) <= '".$day."' 
        GROUP BY day ORDER BY day";
        if ($vc != '0') {
            $sql = "SELECT DAY(vendor_po.vendor_po_delivery_window_start) AS day, SUM((vendor_po_submitted-vendor_po_received)*vendor_po_unit_cost) as total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
            WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
            WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND vendor_po.vendor_po_code = '".$vc."' AND (vendor_po_status = 'Closed' OR vendor_po_status = 'Confirmed') AND vendor_po_submitted > 0 AND
            YEAR(vendor_po.vendor_po_delivery_window_start) = '".$year."' AND 
            MONTH(vendor_po.vendor_po_delivery_window_start) = '".$month."' AND DAY(vendor_po.vendor_po_delivery_window_start) <= '".$day."' 
            GROUP BY day ORDER BY day";            
        }
        $result = $this->db->query($sql)->result_array();
    	return $result;       
    }

    public function getMostInvoiceLostProducts($id, $vc, $from, $to) {
        $sql = "SELECT vendor_po_asin, vendor_po_title, SUM(vendor_po_submitted-vendor_po_received) AS total_count, SUM((vendor_po_submitted-vendor_po_received)*vendor_po_unit_cost) AS total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
        WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
        WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND (vendor_po_status = 'Closed' OR vendor_po_status = 'Confirmed') AND vendor_po_submitted > 0 AND vendor_po_delivery_window_start BETWEEN '".$from."' AND '".$to."' GROUP BY vendor_po_asin ORDER BY total_cost DESC";
        if ($vc != '0') {
            $sql = "SELECT vendor_po_asin, vendor_po_title, SUM(vendor_po_submitted-vendor_po_received) AS total_count, SUM((vendor_po_submitted-vendor_po_received)*vendor_po_unit_cost) AS total_cost FROM vendor_po, (SELECT vendor_code.vendor_code_code FROM vendor_code 
            WHERE vendor_code.vendor_code_user_id = '".$id."') AS vendor_code_tbl 
            WHERE vendor_code_tbl.vendor_code_code = vendor_po.vendor_po_code AND vendor_po.vendor_po_code = '".$vc."' AND (vendor_po_status = 'Closed' OR vendor_po_status = 'Confirmed') AND vendor_po_submitted > 0 AND vendor_po_delivery_window_start BETWEEN '".$from."' AND '".$to."' GROUP BY vendor_po_asin ORDER BY total_cost DESC";
        }
        $result = $this->db->query($sql)->result_array();
        return $result;
    }
}