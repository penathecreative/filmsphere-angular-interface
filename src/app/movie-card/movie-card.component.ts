import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Movie } from '../models'; // Import the Movie interface
import { DialogComponent } from '../dialog/dialog.component';

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
   * Get all movies from API
   * @returns movies
   */

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: Movie[]) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /**
   * Get users favorite movies
   * @returns favouriteMovies
   */

  getFavoriteMovies(): void {
    this.fetchApiData
      .getFavouriteMovies(localStorage.getItem('user') || '')
      .subscribe((resp: string[]) => {
        this.favoriteMovies = resp || []; // Ensure it's an array
      });
  }

  /**
   * Add or remove movie from favorite list
   * @param id
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

  showGenre(movie: Movie): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: `Genre: ${movie.Genre.Name}`,
        content: movie.Genre.Description,
      },
      width: '400px',
    });
  }

  showDirector(movie: Movie): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: `Director: ${movie.Director.Name}`,
        content: movie.Director.Bio,
      },
      width: '400px',
    });
  }

  showDetail(movie: Movie): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: movie.Title,
        content: movie.Description,
      },
      width: '400px',
    });
  }

  redirectProfile(): void {
    this.router.navigate(['profile']);
  }
}
