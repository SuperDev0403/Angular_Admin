export interface Client_module {
    client_module_id: number;
    client_module_client_id: number;
    client_module_marketplace_id: number;
    client_module_is_review: boolean; 
    client_module_is_content: boolean;
    client_module_is_price: boolean;
    client_module_is_answers: boolean;
    client_module_is_po: boolean;
    client_module_is_active: boolean;
    client_name: string;
    marketplace_code: string;
}

export interface Marketplace {
    marketplace_id: number;
    marketplace_code: string;
}

export interface Client {
    client_id: number;
    client_name: string;
}
