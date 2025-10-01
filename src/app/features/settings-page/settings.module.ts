import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
    declarations: [SettingsPageComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        SettingsRoutingModule,
        FormsModule
    ]
})
export class SettingsModule { }