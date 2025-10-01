import { AddCommentDto } from './../../../core/Models/AddCommentDto';
import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { PostCommentsVm } from 'src/app/core/Models/CommentVm';
import { FollowingUser } from 'src/app/core/Models/FollowingUser';
import { postFeed } from 'src/app/core/Models/PostFeed';
import { PostService } from 'src/app/core/services/post.service';
import { ProfileServiceService } from 'src/app/core/services/profile-service.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { TokenService } from 'src/app/core/services/token.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, AfterViewInit {
  constructor(private profileService: ProfileServiceService, private postService: PostService, private tokenService: TokenService, private renderer: Renderer2, private router: Router, private route: ActivatedRoute, private userService: UserService, private sharedService: SharedService) { }
  isProfilePage: boolean = false;
  isMyProfile: boolean = false;
  postsFollowing: postFeed[] = [];
  postsForYou: postFeed[] = [];
  isLiked: boolean = false;
  userId = this.tokenService.getUserId();
  selectedPost: any = null;
  comments: PostCommentsVm[] = [];
  likes: FollowingUser[] = [];
  baseURL = environment.baseURL;

  page = 1;
  pageSize = 10;
  PostPage = 2;
  addComment = false;
  userIds: string = "";


  postPageSize = 50;
  PostFollowingPageIndecator = 1;
  PostForYouPageIndecator = 1;

  loadingComments = false;
  hasMoreComments = true;
  FollowinghasMorePosts = true;
  ForYouhasMorePosts = true;

  galleryMedia: any[] = [];
  @ViewChild('postCarousel') postCarousel!: ElementRef;


  @Input() image?: string = "pp";
  @Input() currentUserProfileId?: number;
  @Input() ProfileImageURL?: string;
  @Input() currentUserName?: string;

  // ngOnInit(): void {



  //   // let res = this.isProfile()
  //   if (!this.isProfilePage) {
  //     console.log("user here =" + this.userId);
  //     if (this.userId == null) {
  //       console.log("from if");
  //       setTimeout(() => {
  //         console.log("from time out " + this.userId);
  //       }, 1000);
  //     }
  //     this.getPosts(this.tokenService.getUserId()!, this.PostFollowingPageIndecator, this.postPageSize);
  //   }
  //   this.route.paramMap.subscribe(params => {
  //     this.userIds = params.get('id')!;   // get :id from URL
  //     this.isProfile()

  //   });


  // }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userIds = params.get('id')!;   // get :id from URL
      const inProfile = this.isProfile();

      if (!inProfile) {
        // Only load feed posts if we are NOT on profile page
        if (this.userId) {
          this.getPosts(this.userId, this.PostFollowingPageIndecator, this.postPageSize);
        }
      }
    });
  }


  ngAfterViewInit(): void {
    if (this.postCarousel) {
      this.renderer.listen(this.postCarousel.nativeElement, 'slid.bs.carousel', (event: any) => {
        const activeIndex = event.to; // Bootstrap provides the index of the new active slide
        console.log('Carousel moved to index:', activeIndex);
        this.onSlideChanged(activeIndex);
      });
    }
  }

  onSlideChanged(index: number) {
    // Do whatever you need when image changes
    console.log('Now showing media index:', index);
  }



  onScroll(event: Event) {
    console.log("onscroll");
    const target = event.target as HTMLElement;
    const threshold = 50; // px from bottom to trigger load


    console.log(this.loadingComments + "++++" + this.hasMoreComments);
    if (!this.loadingComments &&
      this.hasMoreComments &&

      target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
      console.log("test");
      this.loadMoreComments(this.selectedPost?.postId);
    }
  }



  loadMoreComments(postId: number | undefined) {
    if (!postId) return;
    this.loadingComments = true;
    this.page++
    console.log(`this.page = ${this.page}`);

    this.postService.getPostComments(postId, this.page, this.pageSize).subscribe({
      next: res => {
        if (res.items.length < this.pageSize) {
          console.log(`res.items.length = ${res.items.length}`);
          this.hasMoreComments = false; // no more data
        }
        this.comments = [...this.comments, ...res.items];
        // this.page++;
        this.loadingComments = false;
      },
      error: err => {
        console.error(err);
        this.loadingComments = false;
      }
    });
  }
  trackByMedia(index: number, media: any): any {
    return media.fileName ?? media.url ?? index;
  }


  // trackById(index: number, item: any): string {
  //   return item.id;
  // }
  trackById(index: number, item: any): any {
    return (
      item.postId ??
      item.commentId ??
      item.profileId ??
      item.userId ??
      index
    );
  }



  selectPostPage(Page: number) {
    /*  postPageSize = 1;
      PostPageIndecator = 1;*/
    if (Page == 1) {
      this.PostPage = 1;
      // this.PostPageIndecator = 1;

      if (this.postsForYou.length == 0) {
        this.getPosts(this.userId!, this.PostForYouPageIndecator, this.postPageSize);

      }

    }
    else if (Page == 2) {
      this.PostPage = 2;
      // this.PostPageIndecator = 1;

      if (this.postsFollowing.length == 0) {
        this.getPosts(this.userId!, this.PostFollowingPageIndecator, this.postPageSize);

      }


    }
  }

  loadMorePosts() {

    if (this.PostPage == 1) {
      this.PostForYouPageIndecator++;
      // this.PostPageIndecator = 1;

      this.getPosts(this.userId!, this.PostForYouPageIndecator, this.postPageSize);
    } else if (this.PostPage == 2 && this.isProfilePage) {
      this.PostFollowingPageIndecator++;
      this.getUserPosts(this.userId!, this.PostFollowingPageIndecator, this.postPageSize);

    }
    else if (this.PostPage == 2) {
      this.PostFollowingPageIndecator++;
      // this.PostPageIndecator = 1;

      this.getPosts(this.userId!, this.PostFollowingPageIndecator, this.postPageSize);


    }
  }

  getPosts(userId: string, PostPage: number, postPageSize: number) {
    console.log(userId + " here");
    if (this.PostPage == 2) {

      this.postService.getUserFeed(userId, PostPage, postPageSize).subscribe({
        next: res => {
          console.log("getUserFeed res = ");
          console.log(res);

          // console.log(`res.items.length = ${res.data.length}`);

          if (res.data.length < postPageSize) {
            // console.log(`res.items.length = ${res.data.length}`);
            this.FollowinghasMorePosts = false; // no more data
          }
          // console.log(res);
          this.postsFollowing = [...this.postsFollowing, ...res.data];

          // this.posts = res.data;
        },
        error: err => console.error(err)
      });
    }
    else if (this.PostPage == 1) {
      this.postService.getSuggestedPosts(userId, PostPage, postPageSize).subscribe({
        next: res => {
          if (res.data.length < postPageSize) {
            console.log(`res.items.length = ${res.data.length}`);
            this.ForYouhasMorePosts = false; // no more data
          }
          console.log("getSuggestedPosts res = ");
          console.log(res);
          this.postsForYou = [...this.postsForYou, ...res.data];
        },
        error: err => console.error(err)
      });
    }




  }




  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  }

  getComments(postId: number) {
    this.page = 1;
    this.pageSize = 10;
    // console.log(postId + "postid");
    this.postService.getPostComments(postId, this.page, this.pageSize).subscribe({
      next: res => {
        console.log("comments res = ");
        console.log(res);
        this.comments = res.items ?? res;
        // this.posts = res.data;
      },
      error: err => console.error(err)
    });

  }




  toggleLike(post: postFeed) {
    post.isILiked = !post.isILiked;
    if (post.isILiked) {
      post.likesCount++;
      this.postService.likePost(post.postId, this.currentUserProfileId!).subscribe({
        next: res => {
          console.log("like res = ");
          console.log(res);


        },
        error: err => console.error(err)
      });
    }
    else {
      post.likesCount--;
      this.postService.unLikePost(post.postId, this.currentUserProfileId!).subscribe({
        next: res => {
          console.log("unlike res = ");
          console.log(res);

        },
        error: err => console.error(err)
      });
    }
  }

  openPost(post: any) {
    this.selectedPost = post;
    this.hasMoreComments = true;

    this.getComments(post.postId,);
  }


  openGallery(post: any) {
    this.galleryMedia = post.mediaFiles;
    const modalEl = document.getElementById('galleryModal');
    if (modalEl) {
      const modal = new (window as any).bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  toastMessage: string | null = null;

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000); // hide after 3 seconds
  }




  addCommentFromOut(
    postId: number,
  ) {


    console.log("post = " + postId);
    const input = document.getElementById(`CommentFromPost${postId}`) as HTMLInputElement;
    const otherInput = document.getElementById(`CommentFromInside${postId}`) as HTMLInputElement;
    if (input.value == "") {
      this.showToast("Can not comment with empty comment")
      return;
    }

    if (input) {
      const content = input.value;
      let dto: AddCommentDto = {
        profileId: this.currentUserProfileId!,
        postId: postId,
        content: content
      };
      console.log(dto);

      this.postService.addComment(dto).subscribe({
        next: res => {
          if (this.PostPage == 2) {

            const post = this.postsFollowing.find(p => p.postId === postId);

            const newComment: PostCommentsVm = {
              commentId: 1,
              content: input.value,
              authorName: this.currentUserName!,
              createdAt: new Date().toString(),
              autherProfileImageUrl: this.ProfileImageURL!,
            };
            this.comments = [newComment, ...this.comments];
            // console.log(post.);
            // console.log(res);
            post!.commentsCount++;
            this.showToast("Comment posted successfully!");
            input.value = '';
            otherInput.value = '';
            // this.posts = res.data;
          } else if (this.PostPage == 1) {

            const post = this.postsForYou.find(p => p.postId === postId);

            const newComment: PostCommentsVm = {
              commentId: 1,
              content: input.value,
              authorName: this.currentUserName!,
              createdAt: new Date().toString(),
              autherProfileImageUrl: this.ProfileImageURL!,
            };
            this.comments = [newComment, ...this.comments];
            // console.log(post.);
            // console.log(res);
            post!.commentsCount++;
            this.showToast("Comment posted successfully!");
            input.value = '';
            otherInput.value = '';
            // this.posts = res.data;
          }
        },
        error: err => console.error(err)
      });
    }


  }

  addCommentFromIn(postId: number) {


    console.log("post = " + postId);
    const input = document.getElementById(`CommentFromInside${postId}`) as HTMLInputElement;
    const otherInput = document.getElementById(`CommentFromPost${postId}`) as HTMLInputElement;
    if (input.value == "") {
      this.showToast("Can not comment with empty comment")
      return;
    }
    if (input) {
      const content = input.value;
      let dto: AddCommentDto = {
        profileId: this.currentUserProfileId!,
        postId: postId,
        content: content
      };
      console.log(dto);

      this.postService.addComment(dto).subscribe({
        next: res => {
          if (this.PostPage == 2) {

            const post = this.postsFollowing.find(p => p.postId === postId);

            const newComment: PostCommentsVm = {
              commentId: 1,
              content: input.value,
              authorName: this.currentUserName!,
              createdAt: new Date().toString(),
              autherProfileImageUrl: this.ProfileImageURL!,
            };
            this.comments = [newComment, ...this.comments];
            // console.log(post.);
            // console.log(res);
            post!.commentsCount++;
            this.showToast("Comment posted successfully!");
            input.value = '';
            otherInput.value = '';
            // this.posts = res.data;
          } else if (this.PostPage == 1) {

            const post = this.postsForYou.find(p => p.postId === postId);

            const newComment: PostCommentsVm = {
              commentId: 1,
              content: input.value,
              authorName: this.currentUserName!,
              createdAt: new Date().toString(),
              autherProfileImageUrl: this.ProfileImageURL!,
            };
            this.comments = [newComment, ...this.comments];
            // console.log(post.);
            // console.log(res);
            post!.commentsCount++;
            this.showToast("Comment posted successfully!");
            input.value = '';
            otherInput.value = '';
            // this.posts = res.data;
          }
        },
        error: err => console.error(err)
      });
    }

  }


  loadingLikes = false;
  hasMoreLikes = true;
  likesPage = 1;

  onLikeScroll(event: Event) {
    console.log("onLikescroll");
    const target = event.target as HTMLElement;
    const threshold = 50; // px from bottom to trigger load


    console.log(this.loadingLikes + "++++" + this.hasMoreLikes);
    if (!this.loadingLikes &&
      this.hasMoreLikes

    ) {
      console.log('first test');
      if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {

        console.log("test");
        this.loadMoreLikes(this.selectedPost?.postId);
      }
    }
  }



  loadMoreLikes(postId: number | undefined) {
    if (!postId) return;
    this.loadingLikes = true;
    this.likesPage++
    console.log(`this.page = ${this.likesPage}`);

    this.postService.getPostLikes(postId, this.likesPage, this.pageSize).subscribe({
      next: res => {
        if (res.items.length < this.pageSize) {
          console.log(`res.items.length = ${res.items.length}`);
          this.hasMoreLikes = false; // no more data
        }
        this.likes = [...this.likes, ...res.items];
        // this.page++;
        this.loadingLikes = false;
      },
      error: err => {
        console.error(err);
        this.loadingLikes = false;
      }
    });
  }



  openLikesModal(postId: number) {
    const element = document.getElementById('likesModal');
    if (!element) return;
    let likesModal = Modal.getInstance(element);
    if (!likesModal) {
      likesModal = new Modal(element, {
        backdrop: false, // <- no extra backdrop
        focus: true
      });
    }
    // const likesModal = new Modal(document.getElementById('likesModal')!, {
    //   backdrop: false // don’t add new backdrop
    // });
    this.likesPage = 1;
    this.loadingLikes = false;
    this.hasMoreLikes = true;
    likesModal.show();

    this.postService.getPostLikes(postId, this.likesPage, this.pageSize).subscribe({
      next: res => {
        console.log("likes res = ");
        console.log(res);
        this.likes = res.items ?? res;
        // this.posts = res.data;
      },
      error: err => console.error(err)
    });

  }





  isProfile(): boolean {
    console.log("isProfilecalled");

    if (this.router.url.toLowerCase().includes("profile")) {
      this.postsFollowing = [];

      this.isProfilePage = true;
      this.PostFollowingPageIndecator = 1;
      this.postPageSize = 50
      this.userIds = this.route.snapshot.paramMap.get('id')!
      console.log(`inside Profile Called 
  current id = ${this.userId}
  called id = ${this.userIds}`
      );
      if (this.userIds == this.userId) {
        this.isMyProfile = true;
        this.getUserPosts(this.userId!, this.PostFollowingPageIndecator, this.postPageSize);
      } else {
        this.isMyProfile = false;
        this.getUserPosts(this.userIds!, this.PostFollowingPageIndecator, this.postPageSize);

      }
      this.postsFollowing = [];
      return true;

    } else {
      this.postsFollowing = [];

      this.isProfilePage = false;

      return false
    }
  }

  getUserPosts(userId: string, PostPage: number, postPageSize: number) {
    this.postService.getUserPosts(userId, PostPage, postPageSize).subscribe({
      next: res => {
        if (res.data.length < this.postPageSize) {
          console.log(`res.items.length = ${res.data.length}`);
          this.FollowinghasMorePosts = false; // no more data
        }
        console.log("getUserFeed res = ");
        console.log(res);
        this.postsFollowing = [...this.postsFollowing, ...res.data];

        // this.posts = res.data;
      },
      error: err => console.error(err)
    });
  }


  gotoProfile(userID: string) {
    if (this.router.url.toLowerCase().includes("profile")) {

      return;
    } else {
      console.log(userID);
      this.router.navigate(['/profile', userID]);

    }
  }
  follow(userID: string) {
    this.userService.follow(userID).subscribe({
      next: res => {
        console.log("follow = ");
        console.log(res);
        // this.ProfileData.isIFollow = !this.ProfileData.isIFollow;
      },
      error: err => console.error(err)
    });
  }
  Unfollow(userID: string) {
    this.userService.unfollow(userID).subscribe({
      next: res => {
        console.log("unfollow = ");
        console.log(res);
        // this.ProfileData.isIFollow = !this.ProfileData.isIFollow;

      },
      error: err => console.error(err)
    });
  }
  blockUser(userID: string) {
    console.log("block");
    this.userService.block(userID).subscribe({
      next: res => {
        console.log("block = ");
        console.log(res);
        // this.ProfileData.isIFollow = !this.ProfileData.isIFollow;

      },
      error: err => console.error(err)
    });
  }
}

