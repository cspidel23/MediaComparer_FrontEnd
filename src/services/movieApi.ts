import { movieService } from 'utils/axios';

// ==============================|| MOVIE API TYPES ||============================== //

export interface MovieBasic {
  movie_id: number;
  title: string;
  original_title: string;
  release_year: number;
  runtime_minutes: number;
  rating: string | null;
  box_office: string;
  director_id: number;
  director_name: string;
  country_id: number;
  overview: string;
  genres: string; // Comma-separated string
  budget: string | null;
  studios: string; // Semicolon-separated string
  poster_url: string;
  backdrop_url: string;
  collection: string | null;
  actors: string; // JSON string array
  mpa_rating: string;
}

export interface MoviesResponse {
  success: boolean;
  message: string;
  data: {
    data: MovieBasic[];
    pagination: {
      limit: number;
      offset: number;
      totalCount: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
}

export interface MovieDetailed {
  movie_id: number;
  title: string;
  original_title: string;
  release_year: number;
  runtime_minutes: number;
  rating: string | null;
  box_office: string;
  director_id: number;
  director_name: string;
  country_id: number;
  overview: string;
  genres: string; // Comma-separated string
  budget: string | null;
  studios: string; // Semicolon-separated string
  poster_url: string;
  backdrop_url: string;
  collection: string | null;
  actors: string; // JSON string array
  mpa_rating: string;
}

export interface MovieDetailResponse {
  success: boolean;
  message: string;
  data: {
    data: MovieDetailed[];
    movieId: number;
    total: number;
  };
}

// ==============================|| MOVIE API METHODS ||============================== //

export const movieApi = {
  // Get all movies (paginated with offset/limit)
  getMovies: (limit: number = 100, offset: number = 0, genre?: string, yearMin?: number, yearMax?: number) => {
    const genreParam = genre ? `&genre=${encodeURIComponent(genre)}` : '';
    const yearMinParam = yearMin ? `&yearMin=${yearMin}` : '';
    const yearMaxParam = yearMax ? `&yearMax=${yearMax}` : '';
    return movieService.get<MoviesResponse>(`/api/v1/movies?limit=${limit}&offset=${offset}${genreParam}${yearMinParam}${yearMaxParam}`);
  },

  // Search movies by title
  searchMovies: (searchTerm: string, limit: number = 100, offset: number = 0) => {
    return movieService.get<MoviesResponse>(`/api/v1/movies/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}&offset=${offset}`);
  },

  // Get movie by ID
  getMovieById: (movieId: number) => movieService.get<MovieDetailResponse>(`/api/v1/movies/search/id?movieId=${movieId}`)
};
