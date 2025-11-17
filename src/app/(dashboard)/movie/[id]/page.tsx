import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Box, Container, Typography, Chip, Grid, Card, CardContent, Stack, Rating, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MovieIcon from '@mui/icons-material/Movie';
import { getById } from '../../../mock/media';

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = getById(id);
  if (!media || media.type !== 'movie') notFound();

  const year = media.release_date ? new Date(media.release_date).getFullYear() : null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section with Backdrop */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, md: 500 },
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${media.backdrop_url})`,
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

      <Container maxWidth="xl" sx={{ mt: -15, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Poster */}
          <Grid item xs={12} md={3}>
            <Card elevation={8}>
              <Box
                component="img"
                src={media.poster_url}
                alt={media.title}
                sx={{
                  width: '100%',
                  display: 'block',
                  borderRadius: 1
                }}
              />
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Chip icon={<MovieIcon />} label="Movie" color="primary" sx={{ mb: 2 }} />
              </Box>

              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {media.title}
              </Typography>

              {media.original_title !== media.title && (
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {media.original_title}
                </Typography>
              )}

              {/* Meta Info */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="body1">{year}</Typography>
                <Typography variant="body1">•</Typography>
                <Typography variant="body1">{media.runtime_minutes} mins</Typography>
                <Typography variant="body1">•</Typography>
                <Chip label={media.rating} size="small" />
              </Stack>

              {/* Rating */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <Rating value={media.tmdb_rating / 2} readOnly precision={0.1} icon={<StarIcon fontSize="inherit" />} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {media.tmdb_rating.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({media.vote_count.toLocaleString()} votes)
                </Typography>
              </Stack>

              {/* Genres */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  GENRES
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {media.genres.map((genre) => (
                    <Chip key={genre.genre_id} label={genre.name} variant="outlined" />
                  ))}
                </Stack>
              </Box>

              {/* Overview */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  OVERVIEW
                </Typography>
                <Typography variant="body1" paragraph>
                  {media.overview}
                </Typography>
              </Box>

              {/* Director */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  DIRECTOR
                </Typography>
                <Typography variant="body1">{media.director_name}</Typography>
              </Box>

              {/* Box Office */}
              {media.box_office && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    BOX OFFICE
                  </Typography>
                  <Typography variant="body1">{media.box_office}</Typography>
                </Box>
              )}
            </Card>

            {/* Cast */}
            {media.actors && media.actors.length > 0 && (
              <Card sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Cast
                </Typography>
                <Grid container spacing={2}>
                  {media.actors.map((actor) => (
                    <Grid item xs={6} sm={4} md={3} key={actor.actor_id}>
                      <Card variant="outlined">
                        <Box
                          component="img"
                          src={actor.profile_url}
                          alt={actor.name}
                          sx={{
                            width: '100%',
                            aspectRatio: '2/3',
                            objectFit: 'cover'
                          }}
                        />
                        <CardContent sx={{ p: 1.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {actor.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {actor.character}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            )}

            {/* Production Companies */}
            {media.companies && media.companies.length > 0 && (
              <Card sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Production Companies
                </Typography>
                <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                  {media.companies.map((company) => (
                    <Box key={company.company_id} sx={{ textAlign: 'center' }}>
                      <Box
                        component="img"
                        src={company.logo}
                        alt={company.name}
                        sx={{
                          height: 50,
                          maxWidth: 120,
                          objectFit: 'contain',
                          bgcolor: 'white',
                          p: 1,
                          borderRadius: 1,
                          mb: 1
                        }}
                      />
                      <Typography variant="caption" display="block">
                        {company.name}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
