import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GenderType, UserRoles } from 'src/app/core/Models/Enums';
import { UserHomeProfileVm } from 'src/app/core/Models/homeProfile';
import { SearchUsersCriteriaDto } from 'src/app/core/Models/SearchUsersCriteriaDto';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileServiceService } from 'src/app/core/services/profile-service.service';
import { TokenService } from 'src/app/core/services/token.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, private profileService: ProfileServiceService, private authService: AuthService, private tokenService: TokenService, private router: Router, private route: ActivatedRoute, private userService: UserService) { }
  roles = UserRoles;
  genders = GenderType;
  searchText: string = '';
  sport: string = '';
  gender: number | string = -1;
  role: string | number = -1;
  results: any;
  baseURL = environment.baseURL;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id')!;   // get :id from URL
      this.loadProfile(this.cUserId!);               // reload profile data
    });
    console.log("on init" + this.cUserId + this.userId);
    this.loadProfile(this.cUserId!);
  }
  profileImageUrl?: SafeUrl;
  profileID?: number;
  @Input() userId?: string;
  cUserId = this.tokenService.getUserId();

  ProfileData: UserHomeProfileVm = {} as UserHomeProfileVm;
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

  Search() {
    const criteria: SearchUsersCriteriaDto = {
      fullName: this.searchText,
      sport: this.sport,
      gender: Number(this.gender),
      role: Number(this.role),
      pageNumber: 1,
      pageSize: 10
    };
    console.log('Search text:', this.searchText);
    console.log('Sport:', this.sport);
    console.log('Gender:', this.gender);
    console.log('Role:', this.role);

    this.userService.searchUsers(criteria).subscribe({
      next: (res) => {
        this.results = res.data.searchUsersList;
        console.log('Results:');
        console.log(res);
      },
      error: (err) => console.error(err)
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
