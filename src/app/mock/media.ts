// Genre type
export type Genre = {
  genre_id: number;
  name: string;
};

// Network type for TV shows
export type Network = {
  network_id: number;
  name: string;
  logo: string;
  country: string;
};

// Production company type
export type Company = {
  company_id: number;
  name: string;
  logo: string;
  countries: string;
};

// Actor/Cast member type
export type Actor = {
  actor_id: number;
  name: string;
  character: string;
  profile_url: string;
  order_num: number;
};

// TV Show type matching API
export type TVShow = {
  show_id: number;
  name: string;
  original_name: string;
  first_air_date: string;
  last_air_date: string;
  seasons: number;
  episodes: number;
  status: string;
  overview: string;
  popularity: number;
  tmdb_rating: number;
  vote_count: number;
  creators: string[];
  poster_url: string;
  backdrop_url: string;
  genres: Genre[];
  network: Network;
  companies: Company[];
  actors: Actor[];
};

// Movie type (placeholder - will be updated when you provide movie format)
export type Movie = {
  movie_id: number;
  title: string;
  original_title: string;
  release_date: string;
  runtime: number;
  overview: string;
  popularity: number;
  tmdb_rating: number;
  vote_count: number;
  poster_url: string;
  backdrop_url: string;
  genres: Genre[];
  companies: Company[];
  actors: Actor[];
};

// Union type for both
export type Media = (TVShow & { type: 'tv' }) | (Movie & { type: 'movie' });

// Mock TV Shows
const MOCK_TV_SHOWS: (TVShow & { type: 'tv' })[] = [
  {
    type: 'tv',
    show_id: 156390,
    name: 'Washington Black',
    original_name: 'Washington Black',
    first_air_date: '2025-07-23T00:00:00.000Z',
    last_air_date: '2025-07-23T00:00:00.000Z',
    seasons: 1,
    episodes: 8,
    status: 'Ended',
    overview:
      '11-year-old George Washington "Wash" Black embarks on a globe-trotting journey of identity after fleeing a Barbados sugar plantation aboard a flying machine in the company of his master\'s eccentric inventor brother.',
    popularity: 10.6967,
    tmdb_rating: 5.797,
    vote_count: 38,
    creators: ['Selwyn Seyfu Hinds'],
    poster_url: 'https://image.tmdb.org/t/p/w500/oJfZI4pXQQBQutHT15y0evJNGZv.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/w500/vapoYt08nte9AnFPSGADNau8C6I.jpg',
    genres: [
      {
        genre_id: 2,
        name: 'Drama'
      }
    ],
    network: {
      network_id: 2,
      name: 'Hulu',
      logo: 'https://image.tmdb.org/t/p/w500/pqUTCleNUiTLAVlelGxUgWn1ELh.png',
      country: 'US'
    },
    companies: [
      {
        company_id: 1,
        name: 'Indian Meadows Productions',
        logo: 'https://image.tmdb.org/t/p/w500/sUghThrRBgt2T1jewrauUcDBZtY.png',
        countries: 'US'
      },
      {
        company_id: 2,
        name: 'The Gotham Group',
        logo: 'https://image.tmdb.org/t/p/w500/xpRwVe9NL5791oyUidzeRp8ezGj.png',
        countries: 'US'
      },
      {
        company_id: 3,
        name: '20th Television',
        logo: 'https://image.tmdb.org/t/p/w500/8rFlu5iytnjsciYXZDw90ktllCI.png',
        countries: 'US'
      }
    ],
    actors: [
      {
        actor_id: 1,
        name: 'Ernest Kingsley Jr.',
        character: "George Washington 'Wash' Black",
        profile_url: 'https://image.tmdb.org/t/p/w500/9fzSTptMsI5VaBauT8vdFdwND4D.jpg',
        order_num: 1
      },
      {
        actor_id: 2,
        name: 'Sterling K. Brown',
        character: 'Medwin Harris',
        profile_url: 'https://image.tmdb.org/t/p/w500/vjFATaJfAyBie56J4Qv2DQ9Dyem.jpg',
        order_num: 2
      }
    ]
  },
  {
    type: 'tv',
    show_id: 94605,
    name: 'Arcane',
    original_name: 'Arcane',
    first_air_date: '2021-11-06T00:00:00.000Z',
    last_air_date: '2024-11-23T00:00:00.000Z',
    seasons: 2,
    episodes: 18,
    status: 'Ended',
    overview:
      'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions.',
    popularity: 125.45,
    tmdb_rating: 8.746,
    vote_count: 3521,
    creators: ['Christian Linke', 'Alex Yee'],
    poster_url: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/w500/6r0QJMHK5IuJu3466Bx0tmTPLYC.jpg',
    genres: [
      { genre_id: 1, name: 'Animation' },
      { genre_id: 2, name: 'Drama' },
      { genre_id: 3, name: 'Sci-Fi & Fantasy' },
      { genre_id: 4, name: 'Action & Adventure' }
    ],
    network: {
      network_id: 1,
      name: 'Netflix',
      logo: 'https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png',
      country: 'US'
    },
    companies: [
      {
        company_id: 10,
        name: 'Fortiche Production',
        logo: 'https://image.tmdb.org/t/p/w500/vhDMCXjbSpKkaGqqS2QNULssWXD.png',
        countries: 'FR'
      },
      {
        company_id: 11,
        name: 'Riot Games',
        logo: 'https://image.tmdb.org/t/p/w500/7qOdQeeu2NHsp0ti64YqBCsqIXd.png',
        countries: 'US'
      }
    ],
    actors: [
      {
        actor_id: 10,
        name: 'Hailee Steinfeld',
        character: 'Vi',
        profile_url: 'https://image.tmdb.org/t/p/w500/6D2Ar6eiV6FhdSLdCFR4h1PF5qP.jpg',
        order_num: 1
      },
      {
        actor_id: 11,
        name: 'Ella Purnell',
        character: 'Jinx',
        profile_url: 'https://image.tmdb.org/t/p/w500/9J4fw4yngfe8CboFaNqGIspLFab.jpg',
        order_num: 2
      }
    ]
  },
  {
    type: 'tv',
    show_id: 85937,
    name: 'The Last of Us',
    original_name: 'The Last of Us',
    first_air_date: '2023-01-15T00:00:00.000Z',
    last_air_date: '2023-03-12T00:00:00.000Z',
    seasons: 1,
    episodes: 9,
    status: 'Returning Series',
    overview:
      'Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey, as they both must traverse the United States and depend on each other for survival.',
    popularity: 289.67,
    tmdb_rating: 8.6,
    vote_count: 5847,
    creators: ['Craig Mazin', 'Neil Druckmann'],
    poster_url: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/w500/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg',
    genres: [
      { genre_id: 2, name: 'Drama' },
      { genre_id: 3, name: 'Sci-Fi & Fantasy' }
    ],
    network: {
      network_id: 3,
      name: 'HBO',
      logo: 'https://image.tmdb.org/t/p/w500/tuomPhY2UtuPTqqFnKMVHvSb724.png',
      country: 'US'
    },
    companies: [
      {
        company_id: 20,
        name: 'HBO',
        logo: 'https://image.tmdb.org/t/p/w500/tuomPhY2UtuPTqqFnKMVHvSb724.png',
        countries: 'US'
      },
      {
        company_id: 21,
        name: 'Naughty Dog',
        logo: 'https://image.tmdb.org/t/p/w500/kP4FIzbLRddk77Z1qQ2B72mJr0w.png',
        countries: 'US'
      }
    ],
    actors: [
      {
        actor_id: 20,
        name: 'Pedro Pascal',
        character: 'Joel Miller',
        profile_url: 'https://image.tmdb.org/t/p/w500/9VYK7oxcqhjd5LAH6ZFJ3XzOlID.jpg',
        order_num: 1
      },
      {
        actor_id: 21,
        name: 'Bella Ramsey',
        character: 'Ellie Williams',
        profile_url: 'https://image.tmdb.org/t/p/w500/fHJAd8fGjWviEt6ReYVKM6eKPIl.jpg',
        order_num: 2
      }
    ]
  }
];

// Mock Movies (placeholder - will be updated when you provide movie format)
const MOCK_MOVIES: (Movie & { type: 'movie' })[] = [
  {
    type: 'movie',
    movie_id: 1,
    title: 'Sample Movie',
    original_title: 'Sample Movie',
    release_date: '2024-01-01T00:00:00.000Z',
    runtime: 120,
    overview: 'This is a placeholder movie. Will be updated with real format.',
    popularity: 50.0,
    tmdb_rating: 7.5,
    vote_count: 1000,
    poster_url: 'https://picsum.photos/300/450?movie',
    backdrop_url: 'https://picsum.photos/1200/500?movie',
    genres: [{ genre_id: 1, name: 'Action' }],
    companies: [],
    actors: []
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
