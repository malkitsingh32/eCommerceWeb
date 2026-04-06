import { Component, inject, OnInit } from '@angular/core';
import { GenericGridComponent } from '../../../../shared/ag-grid/core/generic-grid/generic-grid.component';
import { GenericGridConfig } from '../../../../shared/ag-grid/config/grid-config.service';
import { GridDatasourceService } from '../../../../shared/ag-grid/config/grid-datasource.service';
import { Product } from '../../models/products.model';
import { filter, switchMap } from 'rxjs';
import { DialogService } from '../../../../shared/components/dialog/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductUpsertDialogComponent } from '../product-upsert-dialog/product-upsert-dialog';
import { GridApi } from 'ag-grid-community';
import { ProductsFascade } from '../../fascade/products.fascade';

@Component({
  selector: 'app-products',
  imports: [GenericGridComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  gridConfig!: GenericGridConfig;

  private readonly datasourceSvc = inject(GridDatasourceService);
  private readonly productsFascade = inject(ProductsFascade);
  private readonly dialogService = inject(DialogService);
  private readonly dialog = inject(MatDialog);

  private gridApi?: GridApi;

  ngOnInit(): void {
    this.gridConfig = {
      rowModelType: 'infinite',
      infiniteScroll: true,
      cacheBlockSize: 50,
      onGridReady: (api) => {
        this.gridApi = api;
      },
      infiniteDatasource: this.datasourceSvc.buildInfinite<Product>(
        (req) => this.productsFascade.getProducts(req)
      ),
 
      columnDefs: [
        { headerName: 'Product Id', field: 'productId', width: 130 },
        { headerName: 'Product Name', field: 'productName', minWidth: 160 },
        { headerName: 'Sku', field: 'sku', minWidth: 160 },
        { headerName: 'Description', field: 'description', minWidth: 180 },
        {
          headerName: 'Selling Price',
          field: 'sellingPrice',
          width: 140,
          valueFormatter: (p) => `${Number(p.value ?? 0).toFixed(2)}`,
        },
        { headerName: 'Stock Quantity', field: 'stockQty', width: 140 },
      ],
      actions: [
        {
          label: 'Edit',
          icon: '✏️',
          color: 'primary',
          callback: (row) => this.openUpsertDialog(row as Product),
        },
        {
          label: 'Delete',
          icon: '🗑️',
          color: 'warn',
          callback: (row) => this.deleteRow(row as Product),
        },
      ],
      toolbarActionButton: {
        label: '➕ Add Product',
        title: 'Add Product',
        variant: 'primary',
        buttonClass: 'toolbar-btn',
      },
      onToolbarAction: () => this.openUpsertDialog(),
      enableSearch: false,
      enableStatusBar: true,
      gridHeight: '100%',
    };
  }

  deleteRow(row: Product): void {
    const productId = row.productId;
    if (productId === undefined || productId === null) {
      return;
    }

    this.dialogService
      .confirm({
        title: 'Delete product',
        message: `Are you sure you want to delete "${row.productName}"?`,
        description: 'This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        disableClose: true,
      })
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.productsFascade.deleteProduct(productId))
      )
      .subscribe({
        next: () => {
          this.refreshGrid();
        },
        error: () => undefined,
      });
  }

  private openUpsertDialog(product?: Product): void {
    const productToEdit: Product = product ?? {
      productId: 0,
      productName: '',
      sku: '',
      description: '',
      sellingPrice: 0,
      stockQty: 0,
      status: 'active',
    };

    this.dialog
      .open(ProductUpsertDialogComponent, {
        width: '640px',
        maxWidth: '95vw',
        disableClose: true,
        data: { product: productToEdit },
      })
      .afterClosed()
      .pipe(
        filter((upserted): upserted is Product => !!upserted),
        switchMap((upserted) => this.productsFascade.createUpdateProduct(upserted))
      )
      .subscribe({
        next: () => {
          this.refreshGrid();
        },
        error: () => undefined,
      });
  }

  private refreshGrid(): void {
    this.gridApi?.purgeInfiniteCache?.();
  }

}
