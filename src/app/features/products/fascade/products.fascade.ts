import { inject, Injectable } from "@angular/core";
import { ProductStore } from "../stores/products.store";
import { Router } from "@angular/router";
import { BaseSnackbarService } from "../../../core/services/base-snackbar.service";
import { ProductsService } from "../services/products.services";
import { Product } from "../models/products.model";
import { GridDatasourceService } from "../../../shared/ag-grid/config/grid-datasource.service";

@Injectable({
  providedIn: 'root'
})
export class ProductsFascade {

    constructor(private productsService: ProductsService, 
        private store: ProductStore,
        private router: Router,
        private snakbar: BaseSnackbarService) {
    
    }

    getProducts(payload: any) {
        this.store.loading.set(true);
        this.productsService.getProducts(payload).subscribe({
            next: (res) => {
                if (res.succeeded && res.data) {
                    this.store.product.set(res.data as any);
                    return;
                }
            },
            error: (err) => {
                this.store.loading.set(false);
                this.snakbar.error('Failed to fetch products.');
            }
        }); 
    }

    getProductById(id: string) { 
        this.store.loading.set(true);
        this.productsService.getProductById(id).subscribe({
            next: (res) => {
                if (res.succeeded && res.data) {
                    this.store.product.set(res.data as any);
                    return;
                }
            },
            error: (err) => {
                this.store.loading.set(false);
                this.snakbar.error('Failed to fetch product details.');
            }
        }); 
    }
     createUpdateProduct(product: Product) {
        this.store.loading.set(true); 
        this.productsService.createProduct(product).subscribe({
            next: (res) => {
                if (res.succeeded && res.data) {
                    this.snakbar.success('Product saved successfully!');
                    this.router.navigate(['/products']);
                    return;
                }
                this.snakbar.error(res.messages[0] || 'Failed to save product.');
            },
            error: (err) => {
                this.store.loading.set(false);  
                this.snakbar.error('Failed to save product.');
            }
        });
    }  
    
}