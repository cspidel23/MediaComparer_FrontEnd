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
  InputLabel,
  CardActions,
  Button,
  IconButton,
  Fab,
  Zoom
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

// project import
import { MOCK_MEDIA, Media } from 'app/mock/media';

export default function MediaList() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedGenres, setSelectedGenres] = React.useState<number[]>([]);
  const [sortBy, setSortBy] = React.useState<string>('popularity');

  // Compare mode states
  const [selectedForCompare, setSelectedForCompare] = React.useState<Media[]>([]);
  const [compareType, setCompareType] = React.useState<string | null>(null);

  const handleTypeFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: string) => {
    if (newFilter !== null) {
      setTypeFilter(newFilter);
    }
  };

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) => (prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]));
  };

// Toggle a media card's compare selection
  const toggleCompare = (media: Media) => {
    const isSelected = selectedForCompare.some((m) => {
      if (media.type === 'tv' && m.type === 'tv') {
        return m.show_id === media.show_id;
      }
      if (media.type === 'movie' && m.type === 'movie') {
        return m.movie_id === media.movie_id;
      }
      return false;
    });

    if (isSelected) {
      // Deselect
      const newSelected = selectedForCompare.filter((m) => {
        if (media.type === 'tv' && m.type === 'tv') {
          return m.show_id !== media.show_id;
        }
        if (media.type === 'movie' && m.type === 'movie') {
          return m.movie_id !== media.movie_id;
        }
        return true;
      });
      setSelectedForCompare(newSelected);
      if (newSelected.length === 0) {
        setCompareType(null);
      }
    } else {
      // Select only if under limit and type matches or not set
      if (selectedForCompare.length < 2 && (compareType === null || compareType === media.type)) {
        setSelectedForCompare([...selectedForCompare, media]);
        if (!compareType) {
          setCompareType(media.type);
        }
      }
    }
  };

// Check if a media is selected for compare
  const isSelectedForCompare = (media: Media): boolean => {
    return selectedForCompare.some((m) => {
      if (media.type === 'tv' && m.type === 'tv') {
        return m.show_id === media.show_id;
      }
      if (media.type === 'movie' && m.type === 'movie') {
        return m.movie_id === media.movie_id;
      }
      return false;
    });
  };


  // Confirm comparison and navigate
  // TODO: need the correct route for a different page where we do the comparison
  const confirmCompare = () => {
    // For real app, likely pass selectedForCompare info (via context, state, query, etc.)
    router.push('/compare');
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
    if (selectedForCompare.length > 0) return; // disable navigation during compare mode
    const id = media.type === 'tv' ? media.show_id : media.movie_id;
    router.push(`/${media.type}/${id}`);
  };

  const getTitle = (media: Media) => (media.type === 'tv' ? media.name : media.title);
  const getYear = (media: Media) =>
    media.type === 'tv' ? (media.first_air_date ? new Date(media.first_air_date).getFullYear() : null) : media.release_date ? new Date(media.release_date).getFullYear() : null;
  const getMetadata = (media: Media) =>
    media.type === 'tv' ? `${media.seasons} Season${media.seasons > 1 ? 's' : ''} • ${media.episodes} Episodes` : `${media.runtime_minutes} mins`;

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
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
          {filteredMedia.map((media) => {
            const greyOut = (() => {
              if (compareType === null) return false;
              if (media.type !== compareType) return true;
              if (selectedForCompare.length === 2 && !isSelectedForCompare(media)) return true;
              return false;
            })();
            const disableInteraction = greyOut;
            const selected = isSelectedForCompare(media);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={media.type === 'tv' ? media.show_id : media.movie_id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: disableInteraction ? 'default' : 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s, filter 0.3s, opacity 0.3s',
                    outline: 'none',
                    filter: greyOut ? 'grayscale(80%)' : 'none',
                    opacity: greyOut ? 0.5 : 1,
                    pointerEvents: disableInteraction ? 'none' : 'auto',
                    border: selected ? '4px solid' : 'none',
                    borderColor: selected ? 'primary.main' : 'transparent',
                    '&:hover': disableInteraction
                      ? {}
                      : {
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
                  aria-selected={selected}
                >
                  {/* Poster Image */}
                  <CardMedia
                    component="img"
                    height="400"
                    image={media.poster_url}
                    alt={getTitle(media)}
                    sx={{ objectFit: 'cover', transition: 'filter 0.3s, opacity 0.3s', filter: greyOut ? 'grayscale(80%)' : 'none', opacity: greyOut ? 0.5 : 1 }}
                  />

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        icon={media.type === 'movie' ? <MovieIcon /> : <TvIcon />}
                        label={media.type === 'movie' ? 'Movie' : 'TV Show'}
                        size="small"
                        color={media.type === 'movie' ? 'primary' : 'secondary'}
                      />
                    </Box>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.2, mb: 1 }}>
                      {getTitle(media)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {getYear(media)} • {getMetadata(media)}
                    </Typography>

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

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {media.genres.slice(0, 3).map((genre) => (
                        <Chip key={genre.genre_id} label={genre.name} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>

                  <CardActions
                    sx={{
                      px: 2,
                      py: 2,
                      pt: 1.5,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1
                    }}
                  >
                    <IconButton
                      size="large"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Your delete handler here
                      }}
                      sx={{
                        '& svg': {
                          fontSize: 28
                        }
                      }}
                      aria-label="delete media"
                    >
                      <DeleteIcon />
                    </IconButton>

                    <Button
                      variant={selected ? 'contained' : 'outlined'}
                      size="medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(media);
                      }}
                      aria-pressed={selected}
                      startIcon={<CompareArrowsIcon />}
                    >
                      Compare
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Confirm Compare FAB */}
      <Zoom in={selectedForCompare.length === 2}>
        <Fab
          color="primary"
          aria-label="confirm compare"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: (theme) => theme.zIndex.tooltip + 1,
            boxShadow: 6
          }}
          onClick={confirmCompare}
        >
          <CompareArrowsIcon />
        </Fab>
      </Zoom>
    </Container>
  );
}
