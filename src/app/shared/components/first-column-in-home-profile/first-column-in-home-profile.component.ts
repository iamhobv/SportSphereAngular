import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-first-column-in-home-profile',
  templateUrl: './first-column-in-home-profile.component.html',
  styleUrls: ['./first-column-in-home-profile.component.css']
})
export class FirstColumnInHomeProfileComponent implements OnInit {
  @Input() userName: string = 'UserName';
  @Input() userId: string = 'userID';

  @Input() bio: string = 'Bio';
  @Input() role: string = 'Role';
  @Input() image: string = "pp";
  @Input() sport?: string;
  @Input() resident: string = 'Resident';
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id')!;   // get :id from URL
      // this.loadProfile(this.userId);               // reload profile data
    });
  }
  goHome() {
    this.router.navigate(['/home']);

  }

  logout() {
    this.authService.logoutFront();
    if (this.authService.getToken() == null) {
      this.router.navigate(['/auth/login']);

    }
  }
  settings(tab: number) {
    // this.router.navigate(["/settings"], { state: { from: 'profile' } })
    // this.router.navigate(["/settings"],  { queryParams: { tab: 'privacy' } })
    this.router.navigate(['/settings'], { queryParams: { tab: tab } });
  }
}
