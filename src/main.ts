import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { LicenseManager } from 'ag-grid-enterprise';
import { ModuleRegistry } from 'ag-grid-community';
import {
  RowGroupingModule,
  SideBarModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from 'ag-grid-enterprise';

ModuleRegistry.registerModules([
  RowGroupingModule,        // fixes rowGroupPanelShow + pivotPanelShow
  SideBarModule,            // fixes sideBar
  ColumnsToolPanelModule,   // fixes Columns tool panel
  FiltersToolPanelModule,   // fixes Filters tool panel
  SetFilterModule,          // fixes agSetColumnFilter
]);
bootstrapApplication(App, appConfig,
).catch(err => console.error(err));
LicenseManager.setLicenseKey('YOUR_LICENSE_KEY');
