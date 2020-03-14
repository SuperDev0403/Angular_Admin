<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Brand extends BD_Controller {
    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        // $this->auth();
        $this->load->model('M_client_module');
        $this->load->model('M_product_module');
        $this->load->model('M_product');
        $this->load->model('M_product_review');
        $this->load->model('M_product_review_notes');
    }

    public function getGolbalReputation_post() {
        $from = $this->post('from');
        $to = $this->post('to');
        $marketplace_id = $this->post('marketplace_id');
        $product_client_id = $this->post('product_client_id');
        $result = $this->M_product_review->get_globalReputation($from, $to, $marketplace_id, $product_client_id);
        $message = [
            'status' => true,
            'result' => $result
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }

    public function getReputation_post() {
        $marketplace_id = $this->post('marketplace_id');
        $product_client_id = $this->post('product_client_id');
        
        $to = date("Y-m-d");
        $from = date('Y-m-d', strtotime('-30 day', strtotime($to)));
        $previous = date('Y-m-d', strtotime('-60 day', strtotime($to)));

        $global_reputation = $this->M_product_review->get_globalReputation('2010-01-01', $to, $marketplace_id, $product_client_id);

        $total_review_num = $this->M_product_review->get_totalNumofReviews($marketplace_id, $product_client_id);
        $review_num = $this->M_product_review->get_NumofReviews($from, $to, $marketplace_id, $product_client_id);
        $seller_reputation = $this->M_product_review->get_sellerReputation($marketplace_id, $product_client_id, $to);

        $positive_num = $this->M_product_review->get_productRating($from, $to, $marketplace_id, $product_client_id, 4, 5);
        $positive_pre_num = $this->M_product_review->get_productRating($previous, $from, $marketplace_id, $product_client_id, 4, 5);
        $neutral_num = $this->M_product_review->get_productRating($from, $to, $marketplace_id, $product_client_id, 3, 3);
        $neutral_pre_num = $this->M_product_review->get_productRating($previous, $from, $marketplace_id, $product_client_id, 3, 3);
        $negative_num = $this->M_product_review->get_productRating($from, $to, $marketplace_id, $product_client_id, 1, 2);
        $negative_pre_num = $this->M_product_review->get_productRating($previous, $from, $marketplace_id, $product_client_id, 1, 2);
        $product_rating = array(
            'positive_num' => $positive_num,
            'positive_pre_num' => $positive_pre_num,
            'neutral_num' => $neutral_num,
            'neutral_pre_num' => $neutral_pre_num,
            'negative_num' => $negative_num,
            'negative_pre_num' => $negative_pre_num
        );

        $star_rating = array();
        $yr = date("Y", strtotime($to)); 
        $mon = date("m", strtotime($to)); 
        for ($i = 1; $i <= $mon; $i++)
        {
            if ($i == $mon)
            {
                $res = $this->M_product_review->get_starRating($to, $marketplace_id, $product_client_id);
                array_push($star_rating, $res);
            }else {
                $res = $this->M_product_review->get_starRating($yr.'-'.$i.'-29', $marketplace_id, $product_client_id);
                array_push($star_rating, $res);
            }
        }
        
        $product_reputation = $this->M_product_review->get_productReputation($marketplace_id, $product_client_id);

        $seller_rating_reputation_1 = $this->M_product_review->get_sellerRatingReputation($marketplace_id, $product_client_id, 0, 21, $to);
        $seller_rating_reputation_2 = $this->M_product_review->get_sellerRatingReputation($marketplace_id, $product_client_id, 21, 41, $to);
        $seller_rating_reputation_3 = $this->M_product_review->get_sellerRatingReputation($marketplace_id, $product_client_id, 41, 61, $to);
        $seller_rating_reputation_4 = $this->M_product_review->get_sellerRatingReputation($marketplace_id, $product_client_id, 61, 81, $to);
        $seller_rating_reputation_5 = $this->M_product_review->get_sellerRatingReputation($marketplace_id, $product_client_id, 81, 101, $to);
        $seller_rating_reputation = array(
            $seller_rating_reputation_1, $seller_rating_reputation_2, $seller_rating_reputation_3, $seller_rating_reputation_4, $seller_rating_reputation_5
        );
        $product_num = $this->M_product_review->get_productNum($marketplace_id, $product_client_id); 
        $seller_num = $this->M_product_review->get_sellerNum($marketplace_id, $product_client_id);
        $message = [
            'status' => true,
            'global_reputation' => $global_reputation,
            'total_review_num' => $total_review_num,
            'review_num' => $review_num,
            'seller_reputation' => $seller_reputation,
            'product_num' => $product_num,
            'seller_num' => $seller_num,
            'product_rating' => $product_rating,
            'star_rating' => $star_rating,
            'product_reputation' => $product_reputation,
            'seller_rating_reputation' => $seller_rating_reputation
        ];
        $this->response($message, REST_Controller::HTTP_OK);
    }
}