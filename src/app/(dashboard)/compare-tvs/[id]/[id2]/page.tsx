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
  Rating,
  Button
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TvIcon from '@mui/icons-material/Tv';
import { tvApi, TVShowDetailed } from 'services/tvApi';
import NetworkInfo from 'components/media/NetworkInfo';
import ActorCard from 'components/media/ActorCard';
import ProductionCompany from 'components/media/ProductionCompany';


function intersectByName(arr1: { name: any }[], arr2: any[]) {
  const names1 = new Set(arr1.map((g: { name: any }) => g.name));
  return arr2.filter((g: { name: unknown }) => names1.has(g.name));
}

export default async function CompareTvsPage({ params }: any) {
  const { id, id2 } = params;

  let leftMedia;
  let rightMedia;
  try {
    const [leftResponse, rightResponse] = await Promise.all([
      tvApi.getShowById(Number(id)),
      tvApi.getShowById(Number(id2))
    ]);
    leftMedia = leftResponse.data;
    rightMedia = rightResponse.data;
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    notFound();
  }

  if (!leftMedia || !rightMedia) notFound();

  const leftYear = leftMedia.first_air_date
    ? new Date(leftMedia.first_air_date).getFullYear()
    : null;
  const rightYear = rightMedia.first_air_date
    ? new Date(rightMedia.first_air_date).getFullYear()
    : null;

  const commonGenres = intersectByName(leftMedia.genres, rightMedia.genres);
  const commonActors = intersectByName(leftMedia.actors || [], rightMedia.actors || []);

  const comparisonFields = [
    {
      label: 'Year',
      left: leftYear ?? '—',
      right: rightYear ?? '—'
    },
    {
      label: 'Seasons',
      left: leftMedia.seasons,
      right: rightMedia.seasons
    },
    {
      label: 'Episodes',
      left: leftMedia.episodes,
      right: rightMedia.episodes
    },
    {
      label: 'TMDb Rating',
      left: leftMedia.tmdb_rating.toFixed(1),
      right: rightMedia.tmdb_rating.toFixed(1)
    }
  ];

  const renderMedia = (media: TVShowDetailed, year: any) => (
    <>
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

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Rating
          value={media.tmdb_rating / 2}
          readOnly
          precision={0.1}
          icon={<StarIcon fontSize="inherit" />}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {media.tmdb_rating.toFixed(1)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ({media.vote_count.toLocaleString()} votes)
        </Typography>
      </Stack>

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

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          OVERVIEW
        </Typography>
        <Typography variant="body1" paragraph>
          {media.overview}
        </Typography>
      </Box>

      {media.creators && media.creators.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            CREATORS
          </Typography>
          <Typography variant="body1">{media.creators.join(', ')}</Typography>
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          NETWORK
        </Typography>
        <NetworkInfo name={media.network.name} logo={media.network.logo} />
      </Box>

      {media.actors && media.actors.length > 0 && (
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Cast
          </Typography>
          <Grid container spacing={2}>
            {media.actors.map((actor) => (
              <Grid item xs={6} sm={4} md={3} key={actor.actor_id}>
                <ActorCard
                  name={actor.name}
                  character={actor.character}
                  profileUrl={actor.profile_url}
                />
              </Grid>
            ))}
          </Grid>
        </Card>
      )}

      {media.companies && media.companies.length > 0 && (
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Production Companies
          </Typography>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            {[...media.companies]
              .sort((a, b) => {
                const aHasLogo = a.logo && a.logo.trim() !== '';
                const bHasLogo = b.logo && b.logo.trim() !== '';
                if (aHasLogo && !bHasLogo) return -1;
                if (!aHasLogo && bHasLogo) return 1;
                return 0;
              })
              .map((company) => (
                <ProductionCompany
                  key={company.company_id}
                  name={company.name}
                  logo={company.logo}
                />
              ))}
          </Stack>
        </Card>
      )}
    </>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 250, md: 120 }, // EXTENDED DOWNWARD
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${leftMedia.backdrop_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end'
        }}
      >
        <Container maxWidth="xl" sx={{ pb: 3 }}>
          <Button
            component={Link}
            href="/catalog"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 1, color: 'white' }}
          >
            Back to Catalog
          </Button>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="start">
          {/* Left Show */}
          <Grid item xs={12} md={4}>
            <Card elevation={8}>
              <Box
                component="img"
                src={leftMedia.poster_url}
                alt={leftMedia.name}
                sx={{
                  width: '100%',
                  display: 'block',
                  borderRadius: 1
                }}
              />
            </Card>
            {renderMedia(leftMedia, leftYear)}
          </Grid>

          {/* Comparison Section */}
          {/* Comparison Section */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              position: 'sticky',
              top: '50%',
              transform: 'translateY(-50%)',
              height: 'fit-content',
              zIndex: 5,
            }}
          >
            <Card
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                width: '100%',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              <Typography
                variant="h3"
                gutterBottom
                sx={{ fontWeight: 700, textAlign: 'center' }}
              >
                Comparison
              </Typography>

              <Stack spacing={3}>
                {comparisonFields.map((field) => (
                  <Stack
                    key={field.label}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        width: '30%',
                        textAlign: 'right'
                      }}
                    >
                      {field.left}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        width: '40%',
                        textAlign: 'center',
                        fontWeight: 600
                      }}
                    >
                      {field.label}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        width: '30%',
                        textAlign: 'left'
                      }}
                    >
                      {field.right}
                    </Typography>
                  </Stack>
                ))}

                {/* Common Genres */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ textAlign: 'center', fontWeight: 600 }}
                  >
                    Common Genres
                  </Typography>

                  {commonGenres.length > 0 ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      flexWrap="wrap"
                      sx={{ mt: 1 }}
                    >
                      {commonGenres.map((genre) => (
                        <Chip
                          key={genre.genre_id}
                          label={genre.name}
                          variant="outlined"
                          size="small"
                        />
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
                  <Typography
                    variant="subtitle1"
                    sx={{ textAlign: 'center', fontWeight: 600 }}
                  >
                    Common Actors
                  </Typography>

                  {commonActors.length > 0 ? (
                    <Stack spacing={1} maxHeight={200} overflow="auto" sx={{ mt: 1 }}>
                      {commonActors.slice(0, 5).map((actor) => (
                        <Typography key={actor.actor_id} textAlign="center">
                          {actor.name} as {actor.character}
                        </Typography>
                      ))}
                      {commonActors.length > 5 && (
                        <Typography textAlign="center">
                          and {commonActors.length - 5} more...
                        </Typography>
                      )}
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


          {/* Right Show */}
          <Grid item xs={12} md={4}>
            <Card elevation={8}>
              <Box
                component="img"
                src={rightMedia.poster_url}
                alt={rightMedia.name}
                sx={{
                  width: '100%',
                  display: 'block',
                  borderRadius: 1
                }}
              />
            </Card>
            {renderMedia(rightMedia, rightYear)}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
