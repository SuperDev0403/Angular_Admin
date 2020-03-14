// Table data
export interface Table {
    ean: string;
    productName: string;
    photoUri: string;
    rrp: number;
    max_price: number;
    min_price: number;
    available:boolean;
}

// Search Data
export interface SearchResult {
    tables: Table[];
    total: number;
}