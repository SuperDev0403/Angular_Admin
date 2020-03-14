export interface Asins {
    product_module_id: number;
    product_module_product_id: number;
    client_id: number;
    client_name: string;
    product_asin: string;
    product_module_marketplace_id: number;
    marketplace_code: string;
    product_module_is_review: boolean;
    product_module_is_content: boolean;
    product_module_is_price: boolean;
    product_module_is_answers: boolean;
    product_module_is_po: boolean;
    product_module_price_msrp: number;
    product_module_price_base: number;
}

// Search Data
export interface SearchResult {
    tables: Asins[];
    total: number;
}
