import { Injectable, inject } from '@angular/core';
import { finalize, map, Observable, tap } from 'rxjs';
import { ProductStore } from '../stores/products.store';
import { BaseSnackbarService } from '../../../core/services/base-snackbar.service';
import { ProductsService } from '../services/products.services';
import { Product } from '../models/products.model';
import { ApiResponse as GridApiResponse, GridRequest } from '../../../shared/ag-grid/config/grid-request.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsFascade {
    private readonly productsService = inject(ProductsService);
    private readonly store = inject(ProductStore);
    private readonly snakbar = inject(BaseSnackbarService);

    getProducts(payload: GridRequest): Observable<GridApiResponse<Product>> {
        this.store.loading.set(true);

        return this.productsService.getProducts(payload).pipe(
            map((res) => {
                const rows = res.data?.productList ?? [];
                const total = res.data?.totalRecords ?? rows.length;

                this.store.products.set(rows);
                this.store.totalRecords.set(total);

                return {
                    data: rows,
                    total,
                };
            }),
            tap({
                error: () => this.snakbar.error('Failed to fetch products.'),
            }),
            finalize(() => this.store.loading.set(false))
        );
    }

    getProductById(id: string | number): Observable<Product> {
        this.store.loading.set(true);

        return this.productsService.getProductById(String(id)).pipe(
            map((res) => res.data),
            tap({
                next: (product) => {
                    this.store.product.set(product);
                    this.store.selectedProduct.set(product);
                },
                error: () => this.snakbar.error('Failed to fetch product details.'),
            }),
            finalize(() => this.store.loading.set(false))
        );
    }

    createUpdateProduct(product: Product): Observable<Product> {
        this.store.loading.set(true);

        return this.productsService.createProduct(product).pipe(
            map((res) => res.data),
            tap({
                next: (saved) => {
                    this.store.product.set(saved);
                    this.store.selectedProduct.set(saved);
                    this.snakbar.success('Product saved successfully!');
                },
                error: () => this.snakbar.error('Failed to save product.'),
            }),
            finalize(() => this.store.loading.set(false))
        );
    }

    deleteProduct(productId: number | string): Observable<unknown> {
        this.store.loading.set(true);

        return this.productsService.deleteProduct(productId).pipe(
            tap({
                next: () => {
                    this.store.products.update((rows) =>
                        rows.filter((row) => String(row.productId) !== String(productId))
                    );
                    this.store.totalRecords.update((total) => Math.max(0, total - 1));
                    this.snakbar.success('Product deleted successfully.');
                },
                error: () => this.snakbar.error('Failed to delete product.'),
            }),
            finalize(() => this.store.loading.set(false))
        );
    }
}