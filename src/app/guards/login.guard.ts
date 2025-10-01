import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  /**
   *
   */
  constructor(private authService: AuthService, private router: Router) {
    
  }
canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Redirect logged-in users away from login page
      this.router.navigate(['/home']);
      return false;
    }
    // Allow non-logged-in users to access login
    return true;
  }
  
}
