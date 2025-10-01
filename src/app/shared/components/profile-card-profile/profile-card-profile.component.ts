import { UserService } from './../../../core/services/user.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileServiceService } from 'src/app/core/services/profile-service.service';
import { TokenService } from 'src/app/core/services/token.service';
import { UserHomeProfileVm } from 'src/app/core/Models/homeProfile';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-card-profile',
  templateUrl: './profile-card-profile.component.html',
  styleUrls: ['./profile-card-profile.component.css']
})
export class ProfileCardProfileComponent implements OnInit {
  userIds: string = "";
  profileImageUrl?: SafeUrl;
  profileID?: number;
  myProfile!: boolean;
  baseURL = environment.baseURL;

  userID = this.tokenService.getUserId();
  ProfileData: UserHomeProfileVm = {} as UserHomeProfileVm;

  stats = {
    noOfFollowers: 0,
    noOfFollowing: 0,
    noOfPosts: 0
  };
  constructor(private profileService: ProfileServiceService, private tokenService: TokenService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private userService: UserService, private router: Router) { }

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe(params => {
  //     this.userIds = params.get('id')!;   // get :id from URL
  //     // this.loadProfile(this.userIds);   
  //     this.isMyProfile()
  //     this.getProfileStats()
  //     // reload profile data
  //   });
  //   this.isMyProfile()
  //   this.getProfileStats()
  // }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userIds = params.get('id')!;
      this.isMyProfile();
      this.getProfileStats();
    });
  }


  getProfileStats() {
    this.userIds = this.route.snapshot.paramMap.get('id')!
    // console.log(this.userIds);
    if (this.userID != this.userIds) {
      // this.userID = this.userId;
      this.loadProfile(this.userIds);
    } else {
      this.loadProfile(this.userID);

    }

    console.log("clicked");
    this.profileService.GetProfileStats(this.userIds!).subscribe({
      next: res => {
        // console.log('Post created!', res);
        if (res.success) {
          this.stats = res.data
          console.log("ssssss");
        }
      },
      error: err => console.error('Error creating post', err)
    });
  }



  loadProfile(userId: string) {
    this.profileService.getHomeProfileCard(userId).subscribe({
      next: res => {
        if (res.success) {
          console.log("home card");
          console.log(res.data);
          this.ProfileData = res.data;
          this.profileID = this.ProfileData.profileID;
          console.log("image " + this.ProfileData.profileImage);



          // console.log("profile data "+this.ProfileData.sport);        
        }
      },
      error: err => console.error(err)
    });

    // console.log("image "+ this.ProfileData.imageUrl);
    //     




  }
  isMyProfile() {
    this.userIds = this.route.snapshot.paramMap.get('id')!
    // console.log(this.userIds);
    if (this.userID == this.userIds) {
      this.myProfile = true;
    } else {

      this.myProfile = false;
    }

  }


  block(userID: string) {
    console.log("block");
    this.userService.block(userID).subscribe({
      next: res => {
        console.log("block = ");
        console.log(res);
        // this.ProfileData.isIFollow = !this.ProfileData.isIFollow;

      },
      error: err => console.error(err)
    });
  }
  unBlock(userID: string) {
    this.userService.unblock(userID).subscribe({
      next: res => {
        console.log(res);
      },
      error: err => console.error(err)
    });

  }


  follow(userID: string) {
    this.userService.follow(userID).subscribe({
      next: res => {
        console.log("follow = ");
        console.log(res);
        this.ProfileData.isIFollow = !this.ProfileData.isIFollow;
      },
      error: err => console.error(err)
    });
  }
  Unfollow(userID: string) {
    this.userService.unfollow(userID).subscribe({
      next: res => {
        console.log("unfollow = ");
        console.log(res);
        this.ProfileData.isIFollow = !this.ProfileData.isIFollow;

      },
      error: err => console.error(err)
    });
  }
  settings(tab: number) {
    this.router.navigate(['/settings'], { queryParams: { tab: tab } });
  }
  selectedImage?: string;

  openImageModal(url: string) {
    this.selectedImage = url;
    const modalEl = document.getElementById('imageModal');
    if (modalEl) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  }
}
