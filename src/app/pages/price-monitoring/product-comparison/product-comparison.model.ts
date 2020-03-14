// Table data
export interface Table {
    platform: string;
    seller_name: string;
    rrp: number;
    price: number;
    diff: number;
    perdiff: number;
    country: string;
}

// Search Data
export interface SearchResult {
    tables: Table[];
    total: number;
}