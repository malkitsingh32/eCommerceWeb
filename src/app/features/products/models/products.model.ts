export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

export interface ProductListResponse {
    totalRecords: number;
    productList: Product[];
}