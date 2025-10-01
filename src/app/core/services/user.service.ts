import { RegisterOrchestratorDTO } from '../Models/RegisterOrchestratorDTO';
// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRetDTO } from '../Models/LoginRetDTO';
import { RegisterRetDto } from '../Models/RegisterRetDto';
import { SearchUsersCriteriaDto } from '../Models/SearchUsersCriteriaDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private baseUrl = 'https://localhost:7212/api/Users';
  private baseUrl = `${environment.baseURL}/api/Users`;


  constructor(private http: HttpClient) { }


  // follow(UserIdToFollow: string): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/follow`, UserIdToFollow);
  // }
  follow(userId: string) {
    return this.http.post<any>(`${this.baseUrl}/follow?UserIdToFollow=${userId}`, {});
  }

  unfollow(UserIdToUnFollow: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/unfollow?UserIdToUnfollow=${UserIdToUnFollow}`, {});
  }

  block(userIdToBlock: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/block?UserIdToBlock=${userIdToBlock}`, {});
  }

  unblock(UserIdUnblock: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/unblock?UserIdUnblock=${UserIdUnblock}`, {});
  }

  // addComment(dto: AddCommentDto): Observable<any> {
  //     return this.http.post<AddCommentDto>(`${this.apiUrl}/add-comment`, dto);
  //   }

  searchUsers(criteria: SearchUsersCriteriaDto): Observable<any> {
    const formData = new FormData();

    if (criteria.fullName) formData.append('FullName', criteria.fullName);
    if (criteria.gender !== undefined && criteria.gender !== -1) {
      formData.append('Gender', criteria.gender.toString());
    }
    if (criteria.role !== undefined && criteria.role !== -1) {
      formData.append('Role', criteria.role.toString());
    }
    if (criteria.sport) formData.append('Sport', criteria.sport);

    formData.append('PageNumber', (criteria.pageNumber ?? 1).toString());
    formData.append('PageSize', (criteria.pageSize ?? 10).toString());

    return this.http.post<any>(`${this.baseUrl}/search-users`, formData);
  }



  BlockingList(userId: string, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-blocking-list/`, {
      params: {
        userId: userId,
        page: page,
        pageSize: pageSize
      }
    });
  }

}
