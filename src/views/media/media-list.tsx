'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Rating,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import SearchIcon from '@mui/icons-material/Search';

// project import
import { MOCK_MEDIA, Media } from 'app/mock/media';

export default function MediaList() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedGenres, setSelectedGenres] = React.useState<number[]>([]);
  const [sortBy, setSortBy] = React.useState<string>('popularity');

  const handleTypeFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: string) => {
    if (newFilter !== null) {
      setTypeFilter(newFilter);
    }
  };

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) => (prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]));
  };

  // Get all unique genres from media
  const allGenres = React.useMemo(() => {
    const genreMap = new Map();
    MOCK_MEDIA.forEach((media) => {
      media.genres.forEach((genre) => {
        if (!genreMap.has(genre.genre_id)) {
          genreMap.set(genre.genre_id, genre.name);
        }
      });
    });
    return Array.from(genreMap, ([genre_id, name]) => ({ genre_id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredMedia = React.useMemo(() => {
    let result = MOCK_MEDIA;

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((media) => media.type === typeFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((media) => {
        const title = media.type === 'tv' ? media.name : media.title;
        return title.toLowerCase().includes(query);
      });
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      result = result.filter((media) => media.genres.some((genre) => selectedGenres.includes(genre.genre_id)));
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.tmdb_rating - a.tmdb_rating;
        case 'popularity':
          return b.popularity - a.popularity;
        case 'alphabetical':
          const titleA = a.type === 'tv' ? a.name : a.title;
          const titleB = b.type === 'tv' ? b.name : b.title;
          return titleA.localeCompare(titleB);
        case 'year':
          const yearA = a.type === 'tv' ? new Date(a.first_air_date).getFullYear() : new Date(a.release_date).getFullYear();
          const yearB = b.type === 'tv' ? new Date(b.first_air_date).getFullYear() : new Date(b.release_date).getFullYear();
          return yearB - yearA;
        default:
          return 0;
      }
    });

    return result;
  }, [typeFilter, searchQuery, selectedGenres, sortBy]);

  const handleMediaClick = (media: Media) => {
    const id = media.type === 'tv' ? media.show_id : media.movie_id;
    router.push(`/${media.type}/${id}`);
  };

  const getTitle = (media: Media) => {
    return media.type === 'tv' ? media.name : media.title;
  };

  const getYear = (media: Media) => {
    if (media.type === 'tv') {
      return media.first_air_date ? new Date(media.first_air_date).getFullYear() : null;
    } else {
      return media.release_date ? new Date(media.release_date).getFullYear() : null;
    }
  };

  const getMetadata = (media: Media) => {
    if (media.type === 'tv') {
      return `${media.seasons} Season${media.seasons > 1 ? 's' : ''} • ${media.episodes} Episodes`;
    } else {
      return `${media.runtime_minutes} mins`;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Media Catalog
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Browse our collection of movies and TV shows
        </Typography>

        {/* Search Bar */}
        <Box sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Type Filter Buttons */}
        <ToggleButtonGroup
          value={typeFilter}
          exclusive
          onChange={handleTypeFilterChange}
          aria-label="media type filter"
          color="primary"
          sx={{ mb: 3 }}
        >
          <ToggleButton value="all" aria-label="all media">
            All ({MOCK_MEDIA.length})
          </ToggleButton>
          <ToggleButton value="movie" aria-label="movies">
            Movies ({MOCK_MEDIA.filter((m) => m.type === 'movie').length})
          </ToggleButton>
          <ToggleButton value="tv" aria-label="tv shows">
            TV Shows ({MOCK_MEDIA.filter((m) => m.type === 'tv').length})
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Genre Filters */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Filter by Genre
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
            {allGenres.map((genre) => (
              <Chip
                key={genre.genre_id}
                label={genre.name}
                onClick={() => handleGenreToggle(genre.genre_id)}
                color={selectedGenres.includes(genre.genre_id) ? 'primary' : 'default'}
                variant={selectedGenres.includes(genre.genre_id) ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </Box>

        {/* Sort Dropdown */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="popularity">Most Popular</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
            <MenuItem value="alphabetical">A-Z</MenuItem>
            <MenuItem value="year">Newest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Results Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredMedia.length} of {MOCK_MEDIA.length} titles
        </Typography>
      </Box>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No media found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your filters or search query
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMedia.map((media) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={media.type === 'tv' ? media.show_id : media.movie_id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  outline: 'none',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px'
                  }
                }}
                onClick={() => handleMediaClick(media)}
                tabIndex={0}
              >
                {/* Poster Image */}
                <CardMedia
                  component="img"
                  height="400"
                  image={media.poster_url}
                  alt={getTitle(media)}
                  sx={{ objectFit: 'cover' }}
                />

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  {/* Type Badge */}
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      icon={media.type === 'movie' ? <MovieIcon /> : <TvIcon />}
                      label={media.type === 'movie' ? 'Movie' : 'TV Show'}
                      size="small"
                      color={media.type === 'movie' ? 'primary' : 'secondary'}
                    />
                  </Box>

                  {/* Title */}
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.2, mb: 1 }}>
                    {getTitle(media)}
                  </Typography>

                  {/* Year & Metadata */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {getYear(media)} • {getMetadata(media)}
                  </Typography>

                  {/* Rating */}
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Rating
                      value={media.tmdb_rating / 2}
                      readOnly
                      precision={0.1}
                      size="small"
                      icon={<StarIcon fontSize="inherit" />}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {media.tmdb_rating.toFixed(1)}
                    </Typography>
                  </Stack>

                  {/* Genres */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {media.genres.slice(0, 3).map((genre) => (
                      <Chip key={genre.genre_id} label={genre.name} size="small" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
