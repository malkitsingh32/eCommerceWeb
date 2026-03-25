import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Product, ProductCategoryOption } from '../../models/products.model';
import { AuthStorageService } from '../../../../core/services/auth-storage.service';
import { Button } from '../../../../shared/components/button/button';
import { ProductsService } from '../../services/products.services';

export interface ProductUpsertDialogData {
  product: Product;
}

@Component({
  selector: 'app-product-upsert-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    Button,
  ],
  templateUrl: './product-upsert-dialog.html',
  styleUrl: './product-upsert-dialog.scss',
})
export class ProductUpsertDialogComponent implements OnInit {

  currentUser: any;
  categories: ProductCategoryOption[] = [];

  ngOnInit(): void {
      this.currentUser = this.authservice.getUser();
      this.loadCategories();
  }
  private readonly dialogRef = inject(
    MatDialogRef<ProductUpsertDialogComponent, Product>
  );
  public readonly data = inject<ProductUpsertDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly authservice = inject(AuthStorageService);
  private readonly productsService = inject(ProductsService);

  readonly form = this.fb.nonNullable.group({
    categoryId: [
      this.data.product.categoryId != null ? String(this.data.product.categoryId) : '',
      [Validators.required],
    ],
    productName: [
      this.data.product.productName ?? '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(120)],
    ],
    sku: [
      this.data.product.sku ?? '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(40),
        Validators.pattern(/^[a-zA-Z0-9-_]+$/),
      ],
    ],
    description: [
      this.data.product.description ?? '',
      [Validators.maxLength(500)],
    ],
    sellingPrice: [
      this.data.product.sellingPrice ?? 0,
      [Validators.required, Validators.min(0.01), Validators.max(100000000)],
    ],
    stockQty: [
      this.data.product.stockQty ?? 0,
      [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)],
    ],
  });

  isInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const updated: Product = {
      ...this.data.product,
      categoryId: value.categoryId,
      categoryName: this.categories.find((c) => String(c.id) === String(value.categoryId))?.name,
      productName: value.productName,
      sku: value.sku,
      description: value.description,
      sellingPrice: Number(value.sellingPrice),
      stockQty: Number(value.stockQty),
      createdBy: this.currentUser.userId
    };

    this.dialogRef.close(updated);
  }

  private loadCategories(): void {
    this.productsService.getCategories().subscribe({
      next: (res) => {
        const data = res.data as any;
        const rawList =
          Array.isArray(data) ? data :
          Array.isArray(data?.categories) ? data.categories :
          Array.isArray(data?.categoryList) ? data.categoryList :
          Array.isArray(data?.items) ? data.items :
          [];

        this.categories = rawList
          .map((item: any) => ({
            id: String(item.categoryId ?? item.id ?? item.value ?? ''),
            name: item.categoryName ?? item.name ?? item.label,
          }))
          .filter((item: ProductCategoryOption) => item.id !== '' && !!item.name);
      },
      error: () => {
        this.categories = [];
      },
    });
  }
}
