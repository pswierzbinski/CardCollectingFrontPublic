import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RedirectCommand, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';
import { TuiIcon, TuiAlertService, TuiButton } from '@taiga-ui/core';
import { AccountServiceService } from '../../Services/account-service.service';
import type { TuiAlertOptions } from '@taiga-ui/core';
import { injectContext, PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { TuiPopover } from '@taiga-ui/cdk';
import { switchMap, takeUntil } from 'rxjs';

@Component({
    exportAs: "Example3",
    imports: [NgForOf, TuiButton],
    template: `
      <p>Redirect to login page?</p>
      <button
          *ngFor="let response of [true, false]"
          appearance="outline-grayscale"
          size="s"
          tuiButton
          type="button"
          class="tui-space_right-1"
          (click)="context.completeWith(response)"
      >
          {{ response ? 'Yes' : 'No' }}
      </button>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RedirectAlert {
  protected readonly context =
    injectContext<TuiPopover<TuiAlertOptions<void>, boolean>>();
}
@Component({
    selector: 'app-register',
    imports: [RouterLink, ReactiveFormsModule, CommonModule, TuiIcon],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RegisterComponent {
  private readonly alerts = inject(TuiAlertService);
  private readonly notification = this.alerts
    .open<boolean>(new PolymorpheusComponent(RedirectAlert), {
      label: 'Account succesfully created!',
      appearance: 'info',
      autoClose: 0,
    })
    .pipe(
      switchMap((response) =>
        response ? this._router.navigate(['/login']) : [],
    ),
      takeUntil(inject(Router).events),
    );

  protected showNotification(): void {
    this.notification.subscribe();
  }

  constructor(private _router: Router) { }
  private formBuilder = inject(FormBuilder);
  registerForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(12)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(12)]),
  });
  accountService: AccountServiceService = inject(AccountServiceService);
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  ngOnInit(){
    if(this.accountService.currentUserSignal()){
      this._router.navigate(['/home']);
    }
  }
  onSubmit() {
    console.log("submitted")
    if (this.registerForm.valid) {
      const { name, email, password, confirmPassword } = this.registerForm.value;
      if (name != null && email != null && password != null) {
        if (password === confirmPassword) {
          this.accountService.register({ name, email, password }).subscribe({
            next: () => {
              this.showNotification()
            },
            error: (error) => {
              switch (error.status){
                case 400:
                  switch (error.error.message){
                    case 'User already exists':
                      this.alerts.open('A user with that email already exists', { label: 'Oops!', icon: '@tui.circle-x', appearance: 'negative' }).subscribe();
                      break;
                    case 'Username taken':
                      this.alerts.open('The username is already taken', { label: 'Oops!', icon: '@tui.circle-x', appearance: 'negative' }).subscribe();
                      break;
                    default:
                      this.alerts.open('An error ocurred D:', { label: 'Oops!', icon: '@tui.circle-x', appearance: 'negative' }).subscribe();
                      break;
                  }
                  break;
                default:
                  this.alerts.open('<p>An error occurred</p><p> Database might be still starting </p>', { label: 'Oops!', icon: '@tui.circle-x', appearance: 'negative' }).subscribe();
                  break;
              }
            },
          });
        } else {
          console.log('Passwords do not match');
        }
      } else {
        this.registerForm.markAllAsTouched;
      }
    }
  }
}