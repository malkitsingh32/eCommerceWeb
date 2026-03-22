import { Component, inject, OnInit } from '@angular/core';
import { GenericGridComponent } from '../../../../shared/ag-grid/core/generic-grid/generic-grid.component';
import { GenericGridConfig } from '../../../../shared/ag-grid/config/grid-config.service';
import { ProductsFascade } from '../../fascade/products.fascade';
import { GridDatasourceService } from '../../../../shared/ag-grid/config/grid-datasource.service';
import { ProductsService } from '../../services/products.services';
import { Product } from '../../models/products.model';
import { BadgeCellRendererComponent } from '../../../../shared/ag-grid/cell-renderers/badge-cell-renderer.component';
import { map } from 'rxjs';
import { ActionCellRendererComponent } from '../../../../shared/ag-grid/cell-renderers/action-cell-renderer.component';

@Component({
  selector: 'app-products',
  imports: [GenericGridComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
   isLoading = false;
  products: any[] = [];
gridConfig!: GenericGridConfig;
 private datasourceSvc = inject(GridDatasourceService);
 private productsService = inject(ProductsService);
  

  constructor(private productsFascade: ProductsFascade) {
   
  }
  ngOnInit(): void {
   this.gridConfig = {
      rowModelType: 'infinite',
      infiniteScroll: true,
      cacheBlockSize: 50,
 
      infiniteDatasource: this.datasourceSvc.buildInfinite<Product>(
        // Your API returns { data: Order[], total: number } — pass it directly
        (req) => this.productsService.getProducts(req).pipe(
          map((res) => ({
            data: res.data?.productList ?? [],
            total: res.data?.totalRecords ?? 0,
          }))
        )
      ),
 
      columnDefs: [
        { headerName: 'Product Id',  field: 'productId', width: 130 },
        { headerName: 'Product Name', field: 'productName',    minWidth: 160 },
        { headerName: 'Sku', field: 'sku',    minWidth: 160 },
        { headerName: 'Description', field: 'description',    minWidth: 160 },
        { headerName: 'sellingPrice', field: 'sellingPrice',    minWidth: 160 },
        { headerName: 'Stock Quantity', field: 'stockQty',    minWidth: 160 },
        {
          headerName: 'Actions',
          width: 120,
          cellRenderer: ActionCellRendererComponent,
          cellRendererParams: {
            colorMap: {
              pending:   '#fb8c00',
              shipped:   '#1976d2',
              delivered: '#43a047',
              cancelled: '#e53935',
            },
            uppercase: true,
          },
        }
      ],
 
      enableSearch: false,
      enableStatusBar: true,
      gridHeight: '600px',
    };
  
  }

  getProducts() {
    this.isLoading = true;
    const payload = { page: 1, pageSize: 20 }; // example payload
    this.productsFascade.getProducts(payload);
  }
  
}
