import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainLayoutComponent } from "src/app/layouts/main-layout/main-layout/main-layout.component";
import { HomeComponent } from "./home/home.component";


const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // layout wrapper
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
