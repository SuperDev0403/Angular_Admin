<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Product extends BD_Controller {
    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        $this->auth();
        $this->load->model('M_client_module');
        $this->load->model('M_product_module');
        $this->load->model('M_product');
        $this->load->model('M_product_review');
        $this->load->model('M_product_review_notes');
    }

    public function getAsinListing_get() {
        $clients = $this->M_client_module->get_client_names();
        $asins = $this->M_product_module->get_product_asins();
        $marketplaces = $this->M_client_module->get_marketplace_codes();
        $output['asins'] = $asins;
        $output['clients'] = $clients;
        $output['marketplaces'] = $marketplaces;
        $this->set_response($output, REST_Controller::HTTP_OK);
    }

    public function addAsin_post() {
        $input_data = array(
            "product_module_marketplace_id" => $this->post('product_module_marketplace_id'),
            "product_module_is_review" => $this->post('product_module_is_review'),
            "product_module_is_price" => $this->post('product_module_is_price'),
            "product_module_price_msrp" => $this->post('product_module_price_msrp'),
            "product_module_price_base" => $this->post('product_module_price_base')            
        );
        $product_module_product_id = $this->M_product->get_id(array("product_client_id" => $this->post('product_client_id'), "product_asin" => $this->post('product_asin')));
        $input_data["product_module_product_id"] = $product_module_product_id;
        $output = $this->M_product_module->add_module($input_data);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "success"
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }
    
    public function editAsin_post() {
        $product_module_id = $this->post('product_module_id');
        
        $input_data = array(
            "product_module_product_id" => $this->post('product_module_product_id'),
            "product_module_marketplace_id" => $this->post('product_module_marketplace_id'),
            "product_module_is_review" => $this->post('product_module_is_review'),
            "product_module_is_price" => $this->post('product_module_is_price'),
            "product_module_price_msrp" => $this->post('product_module_price_msrp'),
            "product_module_price_base" => $this->post('product_module_price_base')            
        );
        $output = $this->M_product_module->edit_module($product_module_id, $input_data);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "success"
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }

    public function deleteAsin_post() {
        $id = $this->post('product_module_id');
        $output = $this->M_product_module->delete_module($id);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "success"
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
       }
    }

    public function uploadfile_post() {
        $csv = $_FILES['file']['tmp_name'];

        $handle = fopen($csv,"r");
        $i = 0;
        while (($row = fgetcsv($handle, 10000, ",")) != FALSE) //get row vales
        {
            $i++;
            if ($i == 1)
                continue;
            $input_data = array(
                "product_module_marketplace_id" => $row[2],
                "product_module_price_base" => $row[3],
                "product_module_price_msrp" => $row[4],
                "product_module_is_review" => $row[5],
                "product_module_is_price" => $row[6],
                "product_module_is_content" => $row[7] 
            );
            $product_module_product_id = $this->M_product->get_id(array("product_client_id" => $row[1], "product_asin" => $row[0]));
            $input_data["product_module_product_id"] = $product_module_product_id;
            $output = $this->M_product_module->add_module($input_data);
        }
        $clients = $this->M_client_module->get_client_names();
        $asins = $this->M_product_module->get_product_asins();
        $marketplaces = $this->M_client_module->get_marketplace_codes();
        $output = [
            'status' => true,
            'message' => "success"
        ];
        $output['asins'] = $asins;
        $output['clients'] = $clients;
        $output['marketplaces'] = $marketplaces;
        $this->set_response($output, REST_Controller::HTTP_OK);
    }

    public function getReviews_get() {
        $reviews = $this->M_product_review->get_product_reviews();
        $statuses = $this->M_product_review->get_reviews_status();
        $clients = $this->M_client_module->get_client_names();
        $marketplaces = $this->M_client_module->get_marketplace_codes();
        $notes = $this->M_product_review_notes->get_notes_list();

        $output = [
            'status' => true,
            'message' => "success"
        ];
        $output['reviews'] = $reviews;
        $output['statuses'] = $statuses;
        $output['clients'] = $clients;
        $output['marketplaces'] = $marketplaces;
        $output['notes'] = $notes;
        $this->set_response($output, REST_Controller::HTTP_OK);
    }

    public function addNote_post() {
        $input_data = array(
            'product_review_id' => $this->post('product_review_id'),
            'product_review_user_id' => $this->post('product_review_user_id'),
            'product_review_note' => $this->post('product_review_note'),
            'product_review_datetime_created' => date("Y-m-d H:i:s")
        );
        $output = $this->M_product_review_notes->insert_note($input_data);
        if ($output)
        {
            $message = [
                'status' => true,
                'message' => "success"
            ];
           $this->response($message, REST_Controller::HTTP_OK);
        } else
        {
            $message = [
                'status' => FALSE,
                'message' => "Something went wrong. Please try again later."
            ];
            $this->response($message, REST_Controller::HTTP_NOT_FOUND);
        }
    }
}