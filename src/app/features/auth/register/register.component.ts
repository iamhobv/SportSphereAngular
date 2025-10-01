import { animate, style, transition, trigger } from '@angular/animations';
import { RegisterOrchestratorDTO } from './../../../core/Models/RegisterOrchestratorDTO';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GenderType, UserRoles } from 'src/app/core/Models/Enums';
import { AuthService } from 'src/app/core/services/auth.service';
import { LookupsService } from 'src/app/core/services/lookups.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
export class RegisterComponent implements OnInit {

  roles = UserRoles;
  genders = GenderType;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private lookupsService: LookupsService) { }
  errorMessage: string | null = null;
  successMessage: string | null = null;
  countries: any[] = [];
  cities: any[] = [];
  selectedCountryId?: number;
  ngOnInit(): void {
    this.getCountries();
    this.watchCountryChange();
  }
  // register.component.ts
  step = 1; // Track current step

  formStep1 = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    gender: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+20|0)?1[0-9]{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  nextStep() {
    if (this.formStep1.invalid) {
      this.formStep1.markAllAsTouched();
      return;
    }
    this.step = 2;
  }
  previousStep() {
    this.step = 1;
  }




  //next step 
  formStep2 = this.fb.group({
    role: ['', Validators.required],

    bio: [''],
    country: [''],
    city: [''],
    sport: [''],
    position: [''],
    heightCm: [''],
    weightKg: [''],
    file: [null]
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formStep2.patchValue({ file }); // Save file in FormGroup
    }
  }




  isAthlete(): boolean {
    console.log(this.formStep2.get('role')?.value);
    console.log(this.formStep2.get('role')?.value === String(this.roles.Athlete));
    return this.formStep2.get('role')?.value === String(this.roles.Athlete);
  }
  // isAthlete(): boolean {
  //   return +this.formStep2.get('role')?.value === this.roles.Athlete;
  // }







  submitFinal() {
    if (this.formStep1.invalid) {
      this.formStep1.markAllAsTouched();
      this.step = 1;
      return;
    }

    if (this.formStep2.invalid) {
      this.formStep2.markAllAsTouched();
      this.step = 2;
      return;
    }

    const formData = new FormData();

    // 1️⃣ Step1 -> RegisterDTO
    const registerData = { ...this.formStep1.value };
    // delete registerData.confirmPassword; // optional if backend handles it
    formData.append('RegisterData.FullName', registerData.fullName);
    formData.append('RegisterData.Email', registerData.email);
    formData.append('RegisterData.Role', this.formStep2.get('role')?.value); // string
    formData.append('RegisterData.Gender', this.formStep1.get('gender')?.value); // string
    formData.append('RegisterData.DateOfBirth', registerData.dateOfBirth);
    if (registerData.phoneNumber) formData.append('RegisterData.PhoneNumber', registerData.phoneNumber);
    formData.append('RegisterData.Password', registerData.password);
    formData.append('RegisterData.ConfirmPassword', registerData.confirmPassword);

    // 2️⃣ Step2 -> Profile
    const profileData = { ...this.formStep2.value };
    delete profileData.role;
    delete profileData.file;
    delete profileData.city;
    delete profileData.country;
    formData.append('Profile.city', this.formStep2.value.city.name);
    formData.append('Profile.country', this.formStep2.value.country.name);



    for (const key in profileData) {
      if (profileData[key]) {
        formData.append(`Profile.${key}`, profileData[key]);
      }
    }

    // 3️⃣ File
    if (this.formStep2.value.file) {
      formData.append('File', this.formStep2.value.file);
    }

    // 4️⃣ Send to backend
    this.auth.registerFormData(formData).subscribe({
      next: res => {
        if (res.success) {
          this.successMessage = res.message || 'Registration complete';
          setTimeout(() => {
            this.successMessage = null;
          }, 5000);

          console.log('Registration complete', res);
          this.router.navigate(['/auth/login']);
        }
        else {
          this.errorMessage = res.message || 'Registration failed';
          setTimeout(() => {
            this.errorMessage = null;
          }, 5000);
        }

      },
      error: err => {
        console.error('Registration failed', err);
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
  }

  getCountries() {
    this.lookupsService.getCountries().subscribe(data => {
      console.log(data.data);
      this.countries = data.data;
    });
  }

  onCountryChange(countryId: number) {
    console.log("from on change " + countryId);
    if (countryId) {
      this.lookupsService.getCities(countryId).subscribe(data => {
        this.cities = data.data;
      });
    } else {
      this.cities = [];
    }
  }
  watchCountryChange() {
    this.formStep2.get('country')?.valueChanges.subscribe(country => {
      console.log("test + ");
      console.log(country.name);
      if (country) {
        this.lookupsService.getCities(country.countryId).subscribe(data => {
          console.log(data);
          this.cities = data.data;
          this.formStep2.get('city')?.reset();
        });
      } else {
        this.cities = [];
        this.formStep2.get('city')?.reset();
      }
    });
  }
  test() {
    console.log(this.formStep2.value.city.name);
  }
}
