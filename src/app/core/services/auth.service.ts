import { environment } from './../../../environments/environment';
import { RegisterOrchestratorDTO } from './../Models/RegisterOrchestratorDTO';
// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRetDTO } from '../Models/LoginRetDTO';
import { RegisterRetDto } from '../Models/RegisterRetDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.baseURL}/api/Authentication`;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string; rememberMe: boolean }) {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }
  registerFormData(formData: FormData) {
    return this.http.post<any>(`${this.baseUrl}/register`, formData);
  }

  changePassword(dto: any) {
    return this.http.post<any>(`${this.baseUrl}/change-password`, dto);

  }



  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }
  logout(): Observable<any> {

    return this.http.post(`${this.baseUrl}/logout`, {});

  }

  logoutFront(): void {
    this.logout();
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  setToken(token: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  UploadProfilePictureCommand(data: { UserId: string; File: File }): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/upload-profile-picture`, data);
  }
  resendEmailVerification(email: string) {
    const body = { email };
    return this.http.post<any>(`${this.baseUrl}/resend-email-verification`, body);
  }
  resetPassword(data: { email: string, token: string, newPassword: string, newPasswordConfirm: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }

  isLoggedIn(): boolean {
    // Example: check for a token in localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  }
}
