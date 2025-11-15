export type Media = {
  id: string;
  type: 'movie' | 'tv';
  title: string;
  overview: string;
  year?: number;
  seasons?: number;
  runtimeMins?: number;
  genres?: string[];
  posterUrl?: string;
  backdropUrl?: string;
};

export const MOCK_MEDIA: Media[] = [
  {
    id: 'm1',
    type: 'movie',
    title: 'The Example Movie',
    overview:
      "An example movie used for UI testing with images and text. This is mock data.",
    year: 2024,
    runtimeMins: 118,
    genres: ['Drama', 'Adventure'],
    posterUrl: 'https://picsum.photos/300/450?movie',
    backdropUrl: 'https://picsum.photos/1200/500?movie'
  },
  {
    id: 't1',
    type: 'tv',
    title: 'Sample Series',
    overview: 'A sample TV series to demonstrate detail pages with mock data.',
    seasons: 3,
    genres: ['Sci-Fi', 'Mystery'],
    posterUrl: 'https://picsum.photos/300/450?tv',
    backdropUrl: 'https://picsum.photos/1200/500?tv'
  }
];

export function getById(id: string): Media | null {
  return MOCK_MEDIA.find((m) => m.id === id) ?? null;
}
