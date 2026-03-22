import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor-interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor-interceptor';
import { retryInterceptor } from './core/interceptors/retry.interceptor-interceptor';
import { loaderInterceptor } from './core/interceptors/loader.interceptor-interceptor';
import { baseUrlInterceptor } from './core/interceptors/base-url.interceptor';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
// import 'ag-grid-enterprise'; // if using enterprise, you can import this side-effect
// import { AllEnterpriseModule } from 'ag-grid-enterprise'; // or explicit enterprise modules

// Register community (and optionally enterprise) modules
ModuleRegistry.registerModules([AllCommunityModule /*, AllEnterpriseModule */]);

export const appConfig : ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        errorInterceptor,
        authInterceptor,
        retryInterceptor,
        loaderInterceptor
      ])
    )
  ]
};
