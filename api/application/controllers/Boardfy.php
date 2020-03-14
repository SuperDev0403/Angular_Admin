<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Boardfy extends BD_Controller {
    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        $this->auth();
        $this->load->model('M_products');
        $this->load->model('M_competitors');
        $this->load->model('M_vendor_po');
    }
    
    public function getSellerPricingStats_post() {
        $mc = $this->post('mc');
        $date = $this->post('date');
        $result = $this->M_competitors->getSellerPricingStats($date, $mc);
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

	public function getSellerPricing_post() {
        $mc = $this->post('mc');
        $date = $this->post('date');
        $result = $this->M_competitors->getSellerPricing($date, $mc);
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getSellerProductListing_post() {
        $mc = $this->post('mc');
        $date = $this->post('date');
        $seller_id = $this->post('seller_id');
        $result = $this->M_competitors->getSellerProductListing($date, $seller_id, $mc);
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getProductListingStats_post() {
        $mc = $this->post('mc');
        $date = $this->post('date');        
        $previousDate = date('Y-m-d', strtotime('-1 day', strtotime($date)));
        $result = $this->M_competitors->getProductListingStats($previousDate, $date, $mc);
        
        $newResult = [];
        for($i = 0; $i < count($result); $i++) {
            if ($result[$i]['date'] == $date) {
                $row = $result[$i];
                $row['available'] = true;
                array_push($newResult, $row);
            } else {
                $flag = false;
                for($j = 0; $j < count($result); $j++) {
                    if ($i == $j) continue;
                    if ($result[$i]['ean'] == $result[$j]['ean']) {
                        $flag = true;
                        break;
                    }
                }
                if(!$flag) {
                    $row = $result[$i];
                    $row['available'] = false;
                    array_push($newResult, $row);
                }
            }
        }
        $message = [
            'status' => true,
            'result' => $newResult
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getProductListing_post() {
        $mc = $this->post('mc');
        $date = $this->post('date');        
        $previousDate = date('Y-m-d', strtotime('-1 day', strtotime($date)));
        $result = $this->M_competitors->getProductListing($previousDate, $date, $mc);
        $newResult = [];
        for($i = 0; $i < count($result); $i++) {
            if ($result[$i]['date'] == $date) {
                $row = $result[$i];
                $row['available'] = true;
                array_push($newResult, $row);
            } else {
                $flag = false;
                for($j = 0; $j < count($result); $j++) {
                    if ($i == $j) continue;
                    if ($result[$i]['ean'] == $result[$j]['ean']) {
                        $flag = true;
                        break;
                    }
                }
                if(!$flag) {
                    $row = $result[$i];
                    $row['available'] = false;
                    array_push($newResult, $row);
                }
            }
        }
        $message = [
            'status' => true,
            'result' => $newResult
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getSellerProductComparison_post() {
        $mc = $this->post('mc');
        $date = $this->post('date');
        $ean = $this->post('ean');
        $result = $this->M_competitors->getSellerProductComparison($date, $mc, $ean);
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getAllProductsAndSellersStats_post() {
        $mc = $this->post('mc');
        $date = $this->post('date');
        $result = $this->M_competitors->getAllProductsAndSellersStats($date, $mc);
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getAllProductsAndSellers_post() {
        $mc = $this->post('mc');
        $date = $this->post('date');
        $result = $this->M_competitors->getAllProductsAndSellers($date, $mc);
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getDatesales_post() {
        $id = $this->post('id');
        $date = $this->post('date');
        
        $dateValue1 = date("Y-m-d", strtotime($date));
        $dateValue2 = date("Y-m-d", strtotime($date.'-29 days'));      
        $res1 = $this->M_vendor_po->getMonthtodatesales($id, $dateValue2, $dateValue1);

        $dateValue3 = date("Y-m-d", strtotime($date.'-30 days'));
        $dateValue4 = date("Y-m-d", strtotime($date.'-59 days'));  
        $res2 = $this->M_vendor_po->getMonthtodatesales($id, $dateValue4, $dateValue3);

        $date1 = strtotime($dateValue1.'-1 year');
        $dateValue5 = date("Y-m-d", $date1);
        $dateValue6 = date("Y-m-d", strtotime($dateValue5.'-29 days'));      
        $res3 = $this->M_vendor_po->getMonthtodatesales($id, $dateValue6, $dateValue5);
        
        $to_yr = date("Y-m-d", strtotime($date));
        $yr = date("Y", strtotime($date));
        $from_yr = $yr.'-01-01';
        $res_year1 = $this->M_vendor_po->getYeartodatesales($id, $from_yr, $yr.'-12-31');
        $to_yr = date("Y-m-d", $date1);
        $yr = date("Y", $date1);
        $from_yr = $yr.'-01-01';
        $res_year2 = $this->M_vendor_po->getYeartodatesales($id, $from_yr, $yr.'-12-31');
        $result = [
            'this_month' => $res1,
            'last_month' => $res2,
            'last_year' => $res3,
            'this_year_sales' => $res_year1,
            'last_year_sales' => $res_year2
        ];
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getVendorCodes_post() {
        $id = $this->post('id');
        $result = $this->M_vendor_po->getVendorCodes($id);

        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getKeyFifures_post() {
        $id = $this->post('id');
        $vc = $this->post('vc');
        $res = $this->M_vendor_po->getKeyFifures($id, $vc);
        $total_num_products = count($res);
        $total_costs = 0;
        for ($i = 0; $i < $total_num_products; $i++) {
            $total_costs += $res[$i]['total_cost'];
        }
        $perc_cost = 0;
        $i = 0;
        while($perc_cost < 0.8) {
            $perc_cost += (float)$res[$i]['total_cost'] / $total_costs;
            $i++;
        }
        
        $result = [
            'total_num_products' => $total_num_products,
            'num_products_eighty' => $i
        ];
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getInvoiceEvolution_post() {
        $id = $this->post('id');
        $vc = $this->post('vc');
        $from = $this->post('frommonth');
        $fromValue = strtotime($from);                     
        $from_yr = date("Y", $fromValue); 
        $from_mon = date("m", $fromValue);
        $from_day = date("d", $fromValue);

        $to = $this->post('tomonth');
        $toValue = strtotime($to);                     
        $to_yr = date("Y", $toValue); 
        $to_mon = date("m", $toValue);
        $to_day = date("d", $toValue);
        
        $res = $this->M_vendor_po->getInvoiceEvolution($id, $from_yr.'-'.$from_mon.'-01', $to_yr.'-'.$to_mon.'-31');

        $message = [
            'status' => true,
            'result' => $res
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getMostInvoicedProducts_post() {
        $id = $this->post('id');
        $vc = $this->post('vc');
        $from = $this->post('frommonth');
        $to = $this->post('tomonth');
        $result = $this->M_vendor_po->getMostInvoicedProducts($id, $vc, $from, $to);
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getKeyRejFigures_post() {
        $id = $this->post('id');
        $vc = $this->post('vc');
        $res = $this->M_vendor_po->getTotalCosts($id, $vc);
        $total_order_cost = $res[0]['total_order_cost'];
        $res2 = $this->M_vendor_po->getTotalLostCosts($id, $vc);
        $total_lost_cost = $res2[0]['total_lost_cost'];
        
        $total_lost_percent = $total_lost_cost / $total_order_cost * 100;
        $result = [
            'total_lost_cost' => $total_lost_cost,
            'total_lost_percent' => $total_lost_percent,
        ];
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);        
    }

    public function getMonthlyInvoiceLoss_post() {
        $id = $this->post('id');
        $vc = $this->post('vc');
        $from = $this->post('frommonth');
        $fromValue = strtotime($from);                     
        $from_yr = date("Y", $fromValue); 
        $from_mon = date("m", $fromValue);
        $from_day = date("d", $fromValue);

        $to = $this->post('tomonth');
        $toValue = strtotime($to);                     
        $to_yr = date("Y", $toValue); 
        $to_mon = date("m", $toValue);
        $to_day = date("d", $toValue);
        
        $res = $this->M_vendor_po->getInvoiceLoss($id, $from_yr.'-'.$from_mon.'-01', $to_yr.'-'.$to_mon.'-31');

        $message = [
            'status' => true,
            'result' => $res
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }    

    public function getMostInvoiceLostProducts_post() {
        $id = $this->post('id');
        $vc = $this->post('vc');
        $from = $this->post('frommonth');
        $to = $this->post('tomonth');
        $result = $this->M_vendor_po->getMostInvoiceLostProducts($id, $vc, $from, $to);
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }
}
