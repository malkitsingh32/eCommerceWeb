export interface Product {
    productId: number | string;
    productName: string;
    sku: string;
    description: string;
    sellingPrice: number;
    stockQty: number;
    categoryId?: number | string;
    categoryName?: string;
    status?: string;
    createdBy?: number;

    // Backward compatibility fields
    id?: string | number;
    name?: string;
    price?: number;
    imageUrl?: string;
}

export interface ProductCategoryOption {
    id: number | string;
    name: string;
}

export interface ProductListResponse {
    totalRecords: number;
    productList: Product[];
}