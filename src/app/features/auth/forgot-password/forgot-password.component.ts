import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private fb: FormBuilder,private auth:AuthService) { }
errorMessage: string | null = null;
successMessage: string | null = null;
  ngOnInit(): void {
  }
 form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
      });


      submit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.auth.forgotPassword(this.form.get('email')?.value).subscribe({
    next: (res) => {
      console.log('forgotPassword response:', res);
      if(res.success){

  
        // this.auth.setToken(res.token, this.form.value.rememberMe || false);
  
        // redirect
        // this.router.navigate(['/feed']);
      }else{
  this.errorMessage = res.message || 'forgotPassword failed';
  if(res.errorCode == "AccountNotActivated"){
    console.log('Login response errorCode: inside if', res.errorCode);

  }
  setTimeout(() => {
  this.errorMessage = null;
}, 5000);
}
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'forgotPassword failed';
    }
  });
}
}
