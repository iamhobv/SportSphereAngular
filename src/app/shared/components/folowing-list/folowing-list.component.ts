import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FollowingUser } from 'src/app/core/Models/FollowingUser';
import { ProfileServiceService } from 'src/app/core/services/profile-service.service';
import { TokenService } from 'src/app/core/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-folowing-list',
  templateUrl: './folowing-list.component.html',
  styleUrls: ['./folowing-list.component.css']
})
export class FolowingListComponent implements OnInit {
  following: FollowingUser[] = [];
  isLast = false;
  baseURL = environment.baseURL;

  constructor(private profileService: ProfileServiceService, private tokenService: TokenService, private router: Router) { }


  ngOnInit(): void {
    this.getFollowing();

  }
  trackById(index: number, item: any): string {
    return item.id;
  }


  getFollowing() {
    const userId = this.tokenService.getUserId();
    this.profileService.getFollowingForHome(userId!).subscribe({
      next: res => {
        console.log("Following res = ");
        console.log(res);

        this.following = res.data;
      },
      error: err => console.error(err)
    });
  }
  goToProfile(userID: string) {
    if (this.router.url.toLowerCase().includes("profile")) {

      return;
    } else {
      console.log(userID);
      this.router.navigate(['/profile', userID]);

    }
  }
}
