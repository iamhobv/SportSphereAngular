import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserHomeProfileVm } from 'src/app/core/Models/homeProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileServiceService } from 'src/app/core/services/profile-service.service';
import { TokenService } from 'src/app/core/services/token.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnChanges {

  constructor(private sanitizer: DomSanitizer, private profileService: ProfileServiceService, private authService: AuthService, private tokenService: TokenService, private router: Router, private route: ActivatedRoute) { }
  profileImageUrl?: SafeUrl;
  profileID?: number;
  @Input() userId?: string;
  cUserId = this.tokenService.getUserId();
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id')!;   // get :id from URL
      this.loadProfile(this.cUserId!);               // reload profile data
    });
    console.log("on init" + this.cUserId + this.userId);
    this.loadProfile(this.cUserId!);

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    console.log("on changes" + this.cUserId + this.userId);

  }





  ProfileData: UserHomeProfileVm = {} as UserHomeProfileVm;
  loadProfile(userId: string) {
    this.profileService.getHomeProfileCard(userId).subscribe({
      next: res => {
        if (res.success) {
          console.log(res);
          this.ProfileData = res.data;
          this.profileID = this.ProfileData.profileID;
          console.log("image " + this.ProfileData.profileImageURL);



        }
      },
      error: err => console.error(err)
    });

    // console.log("image "+ this.ProfileData.imageUrl);
    //     




  }
  // Test(): boolean {
  //   // console.log(this.router.url);

  // }
}
