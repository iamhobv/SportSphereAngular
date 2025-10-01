import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { SearchPageComponent } from "./search/search.component";
import { SearchRoutingModule } from "./search-routing.module";

@NgModule({
    declarations: [SearchPageComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        SearchRoutingModule,
        FormsModule
    ]
})
export class SearchModule { }