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

// Director type for movies
export type Director = {
  director_id: number;
  name: string;
};

// Movie type matching API
export type Movie = {
  movie_id: number;
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
  },
  {
    type: 'tv',
    show_id: 1396,
    name: 'Breaking Bad',
    original_name: 'Breaking Bad',
    first_air_date: '2008-01-20T00:00:00.000Z',
    last_air_date: '2013-09-29T00:00:00.000Z',
    seasons: 5,
    episodes: 62,
    status: 'Ended',
    overview:
      'Breaking Bad follows protagonist Walter White, a chemistry teacher who lives in New Mexico with his wife and teenage son who has cerebral palsy. White is diagnosed with Stage III cancer and given a prognosis of two years left to live. With a new sense of fearlessness based on his medical prognosis, and a desire to secure his family\'s financial security, White chooses to enter a dangerous world of drugs and crime and ascends to power in the world.',
    popularity: 412.567,
    tmdb_rating: 8.9,
    vote_count: 13456,
    creators: ['Vince Gilligan'],
    poster_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/w500/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    genres: [
      { genre_id: 2, name: 'Drama' },
      { genre_id: 7, name: 'Crime' },
      { genre_id: 8, name: 'Thriller' }
    ],
    network: {
      network_id: 4,
      name: 'AMC',
      logo: 'https://image.tmdb.org/t/p/w500/pmvRmATOCaDykE6JrVoeYxlFHw3.png',
      country: 'US'
    },
    companies: [
      {
        company_id: 80,
        name: 'High Bridge Productions',
        logo: 'https://image.tmdb.org/t/p/w500/5FdQ4lN7vd3xlhRa2PM8L1bAJbZ.png',
        countries: 'US'
      },
      {
        company_id: 81,
        name: 'Gran Via Productions',
        logo: 'https://image.tmdb.org/t/p/w500/gSZm8IiaFhJ8v8V77vjJJmJkqle.png',
        countries: 'US'
      },
      {
        company_id: 82,
        name: 'Sony Pictures Television',
        logo: 'https://image.tmdb.org/t/p/w500/ge9hzeaU7nMtQ4PjkFlc68dGAJ9.png',
        countries: 'US'
      }
    ],
    actors: [
      {
        actor_id: 80,
        name: 'Bryan Cranston',
        character: 'Walter White',
        profile_url: 'https://image.tmdb.org/t/p/w500/7Jahy5LZX2Fo8fGJltMreAI49hC.jpg',
        order_num: 1
      },
      {
        actor_id: 81,
        name: 'Aaron Paul',
        character: 'Jesse Pinkman',
        profile_url: 'https://image.tmdb.org/t/p/w500/oTceEUb6A9Bg6DeUTJBTETUOENu.jpg',
        order_num: 2
      },
      {
        actor_id: 82,
        name: 'Anna Gunn',
        character: 'Skyler White',
        profile_url: 'https://image.tmdb.org/t/p/w500/6yLKtfCFdEJf1xQyP1ZHgEIH4sk.jpg',
        order_num: 3
      }
    ]
  },
  {
    type: 'tv',
    show_id: 1408,
    name: 'House',
    original_name: 'House',
    first_air_date: '2004-11-16T00:00:00.000Z',
    last_air_date: '2012-05-21T00:00:00.000Z',
    seasons: 8,
    episodes: 176,
    status: 'Ended',
    overview:
      'Dr. Gregory House, a drug-addicted, unconventional, misanthropic medical genius, leads a team of diagnosticians at the fictional Princeton–Plainsboro Teaching Hospital in New Jersey. House\'s character has been described as a misanthrope, cynic, narcissist, and curmudgeon. He often shows his contempt for his patients and says that "everybody lies."',
    popularity: 345.123,
    tmdb_rating: 8.6,
    vote_count: 5892,
    creators: ['David Shore'],
    poster_url: 'https://image.tmdb.org/t/p/w500/3Cz7ySOQJmqiuTdrc6CY0r65yDI.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/w500/mSDsSDwaP3E7dEfUPWy4J0djt5Z.jpg',
    genres: [
      { genre_id: 2, name: 'Drama' },
      { genre_id: 11, name: 'Mystery' }
    ],
    network: {
      network_id: 5,
      name: 'FOX',
      logo: 'https://image.tmdb.org/t/p/w500/1DSpHrWyOORkL9N2QHX7Adt31mQ.png',
      country: 'US'
    },
    companies: [
      {
        company_id: 90,
        name: 'Universal Television',
        logo: 'https://image.tmdb.org/t/p/w500/5xUJfzPZ8jWJUDzYtIeuPO4qPIa.png',
        countries: 'US'
      },
      {
        company_id: 91,
        name: 'Heel and Toe Films',
        logo: 'https://image.tmdb.org/t/p/w500/yRHPJnEOCOoGbXMxSVELOyJbqCT.png',
        countries: 'US'
      },
      {
        company_id: 92,
        name: 'Bad Hat Harry Productions',
        logo: 'https://image.tmdb.org/t/p/w500/zOy9PBAA76OwvJHhZk4t5Cc8WZU.png',
        countries: 'US'
      }
    ],
    actors: [
      {
        actor_id: 90,
        name: 'Hugh Laurie',
        character: 'Dr. Gregory House',
        profile_url: 'https://image.tmdb.org/t/p/w500/4xfIw3ICeU00p4VT6e8oVCk6BYe.jpg',
        order_num: 1
      },
      {
        actor_id: 91,
        name: 'Robert Sean Leonard',
        character: 'Dr. James Wilson',
        profile_url: 'https://image.tmdb.org/t/p/w500/owIr4b4VQXjGxMal4zceChelbEk.jpg',
        order_num: 2
      },
      {
        actor_id: 92,
        name: 'Omar Epps',
        character: 'Dr. Eric Foreman',
        profile_url: 'https://image.tmdb.org/t/p/w500/buDs3CKFrjZ3O3XDtGLAzIUGRiq.jpg',
        order_num: 3
      }
    ]
  }
];

// Mock Movies
const MOCK_MOVIES: (Movie & { type: 'movie' })[] = [
  {
    type: 'movie',
    movie_id: 603,
    title: 'The Matrix',
    original_title: 'The Matrix',
    release_year: 1999,
    release_date: '1999-03-31T00:00:00.000Z',
    runtime_minutes: 136,
    rating: 'R',
    box_office: '$467,222,728',
    director_id: 1,
    director_name: 'The Wachowskis',
    country_id: 1,
    overview:
      'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
    popularity: 89.456,
    tmdb_rating: 8.2,
    vote_count: 25847,
    poster_url: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/w500/icmmSD4vTTDKOq2vvdulafOGw93.jpg',
    genres: [
      { genre_id: 5, name: 'Action' },
      { genre_id: 6, name: 'Science Fiction' }
    ],
    companies: [
      {
        company_id: 30,
        name: 'Warner Bros. Pictures',
        logo: 'https://image.tmdb.org/t/p/w500/ky0xOc5OrhzkZ1N6KyUxacfQsCk.png',
        countries: 'US'
      },
      {
        company_id: 31,
        name: 'Village Roadshow Pictures',
        logo: 'https://image.tmdb.org/t/p/w500/5cPMkUAKXGkIhCJkGKGOvnZMM6j.png',
        countries: 'US'
      }
    ],
    actors: [
      {
        actor_id: 30,
        name: 'Keanu Reeves',
        character: 'Neo',
        profile_url: 'https://image.tmdb.org/t/p/w500/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg',
        order_num: 1
      },
      {
        actor_id: 31,
        name: 'Laurence Fishburne',
        character: 'Morpheus',
        profile_url: 'https://image.tmdb.org/t/p/w500/8suEsPP6lIlVSUy9FWuwWWJ6FTl.jpg',
        order_num: 2
      },
      {
        actor_id: 32,
        name: 'Carrie-Anne Moss',
        character: 'Trinity',
        profile_url: 'https://image.tmdb.org/t/p/w500/xD4jTA3KmVp5Rq3aHcymL9DUGjD.jpg',
        order_num: 3
      }
    ]
  },
  {
    type: 'movie',
    movie_id: 155,
    title: 'The Dark Knight',
    original_title: 'The Dark Knight',
    release_year: 2008,
    release_date: '2008-07-18T00:00:00.000Z',
    runtime_minutes: 152,
    rating: 'PG-13',
    box_office: '$1,004,558,444',
    director_id: 2,
    director_name: 'Christopher Nolan',
    country_id: 1,
    overview:
      'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.',
    popularity: 156.789,
    tmdb_rating: 9.0,
    vote_count: 32456,
    poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/w500/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    genres: [
      { genre_id: 5, name: 'Action' },
      { genre_id: 7, name: 'Crime' },
      { genre_id: 2, name: 'Drama' },
      { genre_id: 8, name: 'Thriller' }
    ],
    companies: [
      {
        company_id: 30,
        name: 'Warner Bros. Pictures',
        logo: 'https://image.tmdb.org/t/p/w500/ky0xOc5OrhzkZ1N6KyUxacfQsCk.png',
        countries: 'US'
      },
      {
        company_id: 40,
        name: 'Legendary Pictures',
        logo: 'https://image.tmdb.org/t/p/w500/8M99Dkt23MjQMTTWukq4m5XsEuo.png',
        countries: 'US'
      }
    ],
    actors: [
      {
        actor_id: 40,
        name: 'Christian Bale',
        character: 'Bruce Wayne / Batman',
        profile_url: 'https://image.tmdb.org/t/p/w500/3qx2QFUbG6t6IlzR0F9k3Z6Yhf7.jpg',
        order_num: 1
      },
      {
        actor_id: 41,
        name: 'Heath Ledger',
        character: 'Joker',
        profile_url: 'https://image.tmdb.org/t/p/w500/3WF4M1v9lTLCChNLZQ5JYWyYc3i.jpg',
        order_num: 2
      },
      {
        actor_id: 42,
        name: 'Aaron Eckhart',
        character: 'Harvey Dent / Two-Face',
        profile_url: 'https://image.tmdb.org/t/p/w500/1dsQdBzbjJIXYeLCiKfF6tlLjT5.jpg',
        order_num: 3
      }
    ]
  },
  {
    type: 'movie',
    movie_id: 278,
    title: 'The Shawshank Redemption',
    original_title: 'The Shawshank Redemption',
    release_year: 1994,
    release_date: '1994-09-23T00:00:00.000Z',
    runtime_minutes: 142,
    rating: 'R',
    box_office: '$28,767,189',
    director_id: 3,
    director_name: 'Frank Darabont',
    country_id: 1,
    overview:
      'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates for his integrity and unquenchable sense of hope.',
    popularity: 98.234,
    tmdb_rating: 8.7,
    vote_count: 28543,
    poster_url: 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/w500/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    genres: [
      { genre_id: 2, name: 'Drama' },
      { genre_id: 7, name: 'Crime' }
    ],
    companies: [
      {
        company_id: 50,
        name: 'Castle Rock Entertainment',
        logo: 'https://image.tmdb.org/t/p/w500/kIxYtP35N5d6E7kZDXrVqTcVxNT.png',
        countries: 'US'
      }
    ],
    actors: [
      {
        actor_id: 50,
        name: 'Tim Robbins',
        character: 'Andy Dufresne',
        profile_url: 'https://image.tmdb.org/t/p/w500/hsCfaskKPMePNEeKlkDguxXqeS7.jpg',
        order_num: 1
      },
      {
        actor_id: 51,
        name: 'Morgan Freeman',
        character: 'Ellis Boyd "Red" Redding',
        profile_url: 'https://image.tmdb.org/t/p/w500/jPsLqiYGSofU4s6BjrxnefMfabb.jpg',
        order_num: 2
      }
    ]
  },
  {
    type: 'movie',
    movie_id: 424,
    title: 'Schindler\'s List',
    original_title: 'Schindler\'s List',
    release_year: 1993,
    release_date: '1993-12-15T00:00:00.000Z',
    runtime_minutes: 195,
    rating: 'R',
    box_office: '$322,211,329',
    director_id: 4,
    director_name: 'Steven Spielberg',
    country_id: 1,
    overview:
      'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.',
    popularity: 67.891,
    tmdb_rating: 8.6,
    vote_count: 15876,
    poster_url: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/w500/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg',
    genres: [
      { genre_id: 2, name: 'Drama' },
      { genre_id: 9, name: 'History' },
      { genre_id: 10, name: 'War' }
    ],
    companies: [
      {
        company_id: 60,
        name: 'Amblin Entertainment',
        logo: 'https://image.tmdb.org/t/p/w500/vru2SssLX3FPhnKZGtYw00pVIS9.png',
        countries: 'US'
      },
      {
        company_id: 61,
        name: 'Universal Pictures',
        logo: 'https://image.tmdb.org/t/p/w500/o86DbpburjxrqAzEDhXZcyE8pDb.png',
        countries: 'US'
      }
    ],
    actors: [
      {
        actor_id: 60,
        name: 'Liam Neeson',
        character: 'Oskar Schindler',
        profile_url: 'https://image.tmdb.org/t/p/w500/bboldwqSC6tdw2iL6631c98l2Mn.jpg',
        order_num: 1
      },
      {
        actor_id: 61,
        name: 'Ben Kingsley',
        character: 'Itzhak Stern',
        profile_url: 'https://image.tmdb.org/t/p/w500/vQtBqpF2HDdzbfXHDzR4u37i1Ac.jpg',
        order_num: 2
      },
      {
        actor_id: 62,
        name: 'Ralph Fiennes',
        character: 'Amon Goeth',
        profile_url: 'https://image.tmdb.org/t/p/w500/tJr9n925f1omPwppWvvHSvjKLjX.jpg',
        order_num: 3
      }
    ]
  },
  {
    type: 'movie',
    movie_id: 550,
    title: 'Fight Club',
    original_title: 'Fight Club',
    release_year: 1999,
    release_date: '1999-10-15T00:00:00.000Z',
    runtime_minutes: 139,
    rating: 'R',
    box_office: '$101,209,702',
    director_id: 5,
    director_name: 'David Fincher',
    country_id: 1,
    overview:
      'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
    popularity: 78.567,
    tmdb_rating: 8.4,
    vote_count: 29874,
    poster_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/w500/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    genres: [
      { genre_id: 2, name: 'Drama' },
      { genre_id: 8, name: 'Thriller' }
    ],
    companies: [
      {
        company_id: 70,
        name: 'Fox 2000 Pictures',
        logo: 'https://image.tmdb.org/t/p/w500/aXzNawHY07IB1qTsHuGfzxNLU6p.png',
        countries: 'US'
      },
      {
        company_id: 71,
        name: 'Regency Enterprises',
        logo: 'https://image.tmdb.org/t/p/w500/sOWPC7W0TGwdCr1bTW8ZwbEPjN1.png',
        countries: 'US'
      }
    ],
    actors: [
      {
        actor_id: 70,
        name: 'Brad Pitt',
        character: 'Tyler Durden',
        profile_url: 'https://image.tmdb.org/t/p/w500/ajNaPmXVVMJFg9GWmu6MJzTaWdV.jpg',
        order_num: 1
      },
      {
        actor_id: 71,
        name: 'Edward Norton',
        character: 'The Narrator',
        profile_url: 'https://image.tmdb.org/t/p/w500/5XBzD5WuTyVQZeS4VI25z2moMeY.jpg',
        order_num: 2
      },
      {
        actor_id: 72,
        name: 'Helena Bonham Carter',
        character: 'Marla Singer',
        profile_url: 'https://image.tmdb.org/t/p/w500/DDeITcCpnBd0CkAIRPhggy9bt5.jpg',
        order_num: 3
      }
    ]
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
