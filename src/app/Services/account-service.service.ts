import { computed, inject, Injectable, signal } from '@angular/core';
import { IUser, User } from '../Classes/user';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILogin } from '../Classes/login';
import { IRegister } from '../Classes/register';
import { ILoginResponse } from '../Classes/loginResponse';
import { AuthService } from './auth.service';
import { UserIdResponse } from '../Classes/userIdResponse';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceService {
  private url = 'https://localhost:7200/User/';
  auth = inject(AuthService);
  protected httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  protected httpOptionsWithToken = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.auth.getToken()}` }),
    withCredentials: true,
  };
  constructor(private http: HttpClient) { }
  currentUserSignal = signal<IUser | undefined | null>(undefined);
  isAdmin = signal<boolean>(false);
  user = computed(() => this.currentUserSignal()?.username,);

  login(login: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.url}Login`, login, this.httpOptions);
  }

  logoutUser() {
    this.currentUserSignal.set(null);
    this.isAdmin.set(false);
    this.auth.clearToken();
  }

  register(register: IRegister): Observable<IUser> {
    return this.http.post<IUser>(`${this.url}Register`, register, this.httpOptions);
  }

  initUser() {
    this.getCurrentUser().subscribe({
      next: (user) => {
        if (user == null)
          return;
        this.currentUserSignal.set(user);
        //Current version of backend crates admin by email, to be changed in future versions
        if (user.email.includes('@admin.'))
          this.isAdmin.set(true);
      },
      error: (error) => {
        console.log('Error getting current user', error);
      }
    });
  }
  getCurrentUser(): Observable<IUser> {
    if (!this.auth.getToken()) {
      return new Observable<IUser>();
    }
    return this.http.get<IUser>(`https://localhost:7200/UserUtils/GetCurrentUser`, this.httpOptionsWithToken);
  }
  getUsername(id: string): Observable<string> {
    return this.http.get<string>(`${this.url}GetUsername/${id}`, this.httpOptions);
  }

  getUserIdByName(username: string): Observable<UserIdResponse> {
    return this.http.get<UserIdResponse>(`https://localhost:7200/UserUtils/GetUserIdByName?username=` + username, this.httpOptionsWithToken);
  }

  GetUserByName(username: string): Observable<IUser> {
    return this.http.get<IUser>(`https://localhost:7200/UserUtils/GetUserByName?username=${username}`, this.httpOptionsWithToken);
  }
}
