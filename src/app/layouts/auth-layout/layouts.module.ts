import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [AuthLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
],
  exports: [AuthLayoutComponent]
})
export class LayoutsModule {}
