import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePwdContent: boolean = true;
  constructor(
    fb: FormBuilder,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = fb.group({
      email: fb.control('', [Validators.email, Validators.required]),
      password: fb.control('', [Validators.required]),
    });
  }

  loginBtn(): void {
    let login = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.api.login(login).subscribe({
      next: (res) => {
        if (res == 'not found')
          this.snackBar.open('Credential are invalid!', 'Ok');
        else if (res == 'unaproved')
          this.snackBar.open('Your account is not approved by Admin!', 'Ok');
        else {
          localStorage.setItem('access_token', res);
          this.api.userStatus.next('loggedIn');
        }
      },
    });
  }
}
