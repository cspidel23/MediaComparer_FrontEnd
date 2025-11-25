import { tvService } from 'utils/axios';

// ==============================|| TV API TYPES ||============================== //

export interface TVGenre {
  genre_id: number;
  name: string;
}

export interface TVNetwork {
  network_id: number;
  name: string;
  logo: string;
  country: string | null;
}

export interface TVCompany {
  company_id: number;
  name: string;
  logo: string;
  countries: string;
}

export interface TVActor {
  actor_id: number;
  name: string;
  character: string;
  profile_url: string;
  order_num: number;
}

export interface TVShowBasic {
  show_id: number;
  name: string;
  original_name: string;
  first_air_date: string;
  status: string;
  seasons: number;
  episodes: number;
  tmdb_rating: number;
  popularity: number;
  poster_url: string;
}

export interface TVShowDetailed extends TVShowBasic {
  last_air_date: string;
  overview: string;
  vote_count: number;
  creators: string[];
  backdrop_url: string;
  genres: TVGenre[];
  network: TVNetwork;
  companies: TVCompany[];
  actors: TVActor[];
}

export interface TVShowsResponse {
  count: number;
  page: number;
  limit: number;
  data: TVShowBasic[];
}

export interface TVGenresResponse {
  count: number;
  data: TVGenre[];
}

// ==============================|| TV API METHODS ||============================== //

export const tvApi = {
  // Get all TV shows (paginated)
  getShows: (page: number = 1, limit: number = 50) => tvService.get<TVShowsResponse>(`/shows?page=${page}&limit=${limit}`),

  // Get filtered TV shows (paginated)
  getFilteredShows: (
    page: number = 1,
    limit: number = 50,
    name?: string,
    genres?: string,
    startDate?: string,
    endDate?: string,
    minRating?: number,
    maxRating?: number,
    network?: string,
    status?: string,
    actors?: string,
    studios?: string,
    creators?: string
  ) => {
    const nameParam = name ? `&name=${encodeURIComponent(name)}` : '';
    const genresParam = genres ? `&genres=${genres}` : '';
    const startDateParam = startDate ? `&startDate=${startDate}` : '';
    const endDateParam = endDate ? `&endDate=${endDate}` : '';
    const minRatingParam = minRating !== undefined ? `&min_rating=${minRating}` : '';
    const maxRatingParam = maxRating !== undefined ? `&max_rating=${maxRating}` : '';
    const networkParam = network ? `&network=${encodeURIComponent(network)}` : '';
    const statusParam = status ? `&status=${encodeURIComponent(status)}` : '';
    const actorsParam = actors ? `&actors=${encodeURIComponent(actors)}` : '';
    const studiosParam = studios ? `&studios=${encodeURIComponent(studios)}` : '';
    const creatorsParam = creators ? `&creators=${encodeURIComponent(creators)}` : '';
    return tvService.get<TVShowsResponse>(
      `/shows/filter?page=${page}&limit=${limit}${nameParam}${genresParam}${startDateParam}${endDateParam}${minRatingParam}${maxRatingParam}${networkParam}${statusParam}${actorsParam}${studiosParam}${creatorsParam}`
    );
  },

  // Get TV show by ID
  getShowById: (id: number) => tvService.get<TVShowDetailed>(`/shows/${id}`),

  // Get all genres
  getGenres: () => tvService.get<TVGenresResponse>('/genres')
};
