import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Card,
  Stack,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MovieIcon from '@mui/icons-material/Movie';
import { movieApi, MovieDetailed } from 'services/movieApi';
import ActorCard from 'components/media/ActorCard';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';

function intersectByName<T extends { name: string }>(arr1: T[], arr2: T[]): T[] {
  const names1 = new Set(arr1.map((g) => g.name));
  return arr2.filter((g) => names1.has(g.name));
}


type ComparePageProps = {
  params: {
    id: string;
    id2: string;
  };
};

export default async function CompareMoviesPage({ params }: ComparePageProps) {
  const { id, id2 } = params;

  let leftMovie, rightMovie;
  try {
    const [leftResponse, rightResponse] = await Promise.all([movieApi.getMovieById(Number(id)), movieApi.getMovieById(Number(id2))]);
    leftMovie = leftResponse.data.data.data[0];
    rightMovie = rightResponse.data.data.data[0];
  } catch (error) {
    console.error('Error fetching movies:', error);
    notFound();
  }

  if (!leftMovie || !rightMovie) notFound();

  const leftYear = leftMovie.release_year;
  const rightYear = rightMovie.release_year;

  // Parse genres and actors
  const parseMovie = (movie: MovieDetailed) => {
    const genres = movie.genres ? movie.genres.split(';').map((g) => g.trim()) : [];
    let actors: { name: string; character: string }[] = [];
    try {
      actors = movie.actors ? JSON.parse(movie.actors) : [];
    } catch (e) {
      console.error('Error parsing actors:', e);
    }
    return { ...movie, genres, actors };
  };

  const leftData = parseMovie(leftMovie);
  const rightData = parseMovie(rightMovie);

  const commonGenres = intersectByName(
    leftData.genres.map((g) => ({ name: g })),
    rightData.genres.map((g) => ({ name: g }))
  );
  const commonActors = intersectByName(leftData.actors, rightData.actors);

  const comparisonFields = [
    { label: 'Year', left: leftYear, right: rightYear },
    { label: 'Runtime', left: leftMovie.runtime_minutes + ' mins', right: rightMovie.runtime_minutes + ' mins' },
    {
      label: 'Rating',
      left: leftMovie.rating || leftMovie.mpa_rating || 'Not Rated',
      right: rightMovie.rating || rightMovie.mpa_rating || 'Not Rated'
    },
    {
      label: 'Budget',
      left: leftMovie.budget ? `$${Number(leftMovie.budget).toLocaleString()}` : '—',
      right: rightMovie.budget ? `$${Number(rightMovie.budget).toLocaleString()}` : '—'
    },
    {
      label: 'Box Office',
      left: leftMovie.box_office ? `$${Number(leftMovie.box_office).toLocaleString()}` : '—',
      right: rightMovie.box_office ? `$${Number(rightMovie.box_office).toLocaleString()}` : '—'
    }
  ];

  const renderMovie = (movie: {
    title:
      | string
      | number
      | bigint
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | Promise<AwaitedReactNode>
      | null
      | undefined;
    original_title:
      | string
      | number
      | bigint
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | Promise<AwaitedReactNode>
      | null
      | undefined;
    release_year:
      | string
      | number
      | bigint
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | Promise<AwaitedReactNode>
      | null
      | undefined;
    runtime_minutes:
      | string
      | number
      | bigint
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | Promise<AwaitedReactNode>
      | null
      | undefined;
    rating: any;
    mpa_rating: any;
    genres: (
      | string
      | number
      | bigint
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | ReactPortal
      | Promise<AwaitedReactNode>
      | Iterable<ReactNode>
      | null
      | undefined
    )[];
    overview:
      | string
      | number
      | bigint
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | Promise<AwaitedReactNode>
      | null
      | undefined;
    director_name:
      | string
      | number
      | bigint
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | Promise<AwaitedReactNode>
      | null
      | undefined;
    actors: { name: string; character: string }[];
  }) => (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Chip icon={<MovieIcon />} label="Movie" color="primary" sx={{ mb: 2, fontSize: 18, py: 1 }} />
      </Box>

      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, textAlign: 'center' }}>
        {movie.title}
      </Typography>

      {movie.original_title && movie.original_title !== movie.title && (
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ textAlign: 'center' }}>
          {movie.original_title}
        </Typography>
      )}

      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2, flexWrap: 'wrap' }} useFlexGap>
        <Typography variant="body1">{movie.release_year}</Typography>
        <Typography variant="body1">•</Typography>
        <Typography variant="body1">{movie.runtime_minutes} mins</Typography>
        <Typography variant="body1">•</Typography>
        <Chip label={movie.rating || movie.mpa_rating || 'Not Rated'} size="small" />
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ mb: 3 }}>
        {movie.genres.map(
          (
            genre:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<AwaitedReactNode>
              | null
              | undefined,
            idx: Key | null | undefined
          ) => (
            <Chip key={idx} label={genre} variant="outlined" size="small" />
          )
        )}
      </Stack>

      {movie.overview && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            OVERVIEW
          </Typography>
          <Typography variant="body1">{movie.overview}</Typography>
        </Box>
      )}

      {movie.director_name && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            DIRECTOR
          </Typography>
          <Typography variant="body1">{movie.director_name}</Typography>
        </Box>
      )}

      {movie.actors.length > 0 && (
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Cast
          </Typography>
          <Grid container spacing={2}>
            {movie.actors.map((actor: { name: string; character: string }, idx: Key | null | undefined) => (
              <Grid item xs={6} sm={4} md={3} key={idx}>
                <ActorCard name={actor.name} character={actor.character} profileUrl="" />
              </Grid>
            ))}
          </Grid>
        </Card>
      )}
    </>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 350, md: 500 },
          backgroundImage: leftMovie.backdrop_url
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${`https://image.tmdb.org/t/p/original${leftMovie.backdrop_url}`})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end'
        }}
      >
        <Container maxWidth="xl" sx={{ pb: 4 }}>
          <Button component={Link} href="/catalog" startIcon={<ArrowBackIcon />} sx={{ mb: 2, color: 'white' }}>
            Back to Catalog
          </Button>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -10, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="start">
          {/* Left Movie */}
          <Grid item xs={12} md={4}>
            <Card elevation={8}>
              {leftMovie.poster_url && (
                <Box
                  component="img"
                  src={`https://image.tmdb.org/t/p/w500${leftMovie.poster_url}`}
                  alt={leftMovie.title}
                  sx={{ width: '100%', display: 'block', borderRadius: 1 }}
                />
              )}
            </Card>
            {renderMovie(leftData)}
          </Grid>

          {/* Comparison Section */}
          <Grid item xs={12} md={4} sx={{ mt: 20 }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, textAlign: 'center' }}>
                Comparison
              </Typography>
              <Stack spacing={3}>
                {comparisonFields.map((field) => (
                  <Stack key={field.label} direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body1" sx={{ fontWeight: 500, width: '30%', textAlign: 'right' }}>
                      {field.left}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ width: '40%', textAlign: 'center', fontWeight: 600 }}>
                      {field.label}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, width: '30%', textAlign: 'left' }}>
                      {field.right}
                    </Typography>
                  </Stack>
                ))}

                {/* Common Genres */}
                <Box>
                  <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 600 }}>
                    Common Genres
                  </Typography>
                  {commonGenres.length > 0 ? (
                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mt: 1 }}>
                      {commonGenres.map((genre, idx) => (
                        <Chip key={idx} label={genre.name} variant="outlined" size="small" />
                      ))}
                    </Stack>
                  ) : (
                    <Typography textAlign="center" sx={{ mt: 1 }}>
                      No common genres
                    </Typography>
                  )}
                </Box>

                {/* Common Actors */}
                <Box>
                  <Typography variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 600 }}>
                    Common Actors
                  </Typography>
                  {commonActors.length > 0 ? (
                    <Stack spacing={1} maxHeight={200} overflow="auto" sx={{ mt: 1 }}>
                      {commonActors.slice(0, 5).map((actor, idx) => (
                        <Typography key={idx} textAlign="center">
                          {actor.name} as {actor.character}
                        </Typography>
                      ))}
                      {commonActors.length > 5 && <Typography textAlign="center">and {commonActors.length - 5} more...</Typography>}
                    </Stack>
                  ) : (
                    <Typography textAlign="center" sx={{ mt: 1 }}>
                      No common actors
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Right Movie */}
          <Grid item xs={12} md={4}>
            <Card elevation={8}>
              {rightMovie.poster_url && (
                <Box
                  component="img"
                  src={`https://image.tmdb.org/t/p/w500${rightMovie.poster_url}`}
                  alt={rightMovie.title}
                  sx={{ width: '100%', display: 'block', borderRadius: 1 }}
                />
              )}
            </Card>
            {renderMovie(rightData)}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
