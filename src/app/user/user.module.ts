import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';
// import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule,MatIconModule,
  MatInputModule,MatSelectModule,MatRadioModule
  ,MatButtonModule,MatCheckboxModule,MatTooltipModule,MatCardModule,MatSnackBarModule} from '@angular/material';
  import {FlexLayoutModule} from '@angular/flex-layout';
  import { UserRoutingModule } from './user-routing.module';
  import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
    FacebookLoginProvider,
} from "angular-6-social-login-v2";



export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          //add facebook client Id below
          provider: new FacebookLoginProvider("")
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          //add google client Id below
          provider: new GoogleLoginProvider("")
        },
       
      ]
  );
  return config;
}

@NgModule({
  declarations: [  
    LoginComponent,
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    RouterModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    FlexLayoutModule,
    FormsModule
  ],
  exports:[LoginComponent],
  providers: [
     {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  } ],
})
export class UserModule { }
