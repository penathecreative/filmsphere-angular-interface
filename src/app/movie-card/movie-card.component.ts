import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Movie } from '../models';
import { DialogComponent } from '../dialog/dialog.component';
/**
 * Component representing a card for movies.
 * Displays a list of movies and allows users to toggle favorites,
 * show genre, director, and movie details.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: Movie[] = [];
  favoriteMovies: string[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Angular lifecycle method for component initialization.
   * Fetches movies and favorite movies on initialization.
   */
  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /**
   * Navigate to profile
   */

  goToProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logout user and return to welcome page
   */

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }

  /**
   * Fethes all movies from API
   * @returns {void}
   */

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: Movie[]) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /**
   * Fetches users favorite movies from the API
   * @returns @returns {void}
   */

  getFavoriteMovies(): void {
    this.fetchApiData
      .getFavouriteMovies(localStorage.getItem('user') || '')
      .subscribe((resp: string[]) => {
        this.favoriteMovies = resp || []; // Ensure it's an array
      });
  }

  /**
   * Toggles a movie's favorite status.
   * Adds or removes the movie from the user's favorite list.
   * @param {string} id - The ID of the movie to toggle.
   */
  toggleFavorite(id: string): void {
    if (this.favoriteMovies.includes(id)) {
      // Remove from favorites
      this.fetchApiData
        .deleteFavouriteMovie(localStorage.getItem('user') || '', id)
        .subscribe((resp: any) => {
          this.snackBar.open(
            'Successfully removed movie from favorites',
            'OK',
            {
              duration: 4000,
            }
          );
          this.getFavoriteMovies();
        });
    } else {
      // Add to favorites
      this.fetchApiData
        .addFavouriteMovie(localStorage.getItem('user') || '', id)
        .subscribe((resp: any) => {
          this.snackBar.open('Successfully added movie to favorites', 'OK', {
            duration: 4000,
          });
          this.getFavoriteMovies();
        });
    }
  }

  /**
   * Opens a dialog displaying the genre of a movie.
   * @param {Movie} movie - The movie whose genre will be shown.
   */

  showGenre(movie: Movie): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: `Genre: ${movie.Genre.Name}`,
        content: movie.Genre.Description,
      },
      width: '400px',
    });
  }

  /**
   * Opens a dialog displaying the director details of a movie.
   * @param {Movie} movie - The movie whose director details will be shown.
   */

  showDirector(movie: Movie): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: `Director: ${movie.Director.Name}`,
        content: movie.Director.Bio,
      },
      width: '400px',
    });
  }
  /**
   * Opens a dialog displaying details about a movie.
   * @param {Movie} movie - The movie whose details will be shown.
   */

  showDetail(movie: Movie): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: movie.Title,
        content: movie.Description,
      },
      width: '400px',
    });
  }
  /**
   * Redirects the user to their profile page.
   */
  redirectProfile(): void {
    this.router.navigate(['profile']);
  }
}
