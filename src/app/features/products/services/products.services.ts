import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../core/services/base-http.service';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { Product, ProductListResponse } from '../models/products.model';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    constructor(private api: BaseHttpService) {}

    getProducts(payload: any) {
        return this.api.post<ProductListResponse>(API_ENDPOINTS.PRODUCTS.GETALL, payload);
    }

    getProductById(id: string) {
        return this.api.get<Product>(API_ENDPOINTS.PRODUCTS.GETBYID + `/${id}`);
    }

    createProduct(product: Product) {
        return this.api.post<Product>(API_ENDPOINTS.PRODUCTS.CREATEUPDATE, product);
    }

}