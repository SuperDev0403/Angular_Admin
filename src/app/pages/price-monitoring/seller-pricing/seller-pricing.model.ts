// Table data
export interface Table {
    seller_name: string;
    totalProducts: number;
    bellowCount: number;
    bellow_perc: number;
}

// Search Data
export interface SearchResult {
    tables: Table[];
    total: number;
}