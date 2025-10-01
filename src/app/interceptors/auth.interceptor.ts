import { TokenService } from './../core/services/token.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService, private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    // console.log("token from Interceptor " + token);
    if (token) {
      // clone request and add Authorization header
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }
    return next.handle(request);
  }
}
