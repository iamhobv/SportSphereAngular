import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { TokenService } from 'src/app/core/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-profile-card',
  templateUrl: './home-profile-card.component.html',
  styleUrls: ['./home-profile-card.component.css']
})
export class HomeProfileCardComponent implements OnInit {

  constructor(private router: Router, private tokenService: TokenService, private route: ActivatedRoute) { }
  @Input() userName: string = 'UserName';
  @Input() userId: string = 'userID';

  @Input() bio: string = 'Bio';
  @Input() role: string = 'Role';
  @Input() image?: string = "pp";
  @Input() sport?: string;
  @Input() resident: string = 'Resident';
  baseURL = environment.baseURL;

  ngOnInit(): void {
    // this.route.paramMap.subscribe(params => {
    //   this.userId = params.get('id')!;   // get :id from URL
    //   this.gotoProfile();               // reload profile data
    // });
  }
  gotoProfile() {
    if (this.router.url.toLowerCase().includes("profile")) {

      let CurrentUserId = this.tokenService.getUserId();
      //     this.userId = this.route.snapshot.paramMap.get('id')!;
      let URLUserId = this.route.snapshot.paramMap.get('id')!;
      if (CurrentUserId != URLUserId) {
        this.router.navigate(['/profile', CurrentUserId]);

      }
      return;
    } else {
      this.router.navigate(['/profile', this.userId]);

    }
    // return false;
    // this.router.navigate["./profile"];
    // this.router.navigate(['/profile'],this.userId);
  }
}
