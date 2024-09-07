import { Component, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  user: any = {};
  @Input() userData = { username: '', password: '', email: '', birthdate: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Call getUser ofter loading page
   */

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Get user details from localStorage
   */

  getUser(): void {
    this.fetchApiData
      .getUser(localStorage.getItem('user') || '')
      .subscribe((resp: any) => {
        this.user = resp;
        return this.user;
      });
  }

  /**
   * Update user details to API
   */

  updateUser(): void {
    this.fetchApiData
      .editUser(localStorage.getItem('user') || '', this.userData)
      .subscribe(
        (resp: any) => {
          this.snackBar.open('Successfully changed userdata', 'OK', {
            duration: 4000,
          });
          this.getUser();
        },
        (result) => {
          this.snackBar.open(result, 'OK', {
            duration: 4000,
          });
        }
      );
  }
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }

  backToMovies(): void {
    this.router.navigate(['movies']);
  }
}
