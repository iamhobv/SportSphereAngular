import { HomeComponent } from './home/home.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeComponent  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    HomeRoutingModule, // use routing module
  ]
})
export class HomeModule {}