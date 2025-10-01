import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { ProfileComponent } from './profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        ProfileRoutingModule, // use routing module
    ]
})
export class ProfileModule { }