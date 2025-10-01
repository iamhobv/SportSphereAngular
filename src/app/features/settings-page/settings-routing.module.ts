import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainLayoutComponent } from "src/app/layouts/main-layout/main-layout/main-layout.component";
import { AuthGuard } from "src/app/guards/AuthGuard";
import { SettingsPageComponent } from "./settings-page/settings-page.component";


const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                component: SettingsPageComponent,
                canActivate: [AuthGuard],
                runGuardsAndResolvers: 'paramsChange' // important for reloading when id changes
            }
        ]
    }
];





@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
