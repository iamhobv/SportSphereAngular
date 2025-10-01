import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AuthService } from './auth.service';

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
  NameIdentifier: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  /**
   *
   */
  constructor(private authService: AuthService) { }






  // Decode token
  decodeToken(): any | null {
    let tokenKey = this.authService.getToken();

    // console.log("token from decodeToken "+ this.tokenKey);
    const token = tokenKey;
    if (!token) return null;

    try {
      return jwtDecode<any>(token);
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  // Extract specific fields
  getUserId(): string | null {
    const decoded = this.decodeToken();
    return decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? null;
  }

  getEmail(): string | null {
    const decoded = this.decodeToken();
    return decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ?? null;
  }

  getRole(): string | null {
    const decoded = this.decodeToken();
    return decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null;
  }
  getToken(): string | null {
    let tokenKey = this.authService.getToken();

    return tokenKey;
  }

}
