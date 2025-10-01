import { SharedService } from './../../../core/services/shared.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ErrorCode } from './../../../core/Models/Enums';
// src/app/features/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenService } from 'src/app/core/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('stepTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(-50px)' }))
      ]),
    ])
  ]
})
export class LoginComponent implements OnInit {
  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService, private sharedService: SharedService, private tokenService: TokenService) { }
  errorMessage: string | null = null;
  successMessage: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false, [Validators.nullValidator]]
  });
  ngOnInit(): void {
  }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  isEmailNeedToVerify = false;


  forgetPassword() {
    console.log("test forget pass");

    this.router.navigate(['/auth/forgot-password']);



  }
  resendVerificationMail() {
    const email = this.form.get('email')?.value;
    if (!email) return;

    this.auth.resendEmailVerification(email).subscribe({
      next: res => {
        if (res.success) {
          this.successMessage = res.message || 'Verification email sent';
          setTimeout(() => this.successMessage = null, 5000);
        } else {
          this.errorMessage = res.message || 'Failed to resend verification email';
          setTimeout(() => this.errorMessage = null, 5000);
        }
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Failed to resend verification email';
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }


  finishWork() {
    console.log('Component A finished');
    this.sharedService.notifyWorkDone();
  }
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        console.log('Login response:', res);
        if (res.success) {
          this.isEmailNeedToVerify = false;


          this.auth.setToken(res.data.token, this.form.value.rememberMe || false);
          const interval = setInterval(() => {
            if (this.auth.getToken() != null) {
              if (this.tokenService.getUserId() != null) {

                console.log("Now logged in, continue");
                this.router.navigate(['/home']);

                clearInterval(interval);
              }
            }
          }, 500);

          //  while(this.auth.getToken()!=null){

          //    this.router.navigate(['/home']);
          //  }

        } else {
          this.errorMessage = res.message || 'Registration failed';
          if (res.errorCode == "AccountNotActivated") {
            console.log('Login response errorCode: inside if', res.errorCode);

            this.isEmailNeedToVerify = true;
          }
          setTimeout(() => {
            this.errorMessage = null;
          }, 5000);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }

}

