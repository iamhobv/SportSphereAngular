import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriButtonComponent } from './components/pri-button/pri-button.component';
import { AuthFooterComponent } from './components/authFooter/auth-footer/auth-footer.component';
import { HomeProfileCardComponent } from './components/home-profile-card/home-profile-card.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { PostsComponent } from './components/posts/posts.component';
import { FolowingListComponent } from './components/folowing-list/folowing-list.component';
import { ɵInternalFormsSharedModule, FormsModule } from "@angular/forms";
import { FirstColumnInHomeProfileComponent } from './components/first-column-in-home-profile/first-column-in-home-profile.component';
import { PoepleYouMayKnowComponent } from './components/poeple-you-may-know/poeple-you-may-know.component';
import { ProfileCardProfileComponent } from './components/profile-card-profile/profile-card-profile.component';
import { SearchComponent } from './components/search/search.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [PriButtonComponent, AuthFooterComponent, HomeProfileCardComponent, AddPostComponent, PostsComponent, FolowingListComponent, FirstColumnInHomeProfileComponent, PoepleYouMayKnowComponent, ProfileCardProfileComponent, SearchComponent],
  imports: [CommonModule, ɵInternalFormsSharedModule, FormsModule],
  exports: [PriButtonComponent, AuthFooterComponent, HomeProfileCardComponent, AddPostComponent, PostsComponent, FolowingListComponent, FirstColumnInHomeProfileComponent, PoepleYouMayKnowComponent, ProfileCardProfileComponent, SearchComponent]
})
export class SharedModule { }
