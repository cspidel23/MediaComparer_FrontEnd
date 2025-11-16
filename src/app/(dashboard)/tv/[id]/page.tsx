import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Box, Container, Typography, Chip, Grid, Card, CardContent, Avatar, Stack, Rating, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TvIcon from '@mui/icons-material/Tv';
import { getById } from '../../../mock/media';

export default async function TvPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = getById(id);
  if (!media || media.type !== 'tv') notFound();

  const year = media.first_air_date ? new Date(media.first_air_date).getFullYear() : null;

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
                alt={media.name}
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
                <Chip icon={<TvIcon />} label="TV Show" color="secondary" sx={{ mb: 2 }} />
              </Box>

              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {media.name}
              </Typography>

              {media.original_name !== media.name && (
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {media.original_name}
                </Typography>
              )}

              {/* Meta Info */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="body1">{year}</Typography>
                <Typography variant="body1">•</Typography>
                <Typography variant="body1">
                  {media.seasons} Season{media.seasons > 1 ? 's' : ''}
                </Typography>
                <Typography variant="body1">•</Typography>
                <Typography variant="body1">{media.episodes} Episodes</Typography>
                <Typography variant="body1">•</Typography>
                <Chip label={media.status} size="small" />
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

              {/* Creators */}
              {media.creators && media.creators.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    CREATORS
                  </Typography>
                  <Typography variant="body1">{media.creators.join(', ')}</Typography>
                </Box>
              )}

              {/* Network */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  NETWORK
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    src={media.network.logo}
                    alt={media.network.name}
                    sx={{ height: 40, objectFit: 'contain', bgcolor: 'white', p: 1, borderRadius: 1 }}
                  />
                  <Typography variant="body1">{media.network.name}</Typography>
                </Box>
              </Box>
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
