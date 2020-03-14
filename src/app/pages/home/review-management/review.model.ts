export interface Reviews {
    product_review_id: number;
    product_review_amazon_id: string;
    product_review_asin: string;
    product_review_marketplace_id: number;
    marketplace_code: string;
    product_review_title: string;
    product_review_body: string;
    product_review_rating: number;
    product_review_date: string;
    product_review_link: string;
    product_review_profile_name: string;
    product_module_id: number;
    product_module_image_thumbnail: string;
    product_client_id: number;
    client_name: string;
    product_review_status_id: number;
    product_review_status_user_id: number;
    product_review_status_type_id: number;
    product_review_status_type_name: string;
}

export interface Notes {
    product_review_note_id: number;
    product_review_amazon_id: string;
    product_review_user_id: number;
    product_review_datetime_created: string;
    product_review_note: string;
}

// Search Data
export interface SearchResult {
    tables: Reviews[];
    total: number;
}