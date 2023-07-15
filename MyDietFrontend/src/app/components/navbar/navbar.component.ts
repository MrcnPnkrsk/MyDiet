import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api'; // import this at the top of your file

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUsername(): string {
    return this.authService.getUsername();
  }

  getRole(): string {
    return this.authService.getRole();
  }

  login(): void {
    this.authService.login({ username: this.username, password: this.password }).subscribe((result) => {
      if (result) {
        this.username = '';
        this.password = '';
        this.router.navigate(['/']);
      }
    },
      error => {
        if (error.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Cannot log in', detail: 'Unauthorized' });
        } else {
          console.log(error);
        }
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  signup(): void {
    this.authService.signup({ username: this.username, password: this.password }).subscribe(
      () => {
        this.login();
      },
      error => {
        if (error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Cannot sign up', detail: 'User already exists' });
        } else {
          console.log(error);
        }
      }
    );
  }
}
