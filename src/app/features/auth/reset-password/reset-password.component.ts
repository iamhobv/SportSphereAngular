import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
// resetForm: FormGroup;
  email!: string;
  token!: string;
  errorMessage: string | null = null;
successMessage: string | null = null;

  constructor( private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router) {
     

    this.route.queryParams.subscribe(params => {
      this.email = params['Email'];
      this.token = params['Token'];
    });
     }

  ngOnInit(): void {
  }

//   resetForm = this.fb.group({
//   fullName: ['', Validators.required],
//   email: ['', [Validators.required, Validators.email]],
//   gender: ['', Validators.required],
//   dateOfBirth: ['', Validators.required],
//   phoneNumber: ['',[Validators.required,Validators.pattern(/^(\+20|0)?1[0-9]{9}$/)]],
//   password: ['', [Validators.required, Validators.minLength(8)]],
//   confirmPassword: ['', Validators.required]
// }, { validators: this.passwordMatchValidator });

   resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
    passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
      const password = group.get('newPassword')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { mismatch: true };
    }

submit() {
    if (this.resetForm.invalid) return;

    const { newPassword, confirmPassword } = this.resetForm.value;
console.log(`email ${this.email} , token ${this.token} , pass ${newPassword} , confPAss ${confirmPassword}`);
    this.authService.resetPassword({
      email: this.email,
      token: this.token,
      newPassword,
      newPasswordConfirm: confirmPassword
    }).subscribe({
      next: res => {
        if(res.success){
 this.successMessage = res.message || 'Password reset successfully';
setTimeout(() => {
  this.successMessage = null;
}, 5000);
          // alert('Password reset successfully!');
          this.router.navigate(['/login']); // redirect after success
        }else{
this.errorMessage = res.message || 'Failed to reset password';
  setTimeout(() => {
  this.errorMessage = null;
}, 5000);
                    // alert(`Failed to reset password! ${res.message}`);

        }

      },
     error: err => {
      console.error('Failed to reset password', err);
      this.errorMessage = err.error?.message || 'Failed to reset password';
    }
    });
  }
}
