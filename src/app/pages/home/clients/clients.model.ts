export interface Users {
    id: number;
    name: string;
    email: string;
    client_id: number;
    client_name: string;
    password: string;
    role: string;
    is_active: boolean;
}

export interface Clients {
    client_id: number;
    client_name: string;
    client_cif: string;
    client_type_id: number;
    client_type_platform: string;
    client_is_active: boolean;
}

export interface Client_type {
    client_type_id: number;
    client_type_platform: string;    
}