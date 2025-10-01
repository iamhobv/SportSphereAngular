import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './layouts/main-layout/main-layout/main-layout.component';
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorComponent } from './features/error/error.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { WildcardComponent } from './features/wildcard/wildcard.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { LoadingComponent } from './shared/components/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    ErrorComponent,
    WildcardComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
