import { UserHomeProfileVm } from './../../../core/Models/homeProfile';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileServiceService } from 'src/app/core/services/profile-service.service';
import { TokenService } from 'src/app/core/services/token.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private profileService: ProfileServiceService, private authService: AuthService, private tokenService: TokenService, private sharedService: SharedService) {

  }
  ngOnInit(): void {

    const userId = this.tokenService.getUserId();
    console.log("before load profile " + userId);
    this.loadProfile(userId!);

  }
  ProfileData: UserHomeProfileVm = {} as UserHomeProfileVm;
  profileID?: number;

  loadProfile(userId: string) {
    this.profileService.getHomeProfileCard(userId).subscribe({
      next: res => {
        if (res.success) {
          console.log(res);
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



}
