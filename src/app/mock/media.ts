// src/mock/media.ts

export type Media = {

  id: string;
  type: 'movie' | 'tv';
  title: string;
  original_title: string;
  release_year: number;
  release_date: string;
  runtime_minutes: number;
  rating: string; // Content rating (G, PG, PG-13, R, etc.)
  box_office: string;
  director_id: number;
  director_name: string;
  country_id: number;
  overview: string;
  year?: number;
  seasons?: number;
  runtimeMins?: number;
  genres?: string[];
  posterUrl?: string;
  backdropUrl?: string;

  // 🔹 Movie API fields (Group 2)
  movie_id?: number;
  release_year?: number;
  runtime_minutes?: number;
  rating?: string;        // in API this is a string
  box_office?: string;
  director_id?: number;
  country_id?: number;

  // 🔹 TV API fields (Group 1)
  show_id?: number;
  name?: string;
  original_name?: string;
  first_air_date?: string;
  status?: string;
  episodes?: number;
  tmdb_rating?: number;
  popularity?: number;
  poster_url?: string;    // API poster field
};

export const MOCK_MEDIA: Media[] = [
  // ▶ MOVIE sample – matches Movie API example shape
  {
    // UI fields
    id: 'movie-7350',
    type: 'movie',
    title: '1917',
    overview:
      'A World War I drama following two British soldiers on a dangerous mission to deliver a message behind enemy lines.',
    year: 2019,
    runtimeMins: 119,
    genres: ['War', 'Drama'],
    posterUrl: 'https://via.placeholder.com/300x450?text=1917',
    backdropUrl: 'https://via.placeholder.com/1200x500?text=1917',

    // API-aligned fields (from /api/v1/moviebyyear example)
    movie_id: 7350,
    release_year: 2019,
    runtime_minutes: 119,
    rating: '7.5',
    box_office: '394638258.00',
    director_id: 1,
    country_id: 1
  },


  {
    // UI fields
    id: 'show-1',
    type: 'tv',
    title: 'Example Show',
    overview:
      'An example TV show object whose field names match the Group 1 TV API response. Used for list and detail UI.',
    year: 2020,
    seasons: 3,
    genres: ['Drama'],
    posterUrl: 'https://via.placeholder.com/300x450?text=TV+Show',
    backdropUrl: 'https://via.placeholder.com/1200x500?text=TV+Show',

    // API-aligned fields (from /shows 200 response example)
    show_id: 1,
    name: 'Example Show',
    original_name: 'Example Show',
    first_air_date: '2020-01-01',
    status: 'Ended',
    episodes: 24,
    tmdb_rating: 7.9,
    popularity: 55.3,
    poster_url: 'https://via.placeholder.com/300x450?text=TV+Show'
  }
];

export const MOCK_MEDIA: Media[] = [...MOCK_TV_SHOWS, ...MOCK_MOVIES];

export function getById(id: string | number): Media | null {
  return (
    MOCK_MEDIA.find((m) => {
      if (m.type === 'tv') {
        return m.show_id === Number(id);
      } else {
        return m.movie_id === Number(id);
      }
    }) ?? null
  );
}
