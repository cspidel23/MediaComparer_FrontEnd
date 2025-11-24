import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Box, Container, Typography, Chip, Grid, Card, Stack, Button, CardMedia } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MovieIcon from '@mui/icons-material/Movie';
import { movieApi } from 'services/movieApi';

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let movie;
  try {
    const response = await movieApi.getMovieById(Number(id));
    movie = response.data.data.data[0]; // API returns array with single movie
  } catch (error) {
    console.error('Error fetching movie:', error);
    notFound();
  }

  if (!movie) notFound();

  const year = movie.release_year;
  const posterUrl = movie.poster_url ? `https://image.tmdb.org/t/p/w500${movie.poster_url}` : '';
  const backdropUrl = movie.backdrop_url ? `https://image.tmdb.org/t/p/original${movie.backdrop_url}` : '';

  // Parse genres from semicolon-separated string
  const genres = movie.genres ? movie.genres.split(';').map((g) => g.trim()) : [];

  // Parse actors from JSON string
  let actors: { name: string; character: string }[] = [];
  try {
    actors = movie.actors ? JSON.parse(movie.actors) : [];
  } catch (e) {
    console.error('Error parsing actors:', e);
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 4 }}>
      {/* Backdrop */}
      {backdropUrl && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '500px',
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(18,18,18,0.8) 70%, rgb(18,18,18) 100%), url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
      )}

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Button component={Link} href="/catalog" startIcon={<ArrowBackIcon />} sx={{ mb: 4 }}>
          Back to Catalog
        </Button>
      </Container>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Poster */}
          {posterUrl && (
            <Grid item xs={12} md={4} lg={3}>
              <CardMedia
                component="img"
                image={posterUrl}
                alt={movie.title}
                sx={{
                  borderRadius: 2,
                  boxShadow: 6,
                  width: '100%',
                  height: 'auto'
                }}
              />
            </Grid>
          )}

          {/* Main Content */}
          <Grid item xs={12} md={posterUrl ? 8 : 12} lg={posterUrl ? 9 : 12}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Chip icon={<MovieIcon />} label="Movie" color="primary" sx={{ mb: 2 }} />
              </Box>

              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {movie.title}
              </Typography>

              {movie.original_title && movie.original_title !== movie.title && (
                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
                  {movie.original_title}
                </Typography>
              )}

              {/* Meta Info */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, flexWrap: 'wrap' }} useFlexGap>
                <Typography variant="body1">{year}</Typography>
                <Typography variant="body1">•</Typography>
                <Typography variant="body1">{movie.runtime_minutes} mins</Typography>
                <Typography variant="body1">•</Typography>
                <Chip label={movie.rating || movie.mpa_rating || 'Not Rated'} size="small" />
              </Stack>

              {/* Genres */}
              {genres.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {genres.map((genre, index) => (
                      <Chip key={index} label={genre} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Overview */}
              {movie.overview && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    OVERVIEW
                  </Typography>
                  <Typography variant="body1">{movie.overview}</Typography>
                </Box>
              )}

              {/* Director */}
              {movie.director_name && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    DIRECTOR
                  </Typography>
                  <Typography variant="body1">{movie.director_name}</Typography>
                </Box>
              )}

              {/* Budget & Box Office */}
              <Grid container spacing={3}>
                {movie.budget && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      BUDGET
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ${parseInt(movie.budget).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
                {movie.box_office && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      BOX OFFICE
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ${parseFloat(movie.box_office).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Card>

            {/* Cast */}
            {actors.length > 0 && (
              <Card sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Cast
                </Typography>
                <Grid container spacing={2}>
                  {actors.slice(0, 12).map((actor, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          bgcolor: 'action.hover',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'action.selected',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {actor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {actor.character}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
