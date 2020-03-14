<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Cron extends BD_Controller {
    function __construct()
    {
        parent::__construct();

        $this->MAX_REQUEST = 14998;
        $this->MAX_REQUEST_PER_CALL = 998;
        $this->api_key = 'C3E4281AAC5D4FB6B395D8B01855B8DD';

        $this->load->model('M_users');
        $this->load->model('M_products');
        $this->load->model('M_competitors');
        $this->load->model('M_collection');
        $this->load->model('M_product_module');
        $this->load->model('M_product_review_rating');
        $this->load->model('M_product_review');
        $this->load->model('M_product_offer_seller');
        $this->load->model('M_product_offer');
        $this->load->model('M_product_offer_seller_rating');
    }
    
    public function webhook_post()
    {
        $input_data = json_decode($this->input->raw_input_stream, true);
        foreach ($input_data['result_set']['download_links']['json']['pages'] as $download_link)
        {
            $data = file_get_contents($download_link);
            $json = json_decode($data);
            
            foreach( $json as $req ){
                
                if (!$req->success)
                    continue;
                
                if ($req->request->type == "reviews")
                {
                    $request_id = $req->id;
                    $asin = $req->request->asin;
                    $marketplace_id = $this->M_product_module->get_marketplace_id_from_review($request_id);
                    if(!$marketplace_id)
                        continue;
                    $summary = $req->result->summary;
                    $ratings_total = 0;
                    if (property_exists($summary, "ratings_total"))
                    {
                        $ratings_total = strval($summary->ratings_total);
                        $ratings_total = str_replace('.', '', $ratings_total);
                        $ratings_total = str_replace(',', '', $ratings_total);
                    }
                    $reviews_total = 0;
                    if (property_exists($summary, "reviews_total"))
                    {
                        $reviews_total = strval($summary->reviews_total);
                        $reviews_total = str_replace('.', '', $reviews_total);
                        $reviews_total = str_replace(',', '', $reviews_total);
                    }
                    $five_star_pct = 0;
                    $five_star_cnt = 0;
                    $four_star_pct = 0;
                    $four_star_cnt = 0;
                    $three_star_pct = 0;
                    $three_star_cnt = 0;
                    $two_star_pct = 0;
                    $two_star_cnt = 0;
                    $one_star_pct = 0;
                    $one_star_cnt = 0;
                    if (property_exists($summary, "rating_breakdown"))
                    {
                        $five_star_pct = $summary->rating_breakdown->five_star->percentage;
                        $five_star_cnt = strval($summary->rating_breakdown->five_star->count);
                        $five_star_cnt = str_replace('.', '', $five_star_cnt);
                        $five_star_cnt = str_replace(',', '', $five_star_cnt);
                        $four_star_pct = $summary->rating_breakdown->four_star->percentage;
                        $four_star_cnt = strval($summary->rating_breakdown->four_star->count);
                        $four_star_cnt = str_replace('.', '', $four_star_cnt);
                        $four_star_cnt = str_replace(',', '', $four_star_cnt);
                        $three_star_pct = $summary->rating_breakdown->three_star->percentage;
                        $three_star_cnt = strval($summary->rating_breakdown->three_star->count);
                        $three_star_cnt = str_replace('.', '', $three_star_cnt);
                        $three_star_cnt = str_replace(',', '', $three_star_cnt);
                        $two_star_pct = $summary->rating_breakdown->two_star->percentage;
                        $two_star_cnt = strval($summary->rating_breakdown->two_star->count);
                        $two_star_cnt = str_replace('.', '', $two_star_cnt);
                        $two_star_cnt = str_replace(',', '', $two_star_cnt);
                        $one_star_pct = $summary->rating_breakdown->one_star->percentage;
                        $one_star_cnt = strval($summary->rating_breakdown->one_star->count);
                        $one_star_cnt = str_replace('.', '', $one_star_cnt);
                        $one_star_cnt = str_replace(',', '', $one_star_cnt);
                    }
                    $reviews_positive = 0;
                    if (property_exists($summary, 'reviews_positive'))
                    {
                        $reviews_positive = strval($summary->reviews_positive);
                        $reviews_positive = str_replace('.', '', $reviews_positive);
                        $reviews_positive = str_replace(',', '', $reviews_positive);
                    }
                    $reviews_critical = 0;
                    if (property_exists($summary, 'reviews_critical'))
                    {
                        $reviews_critical = strval($summary->reviews_critical);
                        $reviews_critical = str_replace('.', '', $reviews_critical);
                        $reviews_critical = str_replace(',', '', $reviews_critical);
                    }
    
                    $data = array(
                        'product_review_rating_asin' => $asin, 'product_review_rating_marketplace_id' => $marketplace_id, 
                        'product_review_rating_summary_ratings_total' => $ratings_total, 'product_review_rating_summary_reviews_total' => $reviews_total, 
                        'product_review_rating_summary_rating_5_stars_pct' => $five_star_pct, 'product_review_rating_summary_rating_5_stars_count' => $five_star_cnt,
                        'product_review_rating_summary_rating_4_stars_pct' => $four_star_pct, 'product_review_rating_summary_rating_4_stars_count' => $four_star_cnt,
                        'product_review_rating_summary_rating_3_stars_pct' => $three_star_pct, 'product_review_rating_summary_rating_3_stars_count' => $three_star_cnt,
                        'product_review_rating_summary_rating_2_stars_pct' => $two_star_pct, 'product_review_rating_summary_rating_2_stars_count' => $two_star_cnt,
                        'product_review_rating_summary_rating_1_stars_pct' => $one_star_pct, 'product_review_rating_summary_rating_1_stars_count' => $one_star_cnt,
                        'product_review_rating_datetime' => date("Y-m-d"), 
                        'product_review_rating_reviews_positive' => $reviews_positive, 'product_review_rating_reviews_critical' => $reviews_critical
                    );
                    $this->M_product_review_rating->insert($data);
    
                    foreach ($req->result->reviews as $review)
                    {
                        $amazon_id = $review->id;
                        $title = "";
                        if (property_exists($review, 'title'))
                            $title = $review->title;
                        $body = "";
                        if (property_exists($review, 'body'))
                            $body = $review->body;
                        $rating = 0;
                        if (property_exists($review, 'rating'))
                            $rating = $review->rating;
                        $review_date = "";
                        if (property_exists($review, 'date'))
                            $review_date = $review->date->utc;
                        $link = "";
                        if (property_exists($review, 'link'))
                            $link = $review->link;
                        $profile_name = "";
                        $profile_link = "";
                        if (property_exists($review, 'profile'))
                        {
                            if (property_exists($review->profile, 'name'))
                                $profile_name = $review->profile->name;
                            if (property_exists($review->profile, 'link'))
                                $profile_link = $review->profile->link;
                        }
                        $verified_purchase = 0;
                        if (property_exists($review, 'verified_purchase'))
                            $verified_purchase = $review->verified_purchase;
                        $helpful_votes = 0;
                        if (property_exists($review, 'helpful_votes'))
                            $helpful_votes = $review->helpful_votes;
    
                        $review_data = array(
                            'product_review_amazon_id' => $amazon_id, 'product_review_asin' => $asin, 'product_review_marketplace_id' => $marketplace_id,
                            'product_review_title' => $title, 'product_review_body' => $body, 'product_review_rating' => $rating,
                            'product_review_date' => $review_date, 'product_review_link' => $link, 'product_review_profile_name' => $profile_name,
                            'product_review_profile_link' => $profile_link, 'product_review_verified_purchase' => $verified_purchase,
                            'product_review_helpful_votes' => $helpful_votes, 'product_review_datetime' => date("Y-m-d")
                        );
                        if (property_exists($review, 'attributes'))
                        {
                            $i = 1;
                            foreach ($review->attributes as $attribute)
                            {
                                $attribute_name = 'product_review_attribute_'.$i;
                                $review_data[$attribute_name] = $attribute->value;
                                $i++;
                            }
                        }
    
                        $this->M_product_review->insert($review_data);
                    }
    
                } else if ($req->request->type == "offers")
                {
                    $request_id = $req->id;
                    $asin = $req->request->asin;
                    $marketplace_id = $this->M_product_module->get_marketplace_id_from_offer($request_id);
                    if(!$marketplace_id)
                        continue;
                    foreach ($req->result->offers as $offer)
                    {
                        if (!property_exists($offer->seller, 'id') || !property_exists($offer->seller, 'name'))
                            continue;
    
                        $amazon_id = $offer->seller->id;
                        $seller_name = $offer->seller->name;
                        $offer_seller_id = $this->M_product_offer_seller->insert(array('product_offer_seller_amazon_id' => $amazon_id, 'product_offer_seller_name' => $seller_name));
                        
                        $offer_price = 0;
                        $offer_currency = "";
                        if (property_exists($offer, "price"))
                        {
                            $offer_price = $offer->price->value;
                            $offer_currency = $offer->price->currency;
                        }
                        $condition_is_new = 0;
                        $condition_title = "";
                        if (property_exists($offer, "condition"))
                        {
                            $condition_is_new = $offer->condition->is_new;
                            $condition_title = $offer->condition->title;
                        }
                        $delivery_fba = 0;
                        $delivery_sfoc = 0;
                        $delivery_price = 0;
                        $delivery_price_currency = "";
                        if (property_exists($offer, "delivery"))
                        {
                            if (property_exists($offer->delivery, "fulfilled_by_amazon"))
                                $delivery_fba = $offer->delivery->fulfilled_by_amazon;
                            if (property_exists($offer->delivery, "shipped_from_outside_country"))
                                $delivery_sfoc = $offer->delivery->shipped_from_outside_country;
                            if (property_exists($offer->delivery, "price"))
                            {
                                $delivery_price = $offer->delivery->price->value;
                                $delivery_price_currency = $offer->delivery->price->currency;
                            }
                        }
                        $delivery_is_prime = 0;
                        if (property_exists($offer, "is_prime"))
                            $delivery_is_prime = $offer->is_prime;
    
                        $offer_data = array(
                            'product_offer_asin' => $asin, 'product_offer_seller_amazon_id' => $amazon_id, 'product_offer_marketplace_id' => $marketplace_id,
                            'product_offer_price' => $offer_price, 'product_offer_currency' => $offer_currency, 'product_offer_condition_is_new' => $condition_is_new,
                            'product_offer_condition_title' => $condition_title, 'product_offer_delivery_fba' => $delivery_fba, 
                            'product_offer_delivery_shipped_from_outside_country' => $delivery_sfoc, 'product_offer_delivery_price' => $delivery_price,
                            'product_offer_delivery_price_currency' => $delivery_price_currency, 'product_offer_delivery_is_prime' => $delivery_is_prime,
                            'product_offer_date' => date("Y-m-d")
                        );
    
                        $this->M_product_offer->insert($offer_data);
    
                        $seller_link = "";
                        if (property_exists($offer->seller, 'link'))
                            $seller_link = $offer->seller->link;
                        $seller_rating = 0;
                        if (property_exists($offer->seller, 'rating'))
                        {
                            $seller_rating = $offer->seller->rating;
                        }    
                        $seller_rpp = 0;
                        if (property_exists($offer->seller, 'ratings_percentage_positive'))
                        {
                            $seller_rpp = strval($offer->seller->ratings_percentage_positive);
                            $seller_rpp = str_replace('.', '', $seller_rpp);
                            $seller_rpp = str_replace(',', '', $seller_rpp);
                        }
                        $seller_ratings_total = 0;
                        if (property_exists($offer->seller, 'ratings_total'))
                        {
                            $seller_ratings_total = strval($offer->seller->ratings_total);
                            $seller_ratings_total = str_replace('.', '', $seller_ratings_total);
                            $seller_ratings_total = str_replace(',', '', $seller_ratings_total);
                        }
    
                        $seller_data = array(
                            'product_offer_seller_rating_amazon_id' => $amazon_id, 'product_offer_seller_rating_marketplace_id' => $marketplace_id,
                            'product_offer_seller_rating_link' => $seller_link, 'product_offer_seller_rating_percentage_positive' => $seller_rpp,
                            'product_offer_seller_rating_ratings_total' => $seller_ratings_total, 'product_offer_seller_rating_rating' => $seller_rating,
                            'product_offer_seller_rating_date' => date("Y-m-d")
                        );
                        $this->M_product_offer_seller_rating->insert($seller_data);
                    }
                }
            }
        }    
    }

    public function createRequests_get()
    {
        $current_collection = $this->get_current_collection();
        $products = $this->M_product_module->get_product_modules_without_request();

        while (count($products) > 0)
        {
            $requests = array();
            foreach ($products as $product)
            {
                if (count($requests) >= $this->MAX_REQUEST_PER_CALL || count($requests) >= $current_collection['remain_count'])
                {
                    break;
                }
                if ($product['product_module_is_review'])
                {
                    array_push($requests, [
                        "type" => "reviews",
                        "amazon_domain" => $product['marketplace_domain'],
                        "asin" => $product['product_asin'],
                        "custom_id" => 'reviews'.$product['product_module_id']
                      ]);

                    array_push($requests, [
                        "type" => "offers",
                        "amazon_domain" => $product['marketplace_domain'],
                        "asin" => $product['product_asin'],
                        "custom_id" => 'offers'.$product['product_module_id']
                      ]); 
                }
                else if ($product['product_module_is_price'])
                {
                    array_push($requests, [
                        "type" => "offers",
                        "amazon_domain" => $product['marketplace_domain'],
                        "asin" => $product['product_asin'],
                        "custom_id" => 'offers'.$product['product_module_id']
                      ]);               
                }
            }
    
            $body = [ "requests" => $requests];
              
            $ch = curl_init('https://api.rainforestapi.com/collections/'.$current_collection['collection_id'].'?api_key='.$this->api_key);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
            
            $json = curl_exec($ch);
            curl_close($ch);
            
            $put_requests_result = json_decode($json, true);
            $requests_page_count = $put_requests_result['collection']['requests_page_count'];

            // Get requests list
            for ($page_num = 1; $page_num <= $requests_page_count; $page_num++)
            {
                $queryString = http_build_query([
                    'api_key' => $this->api_key,
                ]);
                
                $ch = curl_init(sprintf('%s?%s', 'https://api.rainforestapi.com/collections/'.$current_collection['collection_id'].'/requests/'.$page_num, $queryString));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
                $json = curl_exec($ch);
                curl_close($ch);
                
                $requests_info = json_decode($json, true);
                
                foreach ($requests_info['requests'] as $info)
                {
                    foreach ($products as $product)
                    {
                        if ($info['custom_id'] == 'reviews'.$product['product_module_id'])
                        {
                            $this->M_product_module->insert_review_request($product['product_module_id'], $info['id'], $current_collection['id']);
                        }
                        if ($info['custom_id'] == 'offers'.$product['product_module_id'])
                        {
                            $this->M_product_module->insert_offer_request($product['product_module_id'], $info['id'], $current_collection['id']);
                        }
                    }
                }
            }
            
            $current_collection = $this->get_current_collection();
            $products = $this->M_product_module->get_product_modules_without_request();
        }
    }

    function create_collection($collectionid)
    {
        $body = http_build_query([
            "name" => "Collection".$collectionid,
            "enabled" => True,
            "schedule_type" => "daily",
            "schedule_hours" => "0",
            "notification_email" => "ad1583258@gmail.com",
            "notification_as_json" => True,
            "notification_webhook" => "http://dev-vendor.azzgency.com/api/cron/webhook"
          ]);
          
        $ch = curl_init('https://api.rainforestapi.com/collections?api_key='.$this->api_key);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        
        $json = curl_exec($ch);
        
        curl_close($ch);
        
        $api_result = json_decode($json, true);
        
        $collection_id = $api_result['collection']['id'];
        $collectionid = $this->M_collection->insert_collection($collection_id);
        
        return array('id' => $collectionid, 'collection_id' => $collection_id);
    }

    function get_current_collection()
    {
        $current_collection = array();
        $collections = $this->M_collection->collections_list();
        
        $remain_count = 0;
        foreach ($collections as $collection)
        {
            $request_count = $this->M_product_module->get_product_modules_num_by_collectionid($collection['id']);
            if ($request_count < $this->MAX_REQUEST)
            {
                $current_collection = $collection;
                $remain_count = $this->MAX_REQUEST - $request_count;
                break;
            }
        }
        $last_collectionid = 0;
        foreach ($collections as $collection)
        {
            $last_collectionid = $collection['id'];
        }
        if (empty($current_collection))
        {
            // Create new collection
            $current_collection = $this->create_collection($last_collectionid + 1);
        }

        $current_collection['remain_count'] = $remain_count;

        return $current_collection;
    }

	public function start_get()
	{
        date_default_timezone_set('Europe/Madrid');
        $date = date('Y-m-d', time());
        $previousDate = date('Y-m-d', strtotime('-1 day', strtotime($date)));
        $this->removePreviousData($previousDate);
        $clients = $this->M_users->getClients();
        for($i = 0; $i < count($clients); $i++) {
            $client = $clients[$i];
            //check if need to pull
            $need = $this->M_products->getTodayData($date, $client->mc);
            if(count($need) == 0) {
                $platform_data = $this->get_platform($client->mc, $client->key, $client->skey);
                $product_data = $this->get_boardfyData($client->mc, $client->key, $client->skey);
                if($product_data) {
                    for($j = 0; $j < count($product_data); $j++) {
                        $product = $product_data[$j];
                        $input_data = array(
                            "cAsin" => $product->cAsin,
                            "rating" => $product->rating,
                            "nombre_categ" => $product->nombre_categ,
                            "totalProd" => $product->totalProd,
                            "ean" => $product->ean,
                            "productName" => $product->productName,
                            "brand" => $product->brand,
                            "msrp" => $product->msrp,
                            "photoUri" => $product->photoUri,
                            "date" => $date,
                            "mc" => $client->mc,
                            "platform" => $platform_data['platform'],
                            "country" => $platform_data['country']
                        );
                        //insert into product table
                        $insert_id = $this->M_products->insert($input_data);
                        if($insert_id > 0) {
                            //insert into competitors table
                            for($k = 0; $k < count($product->competitors); $k++) {
                                $competitor = $product->competitors[$k];
                                $input_data = array(
                                    "seller_id" => $competitor->id,
                                    "name" => $competitor->name,
                                    "price" => $competitor->price,
                                    "yesterdayPrice" => $competitor->yesterdayPrice,
                                    "lastUpdate" => $competitor->lastUpdate,
                                    "producttb_id" => $insert_id
                                );
                                $this->M_competitors->insert($input_data);
                            }
                        }
                    }
                }    
            }
            
        }
        $message = [
            'status' => true
        ];
       $this->response($message, REST_Controller::HTTP_OK);
	}

    function removePreviousData($previousDate) {
        $result = $this->M_competitors->removePreviousData($previousDate);
        return;
    }

    function get_boardfyData($mc, $key, $skey, $op = 'radar') {
        $url = "https://brand.boardfy.com/api.php?key=$key&skey=$skey&mc=$mc&op=$op";
        $content = @file_get_contents($url);
        if(!$content) {
            return null;
        }
        $response = json_decode($content);        
        $totalPages = $response->metadata->totalPages;
        $products = $response->products;
        for($i = 2; $i <= $totalPages; $i++) {
            $url = "https://brand.boardfy.com/api.php?key=$key&skey=$skey&mc=$mc&op=$op&page=$i";
            $content = @file_get_contents($url);
            if($content){
                $data = json_decode($content);
                $products = array_merge($products, $data->products);
            }
        }
        return $products;
    }

    function get_platform($mc, $key, $skey, $op = 'radar') {
        $url = "https://brand.boardfy.com/api.php?key=$key&skey=$skey&mc=$mc&op=$op";
        $content = @file_get_contents($url);
        if(!$content) {
            return null;
        }
        $response = json_decode($content);        
        $plataform = $response->metadata->plataform;
        $split = explode('_', $plataform);
        $platform = $split[0];
        $country = $split[1];
        return array('platform' => $platform, 'country' => $country);
    }

}
