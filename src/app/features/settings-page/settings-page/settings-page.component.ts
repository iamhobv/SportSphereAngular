import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GenderType, UserRoles } from 'src/app/core/Models/Enums';
import { FollowingUser } from 'src/app/core/Models/FollowingUser';
import { UserHomeProfileVm } from 'src/app/core/Models/homeProfile';
import { AuthService } from 'src/app/core/services/auth.service';
import { LookupsService } from 'src/app/core/services/lookups.service';
import { ProfileServiceService } from 'src/app/core/services/profile-service.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { TokenService } from 'src/app/core/services/token.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit, OnDestroy {
  navIndex!: number;
  tab: string | null = null;
  sub?: Subscription;
  athlete = false;
  countries: any[] = [];
  cities: any[] = [];
  baseURL = environment.baseURL;

  constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer, private profileService: ProfileServiceService, private authService: AuthService, private tokenService: TokenService, private userService: UserService, private fb: FormBuilder, private themeService: ThemeService, private lookupsService: LookupsService) { }

  ngOnInit(): void {
    this.loadProfile(this.cUserId!);

    this.sub = this.route.queryParams.subscribe(params => {
      this.tab = params['tab'] ?? null;
      this.navIndex = Number(this.tab);
      console.log('query param tab:', this.tab);
      if (Number(this.tab) == 1) {
        this.loadProfileToEdit(this.cUserId!);
        this.getCountries();
        this.watchCountryChange();

      }
      if (Number(this.tab) == 2) {
        this.GetBlockingList();
      }

    });

  }
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  pageNumber = 1;
  pageSize = 10;



  profileImageUrl?: SafeUrl;
  profileID?: number;
  @Input() userId?: string;
  cUserId = this.tokenService.getUserId();
  blocking: FollowingUser[] = [];
  trackById(index: number, item: any): string {
    return item.id;
  }
  genders = GenderType;
  formStep1 = this.fb.group({
    fullName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    gender: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+20|0)?1[0-9]{9}$/)]],
    bio: [''],
    country: [''],
    city: [''],
    sport: [''],
    position: [''],
    heightCm: [''],
    weightKg: [''],

  });

  formChangePassword = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    oldPassword: ['', Validators.required],
  }, { validators: this.passwordMatchValidator });
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  imageForm = this.fb.group({
    file: [null]

  });




  editProfileData: any;
  ProfileData: UserHomeProfileVm = {} as UserHomeProfileVm;
  loadProfile(userId: string) {
    this.profileService.getHomeProfileCard(userId).subscribe({
      next: res => {
        if (res.success) {
          console.log(res);
          this.ProfileData = res.data;
          this.profileID = this.ProfileData.profileID;
          console.log("image " + this.ProfileData.profileImage);



          // console.log("profile data "+this.ProfileData.sport);        
        }
      },
      error: err => console.error(err)
    });

    // console.log("image "+ this.ProfileData.imageUrl);
    //     




  }
  logout() {
    this.authService.logoutFront();
    if (this.authService.getToken() == null) {
      this.router.navigate(['/login']);

    }
  }
  settings(tab: number) {
    this.router.navigate(['/settings'], { queryParams: { tab: tab } });
  }
  isAthlete(): boolean {
    if (this.editProfileData.role
      == UserRoles.Athlete) {
      this.athlete = true;
      return true;
    } else {
      this.athlete = false;

      return false;
    }
  }
  // loadProfileToEdit(userId: string) {
  //   console.log("load profileasdasdasd");
  //   this.profileService.getProfile(userId).subscribe({
  //     next: res => {
  //       console.log(res);
  //       this.editProfileData = res.data;
  //       this.isAthlete();
  //       const selectedCountry = this.countries.find(c => c.name === res.data.country);
  //       console.log(selectedCountry);

  //       const selectedCity = this.cities.find(c => c.name === res.data.city);
  //       console.log(selectedCity + " asd");
  //       this.formStep1.patchValue({
  //         fullName: this.editProfileData.fullName,
  //         dateOfBirth: this.editProfileData.dateOfBirth
  //           ? this.editProfileData.dateOfBirth.split('T')[0]
  //           : '',
  //         // gender: this.editProfileData.gender,
  //         gender: GenderType[this.editProfileData.gender as keyof typeof GenderType],
  //         phoneNumber: this.editProfileData.phoneNumber,
  //         bio: this.editProfileData.bio,
  //         country: selectedCountry,
  //         // city: selectedCity,
  //         sport: this.editProfileData.sport,
  //         position: this.editProfileData.position,
  //         heightCm: this.editProfileData.heightCm,
  //         weightKg: this.editProfileData.weightKg
  //       });
  //       // if (res) {
  //       //   console.log(object);
  //       //   console.log(res);



  //       //   // console.log("profile data "+this.ProfileData.sport);        
  //       // }
  //     },
  //     error: err => console.error(err)
  //   });
  // }
  loadProfileToEdit(userId: string) {
    this.profileService.getProfile(userId).subscribe({
      next: res => {
        this.editProfileData = res.data;
        this.isAthlete();

        const selectedCountry = this.countries.find(c => c.name === res.data.country);

        this.formStep1.patchValue({
          fullName: this.editProfileData.fullName,
          dateOfBirth: this.editProfileData.dateOfBirth
            ? this.editProfileData.dateOfBirth.split('T')[0]
            : '',
          gender: GenderType[this.editProfileData.gender as keyof typeof GenderType],
          phoneNumber: this.editProfileData.phoneNumber,
          bio: this.editProfileData.bio,
          country: selectedCountry,
          sport: this.editProfileData.sport,
          position: this.editProfileData.position,
          heightCm: this.editProfileData.heightCm,
          weightKg: this.editProfileData.weightKg
        });

        if (selectedCountry) {
          this.lookupsService.getCities(selectedCountry.countryId).subscribe(data => {
            this.cities = data.data;

            const selectedCity = this.cities.find(c => c.name === res.data.city);
            if (selectedCity) {
              this.formStep1.patchValue({ city: selectedCity });
            }
          });
        }
      },
      error: err => console.error(err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageForm.patchValue({ file });
    }
  }
  submitEditProfile() {
    const formData = new FormData();
    const registerData = { ...this.formStep1.value };
    console.log(registerData);
    // formData.append('RegisterData.FullName', registerData.fullName);
    // formData.append('RegisterData.Gender', this.formStep1.get('gender')?.value); 
    // formData.append('RegisterData.DateOfBirth', registerData.dateOfBirth);
    // if (registerData.phoneNumber) formData.append('RegisterData.PhoneNumber', registerData.phoneNumber);
    for (const key in registerData) {
      if (registerData[key]) {
        formData.append(`${key}`, registerData[key]);
      }
    }
    this.profileService.editProfile(formData).subscribe({
      next: res => {
        console.log("Edit");
        console.log(res);
      },
      error: err => {
        console.error('Registration failed', err);
      }
    });



    //   const formImageData = File;
    //   if (this.imageForm.value.file) {
    //   formImageData.append('File', this.imageForm.value.file);
    // }

    this.profileService.uploadProfilePicture(this.imageForm.value.file).subscribe({
      next: res => {
        console.log("Profile");
        console.log(res);
      },
      error: err => {
        console.error('Registration failed', err);
      }
    });

  }
  GetBlockingList() {
    const userId = this.tokenService.getUserId();
    this.userService.BlockingList(userId!, this.pageNumber, this.pageSize).subscribe({
      next: res => {
        console.log(res);

        this.blocking = res.data;
      },
      error: err => console.error(err)
    });
  }
  goToProfile(userID: string) {
    if (this.router.url.toLowerCase().includes(userID)) {

      return;
    } else {
      console.log(userID);
      this.router.navigate(['/profile', userID]);

    }
  }

  unBlock(userID: string) {
    this.userService.unblock(userID).subscribe({
      next: res => {
        console.log(res);
        this.blocking = this.blocking.filter(x => x.userID !== userID);
      },
      error: err => console.error(err)
    });

  }
  submitChangePassword() {
    /*
            public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string NewPasswordConfirm { get; set; }
*/
    // formChangePassword
    let dto = {
      // group.get('newPassword')?.value
      CurrentPassword: this.formChangePassword.get("oldPassword")?.value,
      NewPassword: this.formChangePassword.get("newPassword")?.value,
      NewPasswordConfirm: this.formChangePassword.get("confirmPassword")?.value



    };
    this.authService.changePassword(dto).subscribe({
      next: res => {
        console.log(res);
        if (res.success) {
          this.successMessage = res.message
          this.errorMessage = null;
          setTimeout(() => {
            this.successMessage = null;
          }, 5000);
        } else {

          this.errorMessage = res.message
          this.successMessage = null;
          setTimeout(() => {
            this.errorMessage = null;
          }, 5000);
        }
        // this.blocking = this.blocking.filter(x => x.userID !== userID);
      },
      error: err => console.error(err)
    });
  }


  No() {
    this.successMessage = "Your account remains active."
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null;
      this.router.navigate(["/home"]);

    }, 5000);

  }
  Yes() {
    this.errorMessage = "Your account has been deactivated successfully. We’re sorry to see you go! If you’d like to come back, you can reactivate anytime by logging in again."
    this.successMessage = null;
    setTimeout(() => {
      this.errorMessage = null;
      this.authService.logoutFront();
      this.router.navigate(["/login"]);

    }, 10000);

  }
  light() {
    this.themeService.lightMode();
  }
  dark() {
    this.themeService.darkMode();

  }
  getCountries() {
    this.lookupsService.getCountries().subscribe(data => {
      // console.log(data.data);
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
    this.formStep1.get('country')?.valueChanges.subscribe(country => {
      console.log("test + ");
      console.log(country.name);
      if (country) {
        // if()
        this.lookupsService.getCities(country.countryId).subscribe(data => {
          console.log(data);
          this.cities = data.data;
          // this.formStep1.get('city')?.reset();
        });
      } else {
        this.cities = [];
        this.formStep1.get('city')?.reset();
      }
    });
  }
}
