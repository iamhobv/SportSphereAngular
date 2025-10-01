import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { WritePostDto } from 'src/app/core/Models/WritePostDto';
import { PostService } from 'src/app/core/services/post.service';
import { TokenService } from 'src/app/core/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  constructor(private postService: PostService, private tokenService: TokenService) { }
  @Input() image?: string = "pp";
  @Input() currentUserProfileId?: number;
  @Input() ProfileImageURL?: string;
  @Input() currentUserName?: string;
  baseURL = environment.baseURL;

  ngOnInit(): void {
  }




  content = '';
  caption = '';
  files: File[] = [];
  userId = this.tokenService.getUserId();

  mediaPreviews: { url: string; type: string }[] = [];


  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   console.log(input.files);
  //   if (!input.files) return;

  //   Array.from(input.files).forEach(file => {
  //     this.files.push(file);

  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.mediaPreviews.push({ url: e.target.result, type: file.type });
  //     };
  //     reader.readAsDataURL(file);
  //   });

  //   input.value = ''; // reset input
  // }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      this.files.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.mediaPreviews.push({ url: e.target.result, type: file.type });
      };
      reader.readAsDataURL(file);
    });

    input.value = ''; // reset input to allow re-upload of same file
  }
  triggerFileInput() {
    const input = document.getElementById('fileUpload') as HTMLInputElement;
    if (input) input.click();
  }

  removeMedia(index: number) {
    this.files.splice(index, 1);
    this.mediaPreviews.splice(index, 1);
  }

  canPost(): boolean {
    return this.content.trim().length > 0 || this.files.length > 0;
  }

  submitPost() {
    if (!this.content && this.files.length === 0) return;

    // const dto: FormData = {
    //   userId: this.userId!,
    //   content: this.content,
    //   caption: this.caption,
    //   mediaFiles: this.files
    // };
    const formData = new FormData();
    formData.append('PostData.UserId', this.userId!); // match your backend property path
    formData.append('PostData.Content', this.content ?? '');
    formData.append('PostData.Caption', this.caption ?? '');

    this.files.forEach(file => {
      formData.append('PostData.MediaFiles', file); // name must match backend property
    });

    this.postService.writePost(formData).subscribe({
      next: res => {
        console.log('Post created!', res);
        if (res.success) {
          this.showToast("Post created!");
          this.content = '';
          this.caption = '';
          this.files = [];

          this.mediaPreviews = [];
        }
      },
      error: err => console.error('Error creating post', err)
    });

  }

  toastMessage: string | null = null;

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000); // hide after 3 seconds
  }
}
