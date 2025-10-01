import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileServiceService {
  // private apiUrl = 'https://localhost:7212/api/Profile'; 
  private apiUrl = `${environment.baseURL}/api/Profile`;

  constructor(private http: HttpClient) { }

  /** 🔹 Get full profile */
  getProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetProfile/${userId}`);
  }
  /** 🔹 Get profile For Home Card*/
  getHomeProfileCard(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetHomeCardProfile/${userId}`);
  }

  /** 🔹 Edit profile */
  editProfile(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/EditProfile`, formData);
  }

  /** 🔹 Upload profile picture */
  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/upload-profile-picture`, formData);
  }

  /** 🔹 Upload default profile picture (Admin only) */
  uploadDefaultProfilePicture(userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/${userId}/upload-default-profile-picture`, formData);
  }

  /** 🔹 Get profile picture by userId (returns FileStream) */
  getProfilePicture(userId: string): any {
    return this.http.get(`${this.apiUrl}/${userId}/profile-picture`, { responseType: 'blob' });
  }

  /** 🔹 Get profile picture by picId */
  getProfilePictureById(picId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${picId}/profile-pictureId`, { responseType: 'blob' });
  }

  /** 🔹 Add profile (initial creation) */
  addProfile(dto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-profile`, dto);
  }

  /** 🔹 Get followers */
  getFollowers(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/followers?userId=${userId}`);
  }

  /** 🔹 Get following */
  getFollowing(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/following?userId=${userId}`);
  }
  getFollowingForHome(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/following-for-home?userId=${userId}`);
  }
  peopleYouMayKnow(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/poeple-you-may-know?userId=${userId}`);
  }

  GetProfileStats(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetProfileStats/${userId}`);
  }
}
