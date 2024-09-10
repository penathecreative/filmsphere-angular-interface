import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
/*/**
 * Component responsible for handling user authentication, including login functionality.
 *
 * Provides a login form that authenticates users. On success:
 * - Stores user info and token in `localStorage`.
 * - Redirects to the movies page.
 * - Shows a success message.
 * On failure:
 * - Displays an error message.
 * - Logs the error to the console.
 *
 * Includes dialogs for user interaction and snack bars for notifications.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}
  /**
   * Handles user login by sending the form inputs to the backend.
   * On successful login:
   * - Closes the dialog.
   * - Stores user information and token in `localStorage`.
   * - Displays a success message in a snack bar.
   * - Redirects the user to the movies page.
   * On failure:
   * - Logs the error to the console.
   * - Displays a failure message in a snack bar.
   *
   * @returns {void}
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        this.dialogRef.close();

        // Directly storing user information in localStorage
        const user = {
          id: result.user._id,
          Username: result.user.Username,
          birthday: result.user.birthday,
          email: result.user.email,
          token: result.token,
        };
        localStorage.setItem('user', JSON.stringify(user));

        this.snackBar.open(
          `${result.user.Username} successfully logged in`,
          'OK',
          {
            duration: 4000,
          }
        );
        this.router.navigate(['movies']);
      },
      (error) => {
        console.error('Login error:', error);
        this.snackBar.open('Login failed', 'OK', {
          duration: 4000,
        });
      }
    );
  }
}
