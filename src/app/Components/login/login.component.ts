import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { repeat } from 'rxjs';
import { AccountServiceService } from '../../Services/account-service.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { TuiAlertService, TuiIcon } from '@taiga-ui/core';


@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, TuiIcon],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly alerts = inject(TuiAlertService);
  loginForm: FormGroup;
  constructor(private _router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }
  auth = inject(AuthService);
  accountService: AccountServiceService = inject(AccountServiceService);

  loading: boolean = false;
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  ngOnInit() {
    if (this.accountService.currentUserSignal()) {
      this._router.navigate(['/home']);
    }
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      this.accountService.login({ email, password }).subscribe({
        next: (response) => {
          this.accountService.currentUserSignal.set(response.user);
          email.includes('@admin.') ? this.accountService.isAdmin.set(true) : this.accountService.isAdmin.set(false);
          this.auth.setToken(response.token);
          this._router.navigate(['/home'])
        },
        error: (error) => {
          if (error.status == 401) {
            this.alerts.open('Invalid email or password', { label: 'Oops!', icon: '@tui.circle-x', appearance: 'negative' }).subscribe();
          } else {
            this.alerts.open('<p>An error occurred</p><p> Database might be still starting </p>', { label: 'Oops!', icon: '@tui.circle-x', appearance: 'negative' }).subscribe();
          }
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
    this.loading = false;
  }
}
