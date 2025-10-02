import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostCommentsVm } from '../Models/CommentVm';
import { AddCommentDto } from '../Models/AddCommentDto';
import { WritePostDto } from '../Models/WritePostDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // private apiUrl = 'https://localhost:7212/api/Post';
  private apiUrl = `${environment.baseURL}/api/Post`;

  constructor(private http: HttpClient) { }



  writePost(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/write-post`, formData);
  }

  getUserPosts(userId: string, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/posts`, {
      params: {
        userId: userId,
        page: page,
        pageSize: pageSize
      }
    });
  }

  likePost(postId: number, profileId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/like-post?postId=${postId}&profileId=${profileId}`, {});
  }

  unLikePost(postId: number, profileId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/unlike-post?postId=${postId}&profileId=${profileId}`, {});
  }

  addComment(dto: AddCommentDto): Observable<any> {
    return this.http.post<AddCommentDto>(`${this.apiUrl}/add-comment`, dto);
  }

  deleteComment(postId: number, commentId: number, profileId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-comment?postId=${postId}&commentId=${commentId}&profileId=${profileId}`);
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/post?postId=${postId}`);
  }

  getUserFeed(currentUserId: string, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/feed?currentUserId=${currentUserId}`
      , {
        params: {
          page: page,
          pageSize: pageSize
        }
      }
    );
  }

  getSuggestedPosts(currentUserId: string, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/posts/suggested?currentUserId=${currentUserId}`
      , {
        params: {
          page: page,
          pageSize: pageSize
        }
      }
    );
  }

  getPostComments(postId: number, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/post/${postId}/comments`, {
      params: {
        page: page,
        pageSize: pageSize
      }
    });
  }
  getPostLikes(postId: number, page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/post/${postId}/Likes`, {
      params: {
        page: page,
        pageSize: pageSize
      }
    });
  }

}
